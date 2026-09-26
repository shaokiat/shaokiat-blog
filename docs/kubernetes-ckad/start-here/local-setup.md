---
title: "Local Setup: kind & kubectl"
sidebar_label: Local Setup
sidebar_position: 1
---

# Local Setup: kind & kubectl

> Docs: [kind quick start](https://kind.sigs.k8s.io/docs/user/quick-start/) · [Install kubectl](https://kubernetes.io/docs/tasks/tools/) · [Organizing cluster access with kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

Every Lab in this section assumes the setup below. Terms are defined in the [Glossary](./glossary.md).

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

3. **Create a lab namespace and make it the default.** It isolates the lab, cleans up in one command, and saves typing `-n`.

   ```bash
   kubectl create namespace lab1
   kubectl config set-context --current --namespace=lab1
   ```

4. **Generate YAML, then apply it.** Faster and less error-prone than typing manifests by hand.

   ```bash
   kubectl create deployment web --image=nginx:1.27 --dry-run=client -o yaml > web.yaml
   kubectl apply -f web.yaml
   ```

5. **Clean up.** Delete the namespace to reset one lab. Delete the cluster to remove everything, including its context.

   ```bash
   kubectl delete namespace lab1
   kind delete cluster --name ckad
   ```

:::tip
Always check `kubectl config current-context` before destructive commands.
:::

## Context vs Namespace

| | Context | Namespace |
|---|---|---|
| **Lives in** | Your laptop (kubeconfig) | The cluster (etcd) |
| **Holds** | Cluster address, credentials, default namespace | Namespaced objects: Deployments, Pods, Services, ConfigMaps… |
| **Deleting it** | Removes the shortcut only. The cluster is unaffected. | Deletes everything inside it. |

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
