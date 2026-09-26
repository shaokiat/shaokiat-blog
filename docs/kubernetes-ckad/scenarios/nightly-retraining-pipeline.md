---
title: Nightly Retraining Pipeline
sidebar_label: Nightly Retraining Pipeline
sidebar_position: 2
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Scenario: Nightly Retraining Pipeline

> Builds on: [Jobs & CronJobs](../reference/jobs-and-cronjobs.md) · [Storage](../reference/storage.md) · [Config & Secrets](../reference/config-and-secrets.md) · [Resources & Scaling](../reference/resources-and-scaling.md)

## Situation

The recommendation model from [ML Model Serving](./ml-model-serving.md) goes stale within days. The data team wants it retrained every night on the previous day's events: pull about 50 GB of data, train for 1–3 hours, evaluate, and publish the model if it beats the current one. Today someone runs a script on a VM by hand. Last month two runs overlapped after a slow night, both wrote to the same output directory, and a corrupted model reached production.

## Requirements

| Requirement | Kubernetes mechanism |
|---|---|
| Run at 02:00 Singapore time every night | CronJob `schedule` + `timeZone` |
| Never run two trainings at once | `concurrencyPolicy: Forbid` |
| Retry transient failures, but not forever | `backoffLimit` + `activeDeadlineSeconds` |
| Keep the 50 GB dataset between steps and between retries | PVC with `Retain` |
| Publish only a model that passed evaluation | Atomic publish at the end of a successful run |
| Don't starve the serving workloads | Separate namespace with a ResourceQuota |
| Tell someone when it fails or doesn't run | Alert on Job failure and on last-success age |

## Architecture

<ThemedImage
  alt="CronJob retrain creates a Job at 02:00; the Job's Pod runs an init container that fetches data and a train container that works on a PVC and pushes the model to a registry; a timeline shows Tuesday's run skipped because Monday's overran under concurrencyPolicy Forbid"
  sources={{
    light: useBaseUrl('/img/kubernetes-ckad/fig-nightly-retraining-pipeline-1-light.svg'),
    dark: useBaseUrl('/img/kubernetes-ckad/fig-nightly-retraining-pipeline-1-dark.svg'),
  }}
/>

*Figure S2-1: The retraining pipeline. Amber is the CronJob and the failure it guards against: an overrunning run. Green is the persistent storage that survives retries. The dashed box is a run that `Forbid` skipped.*

## Kubernetes resources used

