---
title: Glossary
sidebar_label: Glossary
sidebar_position: 4
---

import Link from "@docusaurus/Link";

# Glossary

> Docs: [Kubernetes glossary](https://kubernetes.io/docs/reference/glossary/) · [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) · [Objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/)

One line per term. Follow the link for the full explanation.

## Connecting

| Term | Definition | More |
|---|---|---|
| <Link id="cluster" />**Cluster** | A control plane plus the nodes it manages. One API endpoint. | [Architecture](../reference/architecture.md#overview) |
| <Link id="kubeconfig" />**kubeconfig** | The YAML file on your laptop that tells kubectl which clusters exist and how to log in. | [kubeconfig in 5 lines](./local-setup.md#kubeconfig-in-5-lines) |
| <Link id="context" />**Context** | A named triple in kubeconfig: cluster + user + default namespace. | [Context vs Namespace](./local-setup.md#context-vs-namespace) |
| <Link id="current-context" />**Current context** | The context kubectl uses when you don't pass `--context`. | [Standard lab setup](./local-setup.md#standard-lab-setup) |

## Organization

| Term | Definition | More |
|---|---|---|
| <Link id="imperative-vs-declarative" />**Imperative vs declarative** | Imperative commands (`run`, `create`, `scale`) change the cluster directly. Declarative `apply -f` makes it match a file. | [Generate, edit, apply](./command-patterns.md#generate-edit-apply) |
| <Link id="namespace" />**Namespace** | A named partition inside a cluster for names, access and quotas. | [What a namespace isolates](./local-setup.md#what-a-namespace-isolates) |
| <Link id="namespaced-vs-cluster-scoped" />**Namespaced vs cluster-scoped** | Namespaced kinds (Pod, Service) live in a namespace. Cluster-scoped kinds (Node, PV, ClusterRole) don't. List them with `kubectl api-resources --namespaced=true` or `=false`. | [Architecture](../reference/architecture.md#kubectl-essentials) |

## Machinery

| Term | Definition | More |
|---|---|---|
| <Link id="control-plane" />**Control plane** | The components that decide: API server, etcd, scheduler, controller manager. | [Components](../reference/architecture.md#components) |
| <Link id="api-server" />**API server** | The front door. Validates and stores every read and write. The only client of etcd. | [Components](../reference/architecture.md#components) |
| <Link id="etcd" />**etcd** | The key-value store holding every object's spec and status. | [Components](../reference/architecture.md#components) |
| <Link id="scheduler" />**Scheduler** | Picks a node for each Pod that has none. | [Components](../reference/architecture.md#components) |
| <Link id="controller-manager" />**Controller manager** | One process running the built-in controllers (ReplicaSet, Deployment, Job…). | [Components](../reference/architecture.md#components) |
| <Link id="node" />**Node** | A machine (VM, server, or a Docker container in kind) that runs Pods. | [Components](../reference/architecture.md#components) |
| <Link id="kubelet" />**kubelet** | The agent on every node. Starts the Pods bound to it and reports their status. | [Components](../reference/architecture.md#components) |
| <Link id="container-runtime" />**Container runtime** | Pulls images and runs containers for the kubelet (containerd, CRI-O). | [Components](../reference/architecture.md#components) |
| <Link id="controller" />**Controller** | A loop that watches objects and acts to make actual state match desired state. | [Controllers](./mental-model.md#controllers-same-loop-different-promises) |

## Describing state

| Term | Definition | More |
|---|---|---|
| <Link id="resource" />**Resource / kind** | A type the API serves (`kind: Deployment`). "Resource" is its plural API name (`deployments`). | [API groups](../reference/architecture.md#api-groups-and-versions) |
| <Link id="object" />**Object** | One stored instance of a kind, such as Deployment `web` in `lab1`. | [Four top-level fields](../reference/architecture.md#kubectl-essentials) |
| <Link id="manifest" />**Manifest** | A YAML file describing one or more objects, applied with `kubectl apply -f`. | [Where a change lives](../reference/architecture.md#where-a-change-lives) |
| <Link id="spec-vs-status" />**spec vs status** | `spec` is what you want, written by you. `status` is what exists, written by controllers. | [Where a change lives](../reference/architecture.md#where-a-change-lives) |
| <Link id="label" />**Label** | A key-value pair on an object, used for selection (`app: web`). | [Where labels link](./mental-model.md#where-labels-do-the-linking) |
| <Link id="selector" />**Selector** | A label query that picks objects. The only way a Service or ReplicaSet finds its Pods. | [Where labels link](./mental-model.md#where-labels-do-the-linking) |
| <Link id="annotation" />**Annotation** | A key-value pair for tools and humans. Never used for selection. | [Annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/) |

## Workloads & networking

| Term | Definition | More |
|---|---|---|
| <Link id="pod" />**Pod** | One or more containers sharing a network and volumes. The smallest thing you run. | [Pods](../reference/pods-and-multi-container.md) |
| <Link id="replicaset" />**ReplicaSet** | Keeps N copies of one Pod template running. Owned by a Deployment. | [Deployments](../reference/deployments-and-rollouts.md#rollout-strategy) |
| <Link id="deployment" />**Deployment** | Manages ReplicaSets to roll out new Pod templates and roll back. | [Deployments](../reference/deployments-and-rollouts.md#choosing-a-workload-resource) |
| <Link id="service" />**Service** | A stable name and IP in front of the Pods its selector matches. | [Service types](../reference/services-and-ingress.md#service-types) |
| <Link id="endpointslice" />**EndpointSlice** | The current list of Ready Pod IPs behind a Service. Empty means no traffic. | [Life of an apply](./mental-model.md#life-of-a-kubectl-apply) |
