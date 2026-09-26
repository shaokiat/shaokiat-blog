---
title: Jobs & CronJobs
sidebar_label: Jobs & CronJobs
sidebar_position: 3
---

# Jobs & CronJobs

> Docs: [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/job/) · [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) · [Indexed Jobs](https://kubernetes.io/docs/tasks/job/indexed-parallel-processing-static/)

## Overview

A Deployment keeps Pods running forever. A Job runs Pods until a set number of them succeed, then stops. A CronJob creates a Job on a schedule. They are the same reconcile loop as every other controller (→ [Architecture](./architecture.md)), except "done" is a reachable state. Use a Job for migrations, batch processing and one-off tasks. Use a CronJob for anything that should happen every night, hour or minute. The interview questions almost always concern failure: retries, overlapping runs and runs that never happened.

## Key concepts

### Job fields

| Field | Default | What it controls |
|---|---|---|
| `completions` | 1 | How many Pods must succeed |
| `parallelism` | 1 | How many Pods run at once |
| `backoffLimit` | 6 | Retries before the Job is marked `Failed`. Delays grow 10s, 20s, 40s… up to 6 min. |
| `activeDeadlineSeconds` | none | Hard wall-clock limit for the whole Job. Beats `backoffLimit`. |
| `ttlSecondsAfterFinished` | none | Delete the Job and its Pods this long after it finishes |
| `completionMode: Indexed` | `NonIndexed` | Each Pod gets `JOB_COMPLETION_INDEX` (0…n-1) to pick its slice of work |
| `template.spec.restartPolicy` | (required) | `OnFailure` or `Never`. `Always` is rejected. |

### restartPolicy inside a Job

| Value | On failure | Result |
|---|---|---|
| `OnFailure` | Container restarts in the same Pod | Fewer Pods, but the failed container's logs are replaced |
| `Never` | A new Pod is created | Failed Pods stay for `kubectl logs`. Use while debugging. |
| `Always` | (rejected by the API) | Validation error |

### CronJob fields

| Field | Default | What it controls |
|---|---|---|
| `schedule` | (required) | Cron syntax: `minute hour day-of-month month day-of-week` |
| `timeZone` | controller's zone, usually UTC | IANA name such as `Asia/Singapore` |
| `concurrencyPolicy` | `Allow` | What happens when the previous run is still going (table below) |
| `startingDeadlineSeconds` | none | If a run is missed by more than this, skip it |
| `successfulJobsHistoryLimit` / `failedJobsHistoryLimit` | 3 / 1 | How many finished Jobs to keep |
| `suspend` | `false` | Pause scheduling without deleting the CronJob |

### concurrencyPolicy

| Value | Previous run still active | Result |
|---|---|---|
| `Allow` | Start another one | Two retraining runs writing the same files. Usually a bug. |
| `Forbid` | Skip this run | Safe for jobs that must not overlap. A slow run means missed runs. |
| `Replace` | Kill the old run, start the new one | Latest data wins. A run that always overruns never finishes. |

## kubectl essentials

Create imperatively:

```bash
kubectl create job hello --image=busybox:1.36 -- sh -c 'echo hello; sleep 5'
kubectl create cronjob report --image=busybox:1.36 --schedule="*/5 * * * *" -- date
kubectl create job report-manual --from=cronjob/report      # run a CronJob now
kubectl create job hello --image=busybox:1.36 --dry-run=client -o yaml -- echo hi > job.yaml
```

Inspect and control:

```bash
kubectl get jobs,cronjobs
kubectl logs job/hello                                      # logs of one of the Job's Pods
kubectl get pods -l job-name=hello                          # every Pod the Job created
kubectl wait --for=condition=complete job/hello --timeout=120s
kubectl patch cronjob report -p '{"spec":{"suspend":true}}'
```

A parallel Job with bounded retries and cleanup:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: process
spec:
  completions: 5
  parallelism: 2
  backoffLimit: 3
  activeDeadlineSeconds: 600
  ttlSecondsAfterFinished: 3600
  completionMode: Indexed
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: worker
        image: busybox:1.36
        command: ["sh", "-c", "echo processing shard $JOB_COMPLETION_INDEX; sleep 5"]
```

A nightly CronJob that must never overlap:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-report
spec:
  schedule: "0 2 * * *"
  timeZone: Asia/Singapore
  concurrencyPolicy: Forbid
  startingDeadlineSeconds: 1800
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 3
  jobTemplate:
    spec:
      backoffLimit: 2
      activeDeadlineSeconds: 7200
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: report
            image: busybox:1.36
            command: ["sh", "-c", "echo building report; sleep 30"]
```

## 🧪 Lab

:::tip Lab 3-1 ★★
See [Standard lab setup](../start-here/local-setup.md#standard-lab-setup).

**Watch `concurrencyPolicy: Forbid` skip a run.**

1. In namespace `lab3`, create a CronJob `slow` that runs every minute, sleeps 90 seconds, and uses `concurrencyPolicy: Forbid`.
2. Watch Jobs for 4 minutes. Explain why there are fewer Jobs than minutes.
3. Trigger a manual run from the CronJob and confirm it runs even while a scheduled one is active.
4. Suspend the CronJob.

**Verify**

```bash
kubectl -n lab3 get cronjob slow -o jsonpath='{.spec.concurrencyPolicy} {.spec.suspend}{"\n"}'   # Forbid true
kubectl -n lab3 get jobs
```

<details>
<summary>Solution</summary>

```bash
kubectl create namespace lab3
kubectl -n lab3 create cronjob slow --image=busybox:1.36 --schedule="* * * * *" \
  --dry-run=client -o yaml -- sleep 90 > slow.yaml
# add under spec:   concurrencyPolicy: Forbid
kubectl -n lab3 apply -f slow.yaml
kubectl -n lab3 get jobs -w
# A 90s run spans two schedule ticks. Forbid skips every tick that finds a run active,
# so you see roughly one Job every 2 minutes.

kubectl -n lab3 create job slow-manual --from=cronjob/slow
# Manual Jobs bypass concurrencyPolicy. That rule is the CronJob controller's, not the Job's.

kubectl -n lab3 patch cronjob slow -p '{"spec":{"suspend":true}}'
kubectl delete namespace lab3
```

</details>
:::

## Gotchas

- **Time zone.** Without `timeZone`, `0 2 * * *` means 02:00 in the controller-manager's zone, usually UTC.
- **Jobs must be idempotent.** The controller can occasionally create two Jobs for one schedule, or none. Design for it.
- **Finished Jobs pile up.** Standalone Jobs stay forever unless you set `ttlSecondsAfterFinished`.
- **`OnFailure` restarts count too.** Container restarts inside a Pod burn `backoffLimit` just like failed Pods. Set `activeDeadlineSeconds` as the real cap.
- **Too many missed runs.** If more than 100 schedules are missed (for example, after a long suspend without `startingDeadlineSeconds`), the CronJob stops scheduling and logs an error.
- **Editing a CronJob doesn't touch running Jobs.** Only the next Job uses the new template.

## Scenario questions

**Q1 ★ A Job has created a string of failed Pods and stopped. What happened and what do you check?**

<details>
<summary>Model answer</summary>

- **Clarify:** did it ever succeed? Is this a new image or new input data?
- **Observe:** `kubectl describe job` shows `BackoffLimitExceeded`. `kubectl logs` on the newest failed Pod shows the error. `restartPolicy: Never` kept each failed Pod, one per attempt.
- **Hypothesise:** the task fails deterministically: a bad argument, a missing Secret, or bad data.
- **Fix:** fix the cause, delete the Job, re-create it. A failed Job does not retry on its own.
- **Prevent:** lower `backoffLimit` for deterministic failures and alert on Job failure. Use `podFailurePolicy` to fail fast on exit codes that retries can't fix.

</details>

**Q2 ★★ The nightly job sometimes runs twice at once and corrupts its output. How do you stop that?**

<details>
<summary>Model answer</summary>

- **Clarify:** how long does a run take compared to the schedule interval? Does it ever run long?
- **Observe:** `kubectl get jobs` shows two active Jobs with overlapping start times. `concurrencyPolicy` is `Allow`, the default.
- **Hypothesise:** a slow night pushed a run past the next schedule, and `Allow` started a second one.
- **Fix:** set `concurrencyPolicy: Forbid` and `activeDeadlineSeconds` so a hung run can't block every later one.
- **Prevent:** make the job idempotent anyway (write to a temp path, then rename), because the controller doesn't strictly guarantee one run per schedule. The trade-off: `Forbid` means a slow run skips the next one, so alert on missed runs.

</details>

**Q3 ★★ The CronJob didn't run last night. Where do you look?**

<details>
<summary>Model answer</summary>

- **Clarify:** didn't run at all, or ran and failed?
- **Observe:** `kubectl get cronjob` for `SUSPEND` and `LAST SCHEDULE`. `kubectl describe cronjob` for events such as missed schedules. `kubectl get jobs` for a failed Job.
- **Hypothesise:** suspended; the previous run still active under `Forbid`; the start was later than `startingDeadlineSeconds` because the control plane was down; or the schedule is in UTC while you expected local time.
- **Fix:** resume it, set `timeZone`, or trigger a catch-up with `kubectl create job --from=cronjob/<name>`.
- **Prevent:** alert when the last successful run is older than the interval, a "dead man's switch".

</details>

**Q4 ★★★ You must process 1,000 files as fast as possible without a message queue. Design it.**

<details>
<summary>Model answer</summary>

- **Clarify:** are files independent? How long does one take? What limits parallelism: cluster capacity or a downstream API?
- **Observe:** independent files and a fixed list make static partitioning possible.
- **Hypothesise:** an Indexed Job with `completions: 100` and `parallelism: 20`. Each Pod reads `JOB_COMPLETION_INDEX` and processes files `index*10` to `index*10+9`.
- **Fix:** set `backoffLimitPerIndex` so one bad shard retries alone and doesn't fail the whole Job. Size `parallelism` to what the downstream can take, not the cluster.
- **Prevent:** trade-off vs a queue: indexed Jobs are simple and need no infrastructure, but work is split up front. If items vary wildly in cost, a work queue balances load better.

</details>

## Summary

- **Jobs run to completion; Deployments run forever.** Pick by whether "done" exists.
- **`backoffLimit` retries, `activeDeadlineSeconds` caps.** Set both.
- **`concurrencyPolicy: Forbid` stops overlapping runs.** The cost is skipped runs when one is slow.
- **Always set `timeZone` and `ttlSecondsAfterFinished`.** UTC surprises and piles of finished Jobs are the two classic messes.
- **Make every Job idempotent.** Retries and the occasional double run are part of the contract.
