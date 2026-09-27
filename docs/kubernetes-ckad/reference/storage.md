---
title: Storage
sidebar_label: Storage
sidebar_position: 12
---

# Storage

:::info[📘 Know]
Be able to explain it and pass its lab once. Phase 5 of the [Learning Path](../start-here/learning-path.md).
:::

> Docs: [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/) · [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) · [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/) · [Ephemeral volumes](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes/)

## Overview

A container's filesystem dies with the container. A volume gives a Pod storage with a longer life. Ephemeral volumes (`emptyDir`, `configMap`, `secret`) live exactly as long as the Pod. Persistent volumes outlive it: a Pod references a **PersistentVolumeClaim** (a request: "10Gi, read-write, fast"), and a **StorageClass** provisions a matching **PersistentVolume** (the actual disk). The split lets developers ask for storage without knowing which cloud disk backs it. Most storage questions come down to three things: who can mount it (access mode), what happens to it on delete (reclaim policy), and why a claim is stuck `Pending`.

## Key concepts

### Volume types by lifetime

| Volume | Lives as long as | Use when |
|---|---|---|
| Container filesystem | The container. Lost on every restart. | Never for data you need |
| `emptyDir` | The Pod. Survives container restarts. | Scratch space, sharing files between containers, caches |
| `emptyDir` with `medium: Memory` | The Pod, in RAM (counts toward memory limit) | Fast scratch for small data |
| `configMap` / `secret` / `projected` | The Pod, content synced from the object | Config files (→ [Config & Secrets](./config-and-secrets.md)) |
| `hostPath` | The node | Node agents only. Pinned to one node and a security risk. |
| `persistentVolumeClaim` | The PVC, independent of any Pod | Databases, model artifacts, anything that must survive rescheduling |

### PV, PVC and StorageClass

| Object | Scope | Written by | Role |
|---|---|---|---|
| **StorageClass** | Cluster | Admin | Provisioner, parameters, reclaim policy, binding mode |
| **PersistentVolumeClaim** | Namespace | Developer | Request: size, access mode, class |
| **PersistentVolume** | Cluster | Provisioner (dynamic) or admin (static) | The real disk. Binds 1:1 to a claim. |

`volumeBindingMode: WaitForFirstConsumer` delays provisioning until a Pod uses the claim, so the disk is created in the Pod's zone. The PVC shows `Pending` until then. That is normal.

### Access modes

| Mode | Short | Meaning | Typical backing |
|---|---|---|---|
| `ReadWriteOnce` | RWO | Read-write by Pods on **one node** | Cloud block disks |
| `ReadOnlyMany` | ROX | Read-only by many nodes | Pre-populated disks |
| `ReadWriteMany` | RWX | Read-write by many nodes | NFS, Filestore, EFS, CephFS |
| `ReadWriteOncePod` | RWOP | Read-write by **one Pod** in the cluster | CSI block disks |

RWO is per node, not per Pod. Two Pods on the same node can both mount an RWO volume.

### Reclaim policy

| Policy | When the PVC is deleted | Use when |
|---|---|---|
| `Delete` (default for dynamic) | The PV and the cloud disk are deleted | Disposable or reproducible data |
| `Retain` | The PV stays `Released` with data intact. An admin must clean up. | Anything you cannot recreate |

### Stateful workloads

| Setup | Result |
|---|---|
| Deployment, 3 replicas, one RWO PVC | Replicas on other nodes stick in `ContainerCreating` with a Multi-Attach error |
| Deployment, 1 replica, RWO PVC, `RollingUpdate` | Rollouts can hang: the new Pod waits for the old one to release the disk. Use `strategy: Recreate`. |
| StatefulSet with `volumeClaimTemplates` | Each replica gets its own PVC (`data-db-0`, `data-db-1`) that follows it across restarts |

## kubectl essentials

```bash
kubectl get storageclass                          # (default) marks the default class
kubectl get pv,pvc
kubectl describe pvc data                         # Events explain a Pending claim
kubectl get pvc data -o jsonpath='{.spec.volumeName}'
kubectl explain pvc.spec
kubectl explain pod.spec.volumes.emptyDir
```

There is no imperative `create pvc`. Keep this skeleton ready:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data
spec:
  accessModes: ["ReadWriteOnce"]
  storageClassName: standard          # omit to use the default class
  resources:
    requests:
      storage: 1Gi
