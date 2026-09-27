---
title: Services & Ingress
sidebar_label: Services & Ingress
sidebar_position: 10
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Services & Ingress

> Docs: [Service](https://kubernetes.io/docs/concepts/services-networking/service/) · [EndpointSlices](https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/) · [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/) · [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) · [Gateway API](https://kubernetes.io/docs/concepts/services-networking/gateway/)

## Overview

Pods are replaced all the time and every replacement gets a new IP, so nothing should talk to a Pod IP directly. A **Service** gives a set of Pods one stable virtual IP and DNS name. It finds its Pods by **label selector** and nothing else. The EndpointSlice controller keeps the list of Ready, matching Pod IPs current, and kube-proxy on each node routes the virtual IP to them. An **Ingress** adds HTTP routing on top: one external entry point that sends `shop.example.com/api` to one Service and `/` to another. An Ingress does nothing unless an Ingress controller is installed. Almost every "can't reach my app" question is answered by walking this path hop by hop.

<ThemedImage
  alt="Request path: client to Ingress to Service api to EndpointSlice to two Pods labelled app=api in namespace shop, with NetworkPolicy gates at the namespace boundary; a third Pod labelled app=web receives nothing"
  sources={{
    light: useBaseUrl('/img/kubernetes-ckad/fig-services-and-ingress-1-light.svg'),
    dark: useBaseUrl('/img/kubernetes-ckad/fig-services-and-ingress-1-dark.svg'),
  }}
/>

*Figure 10-1: The request path. Amber marks labels and the selector that matches them, the only link between a Service and its Pods. Grey is a Pod the selector doesn't match. The dark bars are NetworkPolicy checks (→ [Network Policy](./network-policy.md)).*

## Key concepts

### Service types

| Type | Reachable from | How | Use when |
|---|---|---|---|
| **ClusterIP** (default) | Inside the cluster | Virtual IP + DNS name | Service-to-service traffic |
| **NodePort** | Outside, via `<any-node-ip>:30000–32767` | Opens the port on every node | Quick tests, or behind your own load balancer |
| **LoadBalancer** | Outside, via a cloud load balancer | NodePort + a provisioned external LB | One externally exposed TCP/UDP service |
| **ExternalName** | Inside | DNS CNAME to an outside name | Alias an external database |
| **Headless** (`clusterIP: None`) | Inside | DNS returns Pod IPs directly, no virtual IP | StatefulSets, client-side load balancing |

### The four ports

| Field | Where | Meaning |
|---|---|---|
| `containerPort` | Pod spec | What the app listens on. Informational only. |
| `targetPort` | Service | Where the Service sends traffic on the Pod. Must match what the app listens on. |
| `port` | Service | What clients connect to on the Service IP |
| `nodePort` | Service (NodePort/LB) | Port opened on every node |

| Service `port` → `targetPort` | App listens on | Result |
|---|---|---|
| 80 → 8080 | 8080 | Works |
| 80 → 80 | 8080 | Endpoints exist, but connections are refused |
| 80 → `http` (named) | Port named `http` in the Pod spec | Works, and survives the app changing port numbers |

### DNS names

| Name | Resolves from |
|---|---|
| `api` | Same namespace |
| `api.shop` | Any namespace |
| `api.shop.svc.cluster.local` | Anywhere in the cluster (fully qualified) |
| `db-0.db.shop.svc.cluster.local` | A single StatefulSet Pod behind a headless Service |

### Ingress vs Gateway API

| | Ingress | Gateway API |
|---|---|---|
| API | `networking.k8s.io/v1`, stable, in the CKAD curriculum | `gateway.networking.k8s.io/v1`, the successor |
| Model | One object: host + path rules | Split roles: GatewayClass (infra), Gateway (platform), HTTPRoute (app team) |
| Traffic splitting, header matching | Controller-specific annotations | Built in (weights, headers) |
| Needs a controller | Yes | Yes |

The community `ingress-nginx` controller was retired in 2026. Ingress objects keep working with other controllers, and new platforms increasingly choose Gateway API.

## kubectl essentials

Expose and inspect:

```bash
kubectl expose deployment api --port=80 --target-port=8080               # ClusterIP
kubectl expose deployment api --port=80 --target-port=8080 --type=NodePort --name=api-np
kubectl create service clusterip api --tcp=80:8080 --dry-run=client -o yaml   # selector is app=api
kubectl get svc,endpointslices -l app=api
kubectl get endpointslices -l kubernetes.io/service-name=api -o wide     # the actual Pod IPs
kubectl describe svc api                                                  # Selector, TargetPort, Endpoints
kubectl get pods -l app=api --show-labels                                 # does the selector match anything?
```

Test from inside the cluster:

```bash
kubectl run tmp --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://api
kubectl run tmp --rm -it --image=busybox:1.36 --restart=Never -- nslookup api.shop
kubectl port-forward svc/api 8080:80                                      # then curl localhost:8080
```

Ingress:

```bash
kubectl create ingress shop --class=nginx \
  --rule="shop.example.com/api*=api:80" --rule="shop.example.com/*=web:80"
kubectl get ingressclass
kubectl describe ingress shop                                             # rules and resolved backends
```

A Service with a named target port:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  type: ClusterIP
  selector:
    app: api                     # must match the Pod template labels exactly
  ports:
  - name: http
    port: 80
    targetPort: http             # the containerPort named "http"
```

An Ingress routing by path:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shop
spec:
  ingressClassName: nginx
  tls:
  - hosts: [shop.example.com]
    secretName: shop-tls         # a kubernetes.io/tls Secret
  rules:
  - host: shop.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api
            port: {number: 80}
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port: {number: 80}
```

## 🧪 Lab

:::tip Lab 10-1 ★★
See [Standard lab setup](../start-here/local-setup.md#standard-lab-setup) · [How the tiers work](../start-here/local-setup.md#lab-tiers).

**Break the link between a Service and its Pods, then find it.** [Lab 0](../start-here/mental-model.md#-lab) does the basic selector break; this lab adds `targetPort` and Ingress.

**Goal**

1. In namespace `lab10`, create Deployment `api` (`registry.k8s.io/e2e-test-images/agnhost:2.53`, args `netexec --http-port=8080`, 2 replicas).
2. Expose it as Service `api` on port 80 → 8080. Call it from a temporary Pod.
3. Patch the Service selector to `app: apii`. Call it again and find the cause using only `kubectl get`/`describe`.
4. Fix the selector, then change `targetPort` to 9090 and describe how the symptom differs.
5. Create an Ingress `shop` routing `/api` to `api:80` and check its backends with `kubectl describe`.

**Verify**

```bash
kubectl -n lab10 get endpointslices -l kubernetes.io/service-name=api   # 2 endpoints after the fix
kubectl -n lab10 run tmp --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://api/hostname
```

<details>
<summary>🟡 Hints</summary>

1. agnhost is in the [image kit](../start-here/command-patterns.md#the-image-kit). Note how `--` behaves under `create deployment`.
2. `kubectl expose -h`: look at `--port` and `--target-port`.
3. `kubectl describe svc` shows `Selector` and `Endpoints`. Compare with `kubectl get pods --show-labels`.
4. `kubectl patch --type=json` can replace `/spec/ports/0/targetPort`. Is the error the same? What does `describe svc` show this time?
5. "Route HTTP by host and path" in [Command Patterns](../start-here/command-patterns.md#expose-it).

</details>

<details>
<summary>🟢 Guided</summary>

1. Create the lab namespace.

   ```bash
   kubectl create namespace lab10
   ```

2. Run 2 agnhost Pods serving HTTP on 8080 (create deployment: the words after -- replace the entrypoint).

   ```bash
   kubectl -n lab10 create deployment api --image=registry.k8s.io/e2e-test-images/agnhost:2.53 \
     --replicas=2 --port=8080 -- /agnhost netexec --http-port=8080
   ```

3. Create a Service: port 80 on the Service, 8080 on the Pods.

   ```bash
   kubectl -n lab10 expose deployment api --port=80 --target-port=8080
   ```

4. Call it from a throwaway Pod: prints the serving Pod's name.

   ```bash
   kubectl -n lab10 run tmp --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://api/hostname
   ```

5. Break the selector with a typo.

   ```bash
   kubectl -n lab10 patch svc api -p '{"spec":{"selector":{"app":"apii"}}}'
   ```

6. Call it again: Connection refused, although DNS still resolves.

   ```bash
   kubectl -n lab10 run tmp --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://api/hostname
   ```

7. See why: Endpoints: `<none>`.

   ```bash
   kubectl -n lab10 describe svc api
   ```

8. The Pods are `app=api`; the selector says `app=apii`.

   ```bash
   kubectl -n lab10 get pods --show-labels
   ```

9. Fix the selector.

   ```bash
   kubectl -n lab10 patch svc api -p '{"spec":{"selector":{"app":"api"}}}'
   ```

10. Send traffic to a port nothing listens on.

    ```bash
    kubectl -n lab10 patch svc api --type=json -p '[{"op":"replace","path":"/spec/ports/0/targetPort","value":9090}]'
    ```

11. Call it: also "Connection refused", but now describe svc lists endpoints; the Pod itself refuses.

    ```bash
    kubectl -n lab10 run tmp --rm -it --image=busybox:1.36 --restart=Never -- wget -qO- -T 3 http://api/hostname
    ```

12. Put targetPort back.

    ```bash
    kubectl -n lab10 patch svc api --type=json -p '[{"op":"replace","path":"/spec/ports/0/targetPort","value":8080}]'
    ```

13. Route shop.example.com/api to the Service.

    ```bash
    kubectl -n lab10 create ingress shop --rule="shop.example.com/api*=api:80"
    ```

14. Check the backends: api:80 (10.244.x.x:8080,...).

    ```bash
    kubectl -n lab10 describe ingress shop
    ```

    Traffic flows only once an Ingress controller is installed (on kind, see kind's ingress guide).

15. Delete everything the lab created.

    ```bash
    kubectl delete namespace lab10
    ```

</details>
:::

## Gotchas

- **Selector typos fail silently.** The Service is created and DNS resolves; it just has no endpoints.
- **"Connection refused" has two causes.** kube-proxy rejects connections to a Service with no endpoints, and a wrong `targetPort` is refused by the Pod. `describe svc` tells them apart: empty vs listed Endpoints. A NetworkPolicy drop times out instead.
- **Not Ready means not an endpoint.** A failing readiness probe removes the Pod from the EndpointSlice. → See [Probes & Observability](./probes-and-observability.md).
- **Short names only work in the same namespace.** Across namespaces use `api.shop`.
- **An Ingress with no controller does nothing.** `ADDRESS` stays empty. Check `kubectl get ingressclass`.
- **`pathType` is required.** `Prefix` matches path segments (`/api` matches `/api/v1`, not `/apiv1`). `Exact` matches one path.
- **`kubectl get endpoints` is deprecated.** The Endpoints API is deprecated in favour of EndpointSlices. Use `kubectl get endpointslices`.

## Scenario questions

**Q1 ★ A Service exists and DNS resolves, but every request gets "connection refused". What do you check?**

<details>
<summary>Model answer</summary>

- **Clarify:** did it ever work? What changed?
- **Observe:** `kubectl describe svc` → `Endpoints: <none>`. Compare `Selector` with `kubectl get pods --show-labels`.
- **Hypothesise:** the selector doesn't match the Pod labels, or matching Pods exist but none are Ready. With no endpoints, kube-proxy rejects the connection, which is why it's refused rather than timing out.
- **Fix:** correct the selector or labels, or fix whatever keeps the Pods from becoming Ready.
- **Prevent:** generate Service and Deployment from the same template (Helm/Kustomize) so labels can't drift apart. Alert on Services with zero endpoints.

</details>

**Q2 ★★ Port-forwarding to a Pod works, but going through the Service fails with "connection refused". Why?**

<details>
<summary>Model answer</summary>

- **Clarify:** which port does the app listen on, and what does the Service say?
- **Observe:** `kubectl describe svc` shows `TargetPort: 80/TCP`; the port-forward used 8080. Endpoints are listed.
- **Hypothesise:** `targetPort` points at a port where nothing listens. Endpoints exist, so this refusal comes from the Pod itself, not from kube-proxy.
- **Fix:** set `targetPort: 8080`, or better, name the container port and use `targetPort: http`.
- **Prevent:** named ports keep the Service correct when the app's port changes.

</details>

**Q3 ★★ You need to expose five HTTP services externally. LoadBalancer per Service, or Ingress?**

<details>
<summary>Model answer</summary>

- **Clarify:** all HTTP? Same domain? TLS required? Any non-HTTP protocols?
- **Observe:** each LoadBalancer Service provisions a separate cloud load balancer and IP, with its own cost and certificate handling.
- **Hypothesise:** HTTP services sharing a domain belong behind one entry point that routes by host and path and terminates TLS once.
- **Fix:** one Ingress (or Gateway API HTTPRoutes) in front of five ClusterIP Services. Keep LoadBalancer for non-HTTP protocols such as a TCP game server or MQTT.
- **Prevent:** the trade-off: a shared entry point is a shared failure domain and needs capacity planning. For a new platform, I'd pick Gateway API: standard weights and header matching, and clean role separation.

</details>

**Q4 ★★★ Users see a burst of 502s during every rolling deploy, although readiness probes pass. Why?**

<details>
<summary>Model answer</summary>

- **Clarify:** 502s at startup or at shutdown of Pods? Through the Ingress, or also Service-to-Service?
- **Observe:** errors line up with old Pods terminating. The proxy logs show connections reset by upstream.
- **Hypothesise:** on deletion, the kubelet sends SIGTERM while endpoint removal is still propagating to kube-proxy and the Ingress controller. For a moment, traffic still arrives at a Pod that has stopped accepting it.
- **Fix:** a `preStop` hook that sleeps 5–10 s, so the Pod keeps serving until everyone has removed it, plus graceful shutdown in the app and a `terminationGracePeriodSeconds` longer than both (→ [termination sequence](./scheduling.md#the-termination-sequence)).
- **Prevent:** add connection draining to the release checklist and test it with load running during a deploy. → See [Zero-Downtime Release](../scenarios/zero-downtime-release.md).

</details>

## Summary

- **Services find Pods by label only.** Check `describe svc` → Endpoints before anything else.
- **`port` is the Service's, `targetPort` is the app's.** Name ports to avoid mismatches.
- **Only Ready Pods receive traffic.** Readiness probes control Service membership.
- **Use DNS names, not IPs.** `svc.namespace` works across namespaces.
- **Ingress routes HTTP and needs a controller.** Gateway API is its successor; both are worth knowing.