| Resource | Role here | Reference |
|---|---|---|
| CronJob | Creates one Job per night, never two at once | [Jobs & CronJobs](../reference/jobs-and-cronjobs.md) |
| Job | Retries on failure, stops at a deadline | [Jobs & CronJobs](../reference/jobs-and-cronjobs.md#job-fields) |
| Init container | Fetches data before training starts | [Pods & Multi-Container](../reference/pods-and-multi-container.md) |
| PersistentVolumeClaim | Holds the dataset and checkpoints across retries | [Storage](../reference/storage.md) |
| Secret | Credentials for the data bucket and model registry | [Config & Secrets](../reference/config-and-secrets.md) |
| ResourceQuota | Caps what training can take from the cluster | [Resources & Scaling](../reference/resources-and-scaling.md) |

## Walkthrough

**1. Storage that survives retries.** A PVC with `Retain` holds the downloaded data and training checkpoints. If the Pod fails at hour two, the retry resumes from the last checkpoint instead of downloading 50 GB again. RWO is enough, because `Forbid` guarantees one Pod at a time.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: training-data
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 100Gi
```

**2. The CronJob.** Every guard rail is explicit:

| Field | Value | Failure it prevents |
|---|---|---|
| `timeZone` | `Asia/Singapore` | Running at 10:00 local because the cluster is on UTC |
| `concurrencyPolicy` | `Forbid` | Two runs writing the same files (last month's incident) |
| `startingDeadlineSeconds` | 3600 | A run starting at noon after a control-plane outage and competing with daytime load |
| `backoffLimit` | 2 | Retrying a deterministic failure all night |
| `activeDeadlineSeconds` | 14400 | A hung run blocking every later run under `Forbid` |
| `restartPolicy` | `Never` | Losing the failed attempt's logs |

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: retrain
spec:
  schedule: "0 2 * * *"
  timeZone: Asia/Singapore
  concurrencyPolicy: Forbid
  startingDeadlineSeconds: 3600
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 5
  jobTemplate:
    spec:
      backoffLimit: 2
      activeDeadlineSeconds: 14400
      template:
        spec:
          restartPolicy: Never
          initContainers:
          - name: fetch-data
            image: ghcr.io/example/data-sync:1.2           # placeholder
            args: ["--date=yesterday", "--dest=/data/raw"]
            envFrom: [{secretRef: {name: bucket-creds}}]
            volumeMounts: [{name: data, mountPath: /data}]
          containers:
          - name: train
            image: ghcr.io/example/recsys-train:5.0        # placeholder
            args: ["--data=/data/raw", "--checkpoints=/data/ckpt", "--out=/data/out"]
            envFrom: [{secretRef: {name: registry-creds}}]
            resources:
              requests: {cpu: "8", memory: 32Gi}
              limits: {memory: 32Gi}
            volumeMounts: [{name: data, mountPath: /data}]
          volumes:
          - name: data
            persistentVolumeClaim: {claimName: training-data}
```

**3. Publish atomically.** The training container evaluates the new model against the current one and only then uploads it under a new versioned path (`models/recsys/v8/`), writing a `LATEST` pointer last. A crash mid-upload leaves `LATEST` pointing at v7. Serving never sees a half-written model.

**4. Hand-off to serving.** Promotion is a separate, reviewable step: CI updates the model path in the serving Deployment's init container args, which triggers a normal rolling update (→ [ML Model Serving](./ml-model-serving.md#walkthrough)). Training never touches production directly.

**5. Fence it off.** Training runs in its own namespace `ml-training` with a ResourceQuota. It can use spare capacity at night but can never take what the serving namespace needs.

**6. Operate it.**

```bash
kubectl -n ml-training create job retrain-manual --from=cronjob/retrain   # rerun after a fix
kubectl -n ml-training get jobs --sort-by=.metadata.creationTimestamp
kubectl -n ml-training logs job/retrain-manual -c train -f
kubectl -n ml-training patch cronjob retrain -p '{"spec":{"suspend":true}}'   # pause during an incident
```

## How I'd explain this in an interview

> "I'd model it as a CronJob because it's scheduled batch work with a clear 'done'. The incident was two overlapping runs, so the first setting is concurrencyPolicy Forbid. That alone creates a new risk: a hung run would block every later night. So I pair it with activeDeadlineSeconds, a hard four-hour cap. I set timeZone explicitly, because cron in UTC is the classic surprise. Retries are bounded with backoffLimit 2, and restartPolicy Never keeps the failed Pod so I can read its logs. The dataset and checkpoints live on a PVC with Retain, so a retry resumes rather than starting from zero. Publishing is atomic: versioned paths plus a pointer written last, so serving never sees a partial model. Promotion to serving is a separate CI step, so a bad model is a reviewed rollout I can undo. And I'd alert on 'last successful run older than 26 hours', because a job that silently stops running is worse than one that fails loudly."

## Follow-up questions

**★★ Why not `concurrencyPolicy: Replace`?**

<details>
<summary>Model answer</summary>

- **Clarify:** is a fresh run on newer data more valuable than finishing the old one?
- **Observe:** `Replace` kills the running Job when the next schedule arrives.
- **Hypothesise:** a run that takes longer than 24 hours would then be killed every night and never finish. With checkpoints on a shared PVC, a killed run can also leave checkpoints in a half-written state.
- **Fix:** `Forbid` plus a deadline: a slow night delays the next model by a day, which is acceptable for a daily model.
- **Prevent:** alert when a run exceeds its usual duration, before it hits the deadline.

</details>

**★★ The job didn't run last night and nobody noticed for a week. How do you prevent that?**

<details>
<summary>Model answer</summary>

- **Clarify:** didn't start, or started and failed?
- **Observe:** `kubectl get cronjob` → `LAST SCHEDULE` and `SUSPEND`. A suspended CronJob or a missed `startingDeadlineSeconds` produces no failed Job, so failure alerts never fire.
- **Hypothesise:** alerting on failure misses runs that never happened.
- **Fix:** alert on `now - lastSuccessfulTime > 26h`. The CronJob status exposes `lastSuccessfulTime`, and kube-state-metrics exports it.
- **Prevent:** a dead man's switch: the job pings a monitoring endpoint on success, and silence raises the alarm.

</details>

**★★★ Training now needs a GPU and several workers. What changes?**

<details>
<summary>Model answer</summary>

- **Clarify:** data-parallel training across N workers? Do workers need stable addresses to find each other?
- **Observe:** a plain Job with `parallelism` gives independent Pods with no identity or coordinated start.
- **Hypothesise:** workers need stable hostnames and all-or-nothing scheduling, or half the workers sit idle holding GPUs.
- **Fix:** an Indexed Job with a headless Service gives each worker a stable DNS name and rank (`JOB_COMPLETION_INDEX`). GPUs are requested with `resources.limits: {nvidia.com/gpu: 1}`. For gang scheduling and queueing, use Kueue or JobSet, or an operator such as the Kubeflow Training Operator.
- **Prevent:** a separate GPU node pool with taints, so only training Pods land there.

</details>
