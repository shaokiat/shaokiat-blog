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

1. **Create the cluster.** This also creates the context `kind-ckad` and switches to it. To run every lab, including Ingress and HPA, create it from `kind.yaml` instead and install the [add-ons](#cluster-add-ons).

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

## Cluster add-ons

Most labs run on the plain cluster above. Labs that need more say so in their **Requires:** line. Install everything once and every lab works.

| Add-on | Needed by | Without it |
|---|---|---|
| Port mappings + `ingress-ready` label | Any Ingress curl from your laptop | Recreate the cluster: kind can't add port mappings later |
| metrics-server | `kubectl top`, every HPA | `error: Metrics API not available`, HPA `TARGETS` stays `<unknown>` |
| ingress-nginx | Ingress labs, the Capstone | Ingress objects are accepted, `ADDRESS` stays empty, nothing routes |

Verified on 2026-09-27 with kind v0.33.0, Kubernetes v1.37.0, metrics-server v0.9.0 and ingress-nginx controller-v1.15.1.

1. **Recreate the cluster with port mappings.** Save this as `kind.yaml`. It maps `localhost:80` and `:443` on your laptop to the node, and labels the node so the ingress controller lands on it.

   ```yaml
   # fragment: kind config, not a Kubernetes object
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
   - role: control-plane
     labels:
       ingress-ready: "true"          # the ingress-nginx kind manifest schedules only here
     extraPortMappings:               # localhost:80/443 on your laptop → the node
     - {containerPort: 80, hostPort: 80, protocol: TCP}
     - {containerPort: 443, hostPort: 443, protocol: TCP}
   ```

   ```bash
   kind delete cluster --name ckad
   kind create cluster --name ckad --config kind.yaml
   ```

   If creation fails with `address already in use`, something on your laptop owns port 80. Stop it, or change `hostPort` to 8080 and add `:8080` to every curl below.

2. **Install metrics-server.** kind's kubelets use self-signed certificates, so metrics-server needs `--kubelet-insecure-tls`. Never set that flag on a real cluster.

   ```bash
   kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.9.0/components.yaml
   kubectl -n kube-system patch deployment metrics-server --type=json \
     -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
   kubectl -n kube-system rollout status deployment/metrics-server
   ```

   Verify. The first scrape takes about 20 seconds; before that you get `Metrics API not available`.

   ```bash
   kubectl top nodes
   ```

   ```text
   NAME                 CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
   ckad-control-plane   205m         2%       838Mi           10%
   ```

3. **Install the ingress controller.** This is ingress-nginx's kind manifest: it runs the controller on the labelled node with host ports 80 and 443, and creates the IngressClass `nginx`.

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.15.1/deploy/static/provider/kind/deploy.yaml
   kubectl -n ingress-nginx wait --for=condition=Ready pod \
     -l app.kubernetes.io/component=controller --timeout=180s
   ```

   Verify end to end with a throwaway app. `*.localhost` names resolve to `127.0.0.1` without editing `/etc/hosts`.

   ```bash
   kubectl create namespace addons-test
   kubectl -n addons-test create deployment web --image=nginx:1.27
   kubectl -n addons-test expose deployment web --port=80
   kubectl -n addons-test create ingress web --class=nginx --rule="web.localhost/*=web:80"
   kubectl -n addons-test rollout status deployment/web
   curl -s http://web.localhost/ | grep -o '<title>.*</title>'
   kubectl delete namespace addons-test
   ```

   ```text
   <title>Welcome to nginx!</title>
   ```

   A `404 Not Found` from nginx means the controller works but no rule matched the host. `Connection refused` means the controller isn't running or the cluster has no port mapping.

:::note ingress-nginx is retired
The community ingress-nginx project ended maintenance in March 2026; controller-v1.15.1 is its last release and gets no more security fixes. It still works for learning the Ingress API, which is what interviews and the CKAD test. New platforms use a Gateway API implementation instead (→ [Ingress vs Gateway API](../reference/services-and-ingress.md#ingress-vs-gateway-api)). kind's own docs now use [cloud-provider-kind](https://github.com/kubernetes-sigs/cloud-provider-kind), which serves both Ingress and Gateway API without a third-party controller.
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

---

**Next in path →** [Command Patterns](./command-patterns.md)