```

A Pod mounting the claim plus a size-capped scratch volume:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: writer
spec:
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: data
  - name: scratch
    emptyDir:
      sizeLimit: 500Mi
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "date >> /data/log.txt; sleep 3600"]
    volumeMounts:
    - {name: data, mountPath: /data}
    - {name: scratch, mountPath: /tmp}
```

## 🧪 Lab

:::tip Lab 4-1 ★★
**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Prove that data outlives the Pod.**

**Goal**

1. In namespace `lab4`, create the PVC `data` (1Gi, RWO). Check its status before any Pod uses it.
2. Create the Pod `writer` above. Check the PVC again and find the PV it bound to.
3. Delete `writer`, create a Pod `reader` that mounts the same claim, and print `/data/log.txt`.
4. Find the PV's reclaim policy and predict what deleting the PVC will do.

**Verify**

```bash
kubectl -n lab4 get pvc data                                  # Bound
kubectl -n lab4 logs reader                                   # the timestamp written by writer
kubectl get pv "$(kubectl -n lab4 get pvc data -o jsonpath='{.spec.volumeName}')" \
  -o jsonpath='{.spec.persistentVolumeReclaimPolicy}{"\n"}'
```

<details>
<summary>🟡 Hints</summary>

1. There's no PVC generator. Copy the skeleton above into `pvc.yaml`. `kubectl get storageclass` shows why it stays `Pending`.
2. Save the `writer` Pod above as `writer.yaml`. The PVC's `VOLUME` column names the PV.
3. Write a `reader` Pod that mounts claim `data` and runs `cat /data/log.txt`. `kubectl run --overrides` or a copy of `writer.yaml` both work.
4. The PV is cluster-scoped, so no `-n`. The field is `spec.persistentVolumeReclaimPolicy`.

</details>

<details>
<summary>🟢 Guided</summary>

1. Create the lab namespace.

   ```bash
   kubectl create namespace lab4
   ```

2. Create the claim from the PVC skeleton above, saved as `pvc.yaml`.

   ```bash
   kubectl -n lab4 apply -f pvc.yaml
   ```

3. Check it: Pending, because kind's "standard" class is WaitForFirstConsumer.

   ```bash
   kubectl -n lab4 get pvc data
   ```

4. Create the writer Pod from the manifest above, saved as `writer.yaml`.

   ```bash
   kubectl -n lab4 apply -f writer.yaml
   ```

5. Wait until the writer is running (this is what triggers provisioning).

   ```bash
   kubectl -n lab4 wait --for=condition=Ready pod/writer --timeout=90s
   ```

6. Check again: Bound, and VOLUME shows the PV name.

   ```bash
   kubectl -n lab4 get pvc data
   ```

7. Delete the writer; the claim and its data stay.

   ```bash
   kubectl -n lab4 delete pod writer
   ```

8. Start a reader Pod that mounts the same claim and prints the file.

   ```bash
   kubectl -n lab4 run reader --image=busybox:1.36 --restart=Never \
     --overrides='{"spec":{"volumes":[{"name":"data","persistentVolumeClaim":{"claimName":"data"}}],
     "containers":[{"name":"reader","image":"busybox:1.36","command":["cat","/data/log.txt"],
     "volumeMounts":[{"name":"data","mountPath":"/data"}]}]}}'
   ```

9. Wait for the reader to finish, then read what it printed: the line the writer appended.

   ```bash
   kubectl -n lab4 wait --for=jsonpath='{.status.phase}'=Succeeded pod/reader --timeout=60s
   kubectl -n lab4 logs reader
   ```

10. Read the PV's reclaim policy: Delete, so deleting the PVC deletes the PV and its data.

    ```bash
    kubectl get pv "$(kubectl -n lab4 get pvc data -o jsonpath='{.spec.volumeName}')" \
      -o jsonpath='{.spec.persistentVolumeReclaimPolicy}{"\n"}'
    ```

11. Run the ✅ Check below, then delete everything the lab created.

    ```bash
    kubectl delete namespace lab4
    ```

</details>

