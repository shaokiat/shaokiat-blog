---
title: "Local Setup: kind & kubectl"
sidebar_label: Local Setup
sidebar_position: 2
---

# Local Setup: kind & kubectl

> Docs: [kind quick start](https://kind.sigs.k8s.io/docs/user/quick-start/) · [Install kubectl](https://kubernetes.io/docs/tasks/tools/) · [Organizing cluster access with kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

Every Lab in this section assumes the setup below. Do it once, then read [Command Patterns](./command-patterns.md) for the commands the labs use. Terms are defined in the [Glossary](./glossary.md).

## Standard lab setup

0. **Check the prerequisites.** kind nodes are Docker containers, so Docker must be running.

   ```bash
   docker info > /dev/null && echo docker ok
   kind version
   kubectl version --client
   ```

1. **Create the cluster.** This also creates the context `kind-ckad` and switches to it.

   ```bash
   kind create cluster --name ckad
   ```

2. **Verify you are pointed at it.** A healthy single-node cluster shows one `Ready` node.

   ```bash
   kubectl config current-context        # kind-ckad
   kubectl get nodes
   ```

3. **Give each lab its own namespace.** Every lab names one (`lab0`, `lab5`…). It isolates the lab and cleans up in one command. The Guided tier passes `-n lab<N>` on every command; to save typing, make it the default instead.

   ```bash
   kubectl create namespace lab5
   kubectl config set-context --current --namespace=lab5    # optional: now -n can be dropped
   ```

4. **Clean up.** Delete the namespace to reset one lab. Delete the cluster to remove everything, including its context.

   ```bash
   kubectl delete namespace lab5
   kubectl config set-context --current --namespace=default # if you changed it in step 3
   kind delete cluster --name ckad
   ```

:::tip
Always check `kubectl config current-context` before destructive commands.
:::

## Lab tiers

Every Lab is written once and read at three levels. Pick one per lab; drop a level when a lab feels easy.

| Tier | What you use | Use it when |
|---|---|---|
| 🔴 **Challenge** | Only **Goal** and **Verify** | You could do this in the exam. Time yourself. |
| 🟡 **Hints** | Goal, Verify, and the collapsed **🟡 Hints**: which command family or `-h` to look at, never the full command | You know the concept but not the commands yet |
| 🟢 **Guided** | The collapsed **🟢 Guided** block: numbered steps, each one sentence saying what it does, its command, and the output to expect | First contact with a topic |

The Guided commands come from [Command Patterns](./command-patterns.md). Once you can predict each one before reading it, move up a tier.

## Context vs Namespace

| | Context | Namespace |
|---|---|---|
| **Lives in** | Your laptop (kubeconfig) | The cluster (etcd) |
| **Holds** | Cluster address, credentials, default namespace | Namespaced objects: Deployments, Pods, Services, ConfigMaps… |
| **Deleting it** | Removes the shortcut only. The cluster is unaffected. | Deletes everything inside it. |

### What a namespace isolates

| Isolated | Not isolated |
|---|---|
| Resource names: two `web` Deployments can coexist in different namespaces | Network traffic: open across namespaces by default |
| RBAC: Role and RoleBinding | Nodes and the kernel |
| ResourceQuota and LimitRange | Cluster-scoped resources |
| References: Pods can only use ConfigMaps, Secrets, ServiceAccounts and PVCs from their own namespace | Cluster admins |
| NetworkPolicy scope | |
| Lifecycle: deleting the namespace deletes everything in it | |

A namespace is a boundary for names, access and quotas, not a security wall. Combine it with RBAC, NetworkPolicy, quotas and Pod Security admission. → See [Multi-Tenant Platform](../scenarios/multi-tenant-platform.md).

Which namespace a command uses: → [Command Patterns](./command-patterns.md#which-namespace-does-my-command-use). DNS across namespaces: → [DNS names](../reference/services-and-ingress.md#dns-names).

## Who manages what

| Tool | Scope |
|---|---|
| kind / minikube / gcloud / eksctl / Terraform | Create and delete clusters |
| kubectl | Objects inside a cluster |

`kubectl config delete-cluster` only edits kubeconfig. The cluster keeps running. Recover a lost kind context with `kind export kubeconfig --name ckad`.

## kubeconfig in 5 lines

1. A plain YAML data file, not a script like `.bashrc`. Nothing in it runs.
2. It lists `clusters`, `users` and `contexts` (a cluster + user + default namespace), plus `current-context`.
3. Lookup order: the `--kubeconfig` flag → the `KUBECONFIG` env var → `~/.kube/config`.
4. It is written by kind, minikube and `gcloud`, by `kubectl config` subcommands, or by hand.
5. It holds credentials. `chmod 600 ~/.kube/config` and never commit it.

Shell setup for zsh (for bash, swap `zsh` for `bash` and use `complete -o default -F __start_kubectl k`):

```zsh
# ~/.zshrc
source <(kubectl completion zsh)
alias k=kubectl
compdef _kubectl k
```

Completion covers subcommands, resource types and live object names: `k get po<Tab>`, `k logs <Tab>`.
