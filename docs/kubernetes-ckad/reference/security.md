---
title: Security
sidebar_label: Security
sidebar_position: 14
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Security

:::info[📘 Know]
Be able to explain it and pass its lab once. Phase 6 of the [Learning Path](../start-here/learning-path.md).
:::

> Docs: [Controlling access to the API](https://kubernetes.io/docs/concepts/security/controlling-access/) · [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) · [Service accounts](https://kubernetes.io/docs/concepts/security/service-accounts/) · [Security context](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) · [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) · [Custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)

## Overview

Every request to the API server passes three gates in order. **Authentication** decides who you are (certificate, OIDC token, ServiceAccount token). **Authorization** decides whether that identity may do this verb on this resource, almost always through RBAC. **Admission control** can then change or reject the object itself: inject defaults, enforce quotas, block privileged Pods. Inside the Pod, a **SecurityContext** limits what the container process may do on the node. The same API machinery is also how Kubernetes is extended: a **CustomResourceDefinition** adds a new kind, and an **Operator** is a controller that reconciles it (→ [Architecture](./architecture.md)).

<ThemedImage
  alt="RBAC: a RoleBinding in namespace team-a connects subjects (User jane, ServiceAccount ci-bot) to Role deployer, which grants get, list, create and update on deployments and pods in team-a; a RoleBinding can also reference ClusterRole view, still scoped to team-a"
  sources={{
    light: useBaseUrl('/img/kubernetes-ckad/fig-security-1-light.svg'),
    dark: useBaseUrl('/img/kubernetes-ckad/fig-security-1-dark.svg'),
  }}
/>

*Figure 9-1: RBAC. Amber marks the binding, the only object that connects an identity to permissions. Green is what those permissions reach: verbs on resources, inside one namespace.*

## Key concepts

### The request pipeline

| Stage | Question | Mechanisms | Failure you'll see |
|---|---|---|---|
| **Authentication** | Who are you? | Client certs, OIDC tokens, ServiceAccount tokens | `401 Unauthorized` |
| **Authorization** | May you do this? | RBAC (also Node, Webhook) | `403 Forbidden: ... cannot create resource "deployments"` |
| **Mutating admission** | Should the object change? | LimitRanger defaults, ServiceAccount injection, webhooks | Object differs from what you applied |
| **Validating admission** | Is the object allowed? | ResourceQuota, Pod Security Admission, ValidatingAdmissionPolicy, webhooks | `forbidden: exceeded quota`, `violates PodSecurity "restricted"` |

### RBAC objects

| Object | Scope | Contains |
|---|---|---|
| **Role** | Namespace | Rules: `apiGroups` + `resources` + `verbs` |
| **ClusterRole** | Cluster | Same rules, plus cluster-scoped resources (nodes, PVs) |
| **RoleBinding** | Namespace | `subjects` → one `roleRef` |
| **ClusterRoleBinding** | Cluster | `subjects` → one ClusterRole, in every namespace |

| Role | Bound with | Result |
|---|---|---|
| Role | RoleBinding | Permissions in that namespace. The normal case. |
| ClusterRole | RoleBinding | Permissions in the binding's namespace only. Reuse one definition across namespaces. |
| ClusterRole | ClusterRoleBinding | Permissions in every namespace and on cluster-scoped resources |
| Role | ClusterRoleBinding | Invalid. A ClusterRoleBinding can only reference a ClusterRole. |

RBAC is additive. There are no deny rules; access is denied unless some binding allows it.

### ServiceAccounts

| Fact | Consequence |
|---|---|
| Every namespace has a `default` ServiceAccount | Pods without `serviceAccountName` use it. Give workloads their own. |
| Tokens are short-lived and projected into the Pod | Mounted at `/var/run/secrets/kubernetes.io/serviceaccount/` |
| `automountServiceAccountToken: false` | No token in the Pod. Set it for apps that never call the API. |
| Subject name format | `system:serviceaccount:<namespace>:<name>` in `kubectl auth can-i --as` |

### SecurityContext

| Field | Level | Effect |
|---|---|---|
| `runAsNonRoot: true` | Pod or container | Kubelet refuses to start a container that would run as UID 0 |
| `runAsUser` / `runAsGroup` | Pod or container | UID / GID of the process |
| `fsGroup` | Pod | Group ownership of mounted volumes, so a non-root user can write |
| `allowPrivilegeEscalation: false` | Container | Blocks setuid binaries gaining privileges |
| `readOnlyRootFilesystem: true` | Container | Writes only to mounted volumes |
| `capabilities.drop: ["ALL"]` | Container | Removes Linux capabilities such as binding ports below 1024 |
| `privileged: true` | Container | Full host access. Almost never. |
| `seccompProfile.type: RuntimeDefault` | Pod or container | Filters dangerous syscalls |

Container-level settings override Pod-level ones.

### Pod Security Admission

Label a namespace to enforce one of three [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/):

| Level | Blocks | Use for |
|---|---|---|
| `privileged` | Nothing | System namespaces (CNI, storage drivers) |
| `baseline` | Host namespaces, privileged containers, hostPath | Default for most namespaces |
| `restricted` | Also root users, privilege escalation, capabilities beyond `NET_BIND_SERVICE` | Application namespaces |

One label turns it on: `kubectl label namespace team-a pod-security.kubernetes.io/enforce=restricted`.

<details>
<summary>Deeper dive</summary>

Each level can be applied in three modes, one label per mode: `enforce` rejects the Pod, `warn` returns a warning to the client, `audit` records it in the audit log. Roll out with `warn` and `audit` first to find violations, then switch to `enforce`. Pin the standard's version with `pod-security.kubernetes.io/enforce-version`, or `latest` moves with each upgrade.

</details>

### CRDs and Operators

| Piece | What it is | Example |
|---|---|---|
| **CustomResourceDefinition** | Adds a new kind to the API, with a schema | `kind: Backup` in group `ops.example.com` |
| **Custom resource** | An instance of that kind | `Backup nightly-db` |
| **Operator** | A controller that watches the kind and reconciles it | Creates CronJobs and PVCs for each Backup |

A CRD without a controller only stores data. The Operator is what makes it do something. The minimal CRD in [kubectl essentials](#kubectl-essentials) adds `kind: Backup`; a custom resource is then ordinary YAML:

```yaml
# fragment: needs the Backup CRD installed
apiVersion: ops.example.com/v1
kind: Backup
metadata:
  name: nightly-db
spec:
  schedule: "0 2 * * *"
  retainDays: 7
```

## kubectl essentials

RBAC, imperatively:

```bash
kubectl create serviceaccount ci-bot
kubectl create role deployer --verb=get,list,watch,create,update,patch --resource=deployments,pods
kubectl create rolebinding ci-bot-deployer --role=deployer --serviceaccount=team-a:ci-bot -n team-a
kubectl create rolebinding jane-view --clusterrole=view --user=jane -n team-a
kubectl create clusterrole node-reader --verb=get,list --resource=nodes
```

Check what an identity can do:

```bash
kubectl auth can-i create deployments -n team-a --as=system:serviceaccount:team-a:ci-bot
kubectl auth can-i --list -n team-a --as=jane
kubectl auth whoami
kubectl create token ci-bot -n team-a --duration=10m     # short-lived token for testing
```

Security context and admission:

```bash
kubectl explain pod.spec.securityContext
kubectl explain pod.spec.containers.securityContext
kubectl label namespace team-a pod-security.kubernetes.io/enforce=restricted
kubectl exec <pod> -- id                                  # which UID/GID the process has
```

<details>
<summary>Deeper dive</summary>

Inspect extensions:

```bash
kubectl get crd
kubectl api-resources --api-group=ops.example.com
kubectl explain backup.spec                               # works for CRDs with a schema
```

</details>

A Role and its binding:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployer
rules:
- apiGroups: ["apps"]                  # "" is the core group (pods, services, secrets)
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch"]
- apiGroups: [""]
  resources: ["pods", "pods/log"]      # subresources are listed separately
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: ci-bot-deployer
subjects:
- kind: ServiceAccount
  name: ci-bot
  namespace: team-a                    # required for ServiceAccount subjects
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: deployer
```

A Pod that passes the `restricted` standard:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hardened
spec:
  automountServiceAccountToken: false
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    seccompProfile: {type: RuntimeDefault}
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "id; touch /data/ok && echo wrote; sleep 3600"]
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities: {drop: ["ALL"]}
    volumeMounts: [{name: data, mountPath: /data}]
  volumes:
  - name: data
    emptyDir: {}
```

A minimal CRD:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: backups.ops.example.com        # <plural>.<group>
spec:
  group: ops.example.com
  scope: Namespaced
  names: {plural: backups, singular: backup, kind: Backup, shortNames: [bk]}
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            required: [schedule]
            properties:
              schedule: {type: string}
              retainDays: {type: integer, minimum: 1}
```

## 🧪 Lab

:::tip Lab 6-2 ★★
**Requires:** [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Least privilege, then a hardened Pod.**

**Goal**

1. In namespace `lab6-2`, create ServiceAccount `ci-bot` and a Role that allows managing Deployments and reading Pods and their logs. Bind it.
2. Prove `ci-bot` can create Deployments but can't delete them, and can't read Secrets.
3. Label `lab6-2` to enforce `restricted`. Try `kubectl run bad --image=nginx:1.27` and read the error.
4. Run the `hardened` Pod above and confirm its UID and that the root filesystem is read-only.
5. Install the `Backup` CRD, create a `Backup` object, and list it with its short name.

**Verify**

```bash
kubectl -n lab6-2 auth can-i create deployments --as=system:serviceaccount:lab6-2:ci-bot   # yes
kubectl -n lab6-2 auth can-i delete deployments --as=system:serviceaccount:lab6-2:ci-bot   # no
kubectl -n lab6-2 auth can-i get secrets --as=system:serviceaccount:lab6-2:ci-bot          # no
kubectl -n lab6-2 logs hardened                        # uid=1000 gid=3000 groups=2000,3000, then: wrote
kubectl -n lab6-2 get bk
```

<details>
<summary>🟡 Hints</summary>

1. `kubectl create serviceaccount`, `kubectl create role -h` (look at `--verb` and `--resource`), `kubectl create rolebinding -h` (look at `--serviceaccount=<ns>:<name>`). Logs are the `pods/log` subresource.
2. "Check a permission" in [Command Patterns](../start-here/command-patterns.md#check-it). A ServiceAccount's user name is `system:serviceaccount:<ns>:<name>`.
3. `kubectl label namespace` with `pod-security.kubernetes.io/enforce=restricted`.
4. Save the Pod above as `hardened.yaml`. Its logs print `id`. Try writing outside `/data` with `kubectl exec`.
5. Save the CRD above as `backup-crd.yaml`. The object's `apiVersion` is `<group>/<version>` from the CRD.

</details>

<details>
<summary>🟢 Guided</summary>

1. Create the lab namespace.

   ```bash
   kubectl create namespace lab6-2
   ```

2. Create the identity the CI system will use.

   ```bash
   kubectl -n lab6-2 create serviceaccount ci-bot
   ```

3. A Role that manages Deployments, but has no delete verb.

   ```bash
   kubectl -n lab6-2 create role deployer --verb=get,list,watch,create,update,patch --resource=deployments
   ```

4. A Role that reads Pods and their logs.

   ```bash
   kubectl -n lab6-2 create role pod-reader --verb=get,list --resource=pods,pods/log
   ```

5. Bind the first Role to the ServiceAccount.

   ```bash
   kubectl -n lab6-2 create rolebinding ci-bot-deployer --role=deployer --serviceaccount=lab6-2:ci-bot
   ```

6. Bind the second Role to the ServiceAccount.

   ```bash
   kubectl -n lab6-2 create rolebinding ci-bot-pod-reader --role=pod-reader --serviceaccount=lab6-2:ci-bot
   ```

7. Ask the API server as ci-bot: yes.

   ```bash
   kubectl -n lab6-2 auth can-i create deployments --as=system:serviceaccount:lab6-2:ci-bot
   ```

8. No: delete isn't in the Role.

   ```bash
   kubectl -n lab6-2 auth can-i delete deployments --as=system:serviceaccount:lab6-2:ci-bot
   ```

9. No: nothing grants Secrets.

   ```bash
   kubectl -n lab6-2 auth can-i get secrets --as=system:serviceaccount:lab6-2:ci-bot
   ```

10. Enforce the restricted Pod Security Standard on the namespace.

    ```bash
    kubectl label namespace lab6-2 pod-security.kubernetes.io/enforce=restricted
    ```

11. Try a default nginx Pod: rejected.

    ```bash
    kubectl -n lab6-2 run bad --image=nginx:1.27
    ```

    ```text
    Error: violates PodSecurity "restricted:latest": allowPrivilegeEscalation != false,
    unrestricted capabilities, runAsNonRoot != true, seccompProfile ...
    ```

12. Create the hardened Pod above, saved as `hardened.yaml`.

    ```bash
    kubectl -n lab6-2 apply -f hardened.yaml
    ```

13. Read its output: `uid=1000` `gid=3000` `groups=2000`,3000, then "wrote".

    ```bash
    kubectl -n lab6-2 logs hardened
    ```

14. Try to write to the root filesystem: Read-only file system.

    ```bash
    kubectl -n lab6-2 exec hardened -- touch /etc/x
    ```

15. Install the CRD above, saved as `backup-crd.yaml`.

    ```bash
    kubectl apply -f backup-crd.yaml
    ```

16. Create one Backup object from inline YAML.

    ```bash
    kubectl -n lab6-2 apply -f - <<'EOF'
    apiVersion: ops.example.com/v1
    kind: Backup
    metadata:
      name: nightly-db
    spec:
      schedule: "0 2 * * *"
      retainDays: 7
    EOF
    ```

17. List it by short name: stored, but nothing happens, because no Operator watches it.

    ```bash
    kubectl -n lab6-2 get bk
    ```

18. Run the ✅ Check below, then delete everything the lab created.

    ```bash
    kubectl delete namespace lab6-2
    ```

19. The CRD is cluster-scoped, so delete it separately.

    ```bash
    kubectl delete crd backups.ops.example.com
    ```

</details>

**✅ Check**

```bash
t() { [ "$2" = "$3" ] && echo "PASS $1" || echo "FAIL $1: got '$2', want '$3'"; }
sa=system:serviceaccount:lab6-2:ci-bot
t "ci-bot can create deployments" "$(kubectl -n lab6-2 auth can-i create deployments --as=$sa)" "yes"
t "ci-bot cannot delete them"     "$(kubectl -n lab6-2 auth can-i delete deployments --as=$sa)" "no"
t "ci-bot can read Pod logs"      "$(kubectl -n lab6-2 auth can-i get pods/log --as=$sa)" "yes"
t "ci-bot cannot read Secrets"    "$(kubectl -n lab6-2 auth can-i get secrets --as=$sa)" "no"
t "restricted is enforced"        "$(kubectl get ns lab6-2 -o jsonpath='{.metadata.labels.pod-security\.kubernetes\.io/enforce}')" "restricted"
t "hardened runs as 1000"         "$(kubectl -n lab6-2 exec hardened -- id -u)" "1000"
t "root filesystem read-only"     "$(kubectl -n lab6-2 exec hardened -- touch /etc/x 2>&1 | grep -c 'Read-only')" "1"
t "Backup stored"                 "$(kubectl -n lab6-2 get bk nightly-db -o jsonpath='{.spec.retainDays}')" "7"
```
:::

## Gotchas

- **`apiGroups` must match.** Deployments are in `apps`, Pods in `""`, Ingress in `networking.k8s.io`. `kubectl api-resources` shows the group.
- **Subresources are separate.** `pods` doesn't grant `pods/log` or `pods/exec`.
- **ServiceAccount subjects need a namespace.** Omitting it in YAML binds nothing useful.
- **`roleRef` is immutable.** To point a binding at another role, delete and recreate it.
- **`runAsNonRoot` + a root image.** Kubelet refuses to start it: `CreateContainerConfigError: container has runAsNonRoot and image will run as root`. Set `runAsUser` or use a non-root image.
- **`readOnlyRootFilesystem` breaks apps writing to `/tmp`.** Mount an `emptyDir` there.
- **Non-root can't bind port 80.** Listen on 8080 and map it in the Service.
- **`kubectl auth can-i` as yourself proves nothing.** Always test with `--as`.

## Scenario questions

**Q1 ★ A Pod's app logs `403 Forbidden` when it lists Pods through the API. How do you fix it?**

<details>
<summary>Model answer</summary>

- **Clarify:** what does the app need to do, exactly? Which namespace?
- **Observe:** the error names the identity: `system:serviceaccount:app:default cannot list resource "pods"`. `kubectl get pod -o jsonpath='{.spec.serviceAccountName}'` confirms it.
- **Hypothesise:** the Pod runs as the `default` ServiceAccount, which has no permissions.
- **Fix:** create a dedicated ServiceAccount, a Role with only `get, list, watch` on `pods`, and a RoleBinding. Set `serviceAccountName`. Verify with `kubectl auth can-i --as`.
- **Prevent:** never grant permissions to `default`. Set `automountServiceAccountToken: false` on apps that don't call the API.

</details>

**Q2 ★★ Give developers read-only access to every namespace, except Secrets.**

<details>
<summary>Model answer</summary>

- **Clarify:** all namespaces, including system ones? Is membership managed by an identity-provider group?
- **Observe:** the built-in `view` ClusterRole already excludes Secrets.
- **Hypothesise:** a ClusterRoleBinding from the developer group to `view`.
- **Fix:** `kubectl create clusterrolebinding devs-view --clusterrole=view --group=developers`. If some namespaces are off-limits, use RoleBindings per namespace to the same ClusterRole instead.
- **Prevent:** bind to groups, never to individual users, so joiners and leavers are handled in the identity provider.

</details>

**Q3 ★★ After enabling `restricted` Pod Security on a namespace, a Deployment has 0 Pods. Why is nothing visible?**

<details>
<summary>Model answer</summary>

- **Clarify:** did the Deployment exist before the label, or was it applied after?
- **Observe:** `kubectl get pods` is empty. `kubectl describe rs` shows `FailedCreate ... violates PodSecurity "restricted:latest"`.
- **Hypothesise:** admission rejects the Pods, not the Deployment, so the error appears on the ReplicaSet, one level down.
- **Fix:** add the missing securityContext fields (non-root, drop ALL, no privilege escalation, RuntimeDefault seccomp).
- **Prevent:** roll out `warn` and `audit` modes first to find violations, then switch to `enforce`.

</details>

**Q4 ★★★ What's an Operator, and when would you write one instead of a Helm chart?**

<details>
<summary>Model answer</summary>

- **Clarify:** what does the software need after install: backups, failover, version upgrades, resharding?
- **Observe:** Helm renders YAML once per install or upgrade. Nothing runs afterwards.
- **Hypothesise:** an Operator is a CRD plus a controller running the reconcile loop, encoding what a human operator would do. It keeps acting after installation.
- **Fix:** use Helm when installation is the hard part. Use (or write) an Operator when day-2 operations are the hard part, such as a database that must promote a replica on failure.
- **Prevent:** the cost: an Operator is software you maintain, with its own bugs and RBAC. Prefer a mature existing Operator to writing one.

</details>

## Summary

- **Authenticate, authorize, admit.** 401, 403 and admission errors each point at a different stage.
- **RBAC is Role + Binding, additive only.** A RoleBinding scopes even a ClusterRole to one namespace.
- **Give each workload its own ServiceAccount.** Test with `kubectl auth can-i --as`.
- **SecurityContext hardens the process.** Non-root, no escalation, drop ALL, read-only root.
- **CRDs add kinds; Operators make them act.** Same reconcile loop as the built-in controllers.

---

**Next in path →** [Multi-Tenant Platform](../scenarios/multi-tenant-platform.md)