**✅ Check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
t "PVC Bound"               "$(kubectl -n lab4 get pvc data -o jsonpath='{.status.phase}')" "Bound"
t "reader saw writer's line" "$(kubectl -n lab4 logs reader | grep -c UTC)" "1"
t "reclaim policy Delete"   "$(kubectl get pv "$(kubectl -n lab4 get pvc data -o jsonpath='{.spec.volumeName}')" -o jsonpath='{.spec.persistentVolumeReclaimPolicy}')" "Delete"
```
:::

## Gotchas

- **`Pending` PVC with WaitForFirstConsumer is normal.** It binds when a Pod is scheduled. Only worry if a Pod using it is also stuck.
- **No default StorageClass.** A PVC without `storageClassName` then stays `Pending` forever. `kubectl get sc` shows which one is `(default)`.
- **`storageClassName: ""` is not "default".** An empty string means "static PV only, no provisioning".
- **RWO + multiple nodes.** A second Pod on another node fails with `Multi-Attach error`. Use a StatefulSet, RWX storage, or `strategy: Recreate`.
- **Deleting a PVC deletes the data** under the `Delete` policy. Use `Retain` for anything irreplaceable.
- **Expansion.** You can only grow a PVC, and only if the class has `allowVolumeExpansion: true`.
- **`subPath` mounts of ConfigMaps never update.** → See [Config & Secrets](./config-and-secrets.md).

## Scenario questions

**Q1 ★ A PVC has been `Pending` for 10 minutes. Walk me through it.**

<details>
<summary>Model answer</summary>

- **Clarify:** is a Pod using it yet? Dynamic or static provisioning?
- **Observe:** `kubectl describe pvc` events. `waiting for first consumer` means no Pod yet. `no persistent volumes available` means static binding with no match. Provisioner errors mean quota or permissions on the cloud side.
- **Hypothesise:** no Pod scheduled; no default StorageClass; a class name typo; an access mode the provisioner can't provide (RWX on a block-only class); or a cloud disk quota.
- **Fix:** match the claim to what the class offers, set the class name, or raise the quota.
- **Prevent:** a default StorageClass in every cluster, and an allowed-classes list in the platform docs.

</details>

**Q2 ★★ A single-replica Deployment with a PVC hangs on every rollout. Why?**

<details>
<summary>Model answer</summary>

- **Clarify:** RWO volume? Rolling update strategy?
- **Observe:** new Pod in `ContainerCreating` with `Multi-Attach error for volume`. The old Pod is still running on another node.
- **Hypothesise:** `RollingUpdate` starts the new Pod before stopping the old one. The RWO disk can't attach to two nodes.
- **Fix:** `strategy: Recreate`, accepting a short outage, or make it a StatefulSet.
- **Prevent:** the trade-off to state: Recreate means downtime on each deploy. If you can't afford that, the app needs shared (RWX) storage or must be made stateless.

</details>

**Q3 ★★ A developer says their data "disappears on restart". What do you ask?**

<details>
<summary>Model answer</summary>

- **Clarify:** what restarted: the container or the Pod? Where does the app write?
- **Observe:** `kubectl get pod -o yaml` shows the volume mounts. `RESTARTS` vs Pod age tells container restart from Pod replacement.
- **Hypothesise:** writing to the container filesystem (lost on container restart), or to an `emptyDir` (lost when the Pod is replaced).
- **Fix:** mount a PVC at the path the app writes to.
- **Prevent:** run containers with `readOnlyRootFilesystem: true` so writes to unplanned paths fail loudly in testing (→ [Security](./security.md)).

</details>

**Q4 ★★★ Ten model-serving replicas across nodes need the same 20 GB model. Options?**

<details>
<summary>Model answer</summary>

- **Clarify:** how often does the model change? How fast must a new replica start?
- **Observe:** RWO can't be shared across nodes. Image layers and downloads are cached per node.
- **Hypothesise:** three options. (1) Bake the model into the image: simple and versioned together, but huge images and slow pulls. (2) An init container downloads it into an `emptyDir`: small image, but every Pod start pays the download. (3) An RWX volume (NFS/Filestore) or a ROX pre-populated disk: one copy, fast start, but a shared dependency and slower reads.
- **Fix:** for frequently updated models, option 2 with a node-local cache. For rarely changing ones, option 3 with ROX.
- **Prevent:** version the model path so a rollout switches models atomically. → See [ML Model Serving](../scenarios/ml-model-serving.md).

</details>

## Summary

- **Pick volumes by lifetime.** Container, Pod (`emptyDir`) or independent (PVC).
- **PVC asks, StorageClass provisions, PV is the disk.** Developers only write the claim.
- **RWO means one node.** Multiple replicas need a StatefulSet or RWX storage.
- **WaitForFirstConsumer makes `Pending` normal.** Look at the Pod before blaming the claim.
- **Reclaim policy decides whether data survives the PVC.** `Retain` for anything you can't rebuild.

---

**Next in path →** [Multi-container patterns](./pods-and-multi-container.md#multi-container-patterns) · [Network Policy](./network-policy.md) (Phase 6)
