---
title: Cloud Storage
sidebar_label: Cloud Storage
sidebar_position: 1
---

# Cloud Storage: Classes and Lifecycle Policies

## Storage Classes

Choose a storage class based on how frequently data is accessed and how long it must be retained.

| Class | Min Storage Duration | Access Frequency | Retrieval Cost | Typical Use Case |
|---|---|---|---|---|
| **Standard** | None | Frequent / real-time | None | Active media, serving content, hot data |
| **Nearline** | 30 days | ~Once a month | Low | Monthly backups, data accessed infrequently |
| **Coldline** | 90 days | ~Once a quarter | Medium | Quarterly DR snapshots, archival |
| **Archive** | 365 days | ~Once a year | High | Long-term compliance archives, legal hold |

**Key rule:** The less frequent the access, the lower the storage price but the higher the retrieval cost. Never choose a class solely on storage price — factor in how often data is read.

## Lifecycle Policies

Lifecycle rules automatically transition or delete objects based on conditions. Configured at the bucket level.

### Common Actions

| Action | What It Does |
|---|---|
| `SetStorageClass` | Transitions object to a cheaper class |
| `Delete` | Permanently deletes the object |

### Conditions You Can Match On

- **Age** — days since object was created
- **CreatedBefore** — objects created before a specific date
- **IsLive** — for versioned buckets: `true` = current version, `false` = non-current version
- **NumNewerVersions** — keep only N most recent versions, delete older ones
- **MatchesStorageClass** — only apply rule to objects already in a given class

### Typical Lifecycle Pattern (media archive example)

```
Day 0        → Standard        (active / being served)
After 30d    → Nearline        (less active, monthly access)
After 90d    → Coldline        (quarterly DR / compliance)
After 365d   → Archive         (legal hold / long-term retention)
After 7 years → Delete         (retention policy expired)
```

### Versioning + Lifecycle

When object versioning is enabled, deleting a live object creates a **non-current version** (not permanently deleted). Use lifecycle rules to clean up non-current versions:

- Delete non-current versions older than N days
- Keep only the most recent N non-current versions

Without a lifecycle rule on non-current versions, storage costs grow unbounded.

## Decision Guide

**"Optimise storage costs for growing media volumes" (e.g. Altostrat)**
→ Enable versioning for safety + lifecycle policy to transition Standard → Nearline → Coldline → Archive by age. Add a `Delete` rule for non-current versions after a retention window.

**"Compliance / legal hold — must retain for 7 years"**
→ Archive class + Object Retention Lock or Bucket Lock (WORM policy). Prevents deletion or class downgrade before retention period expires.

**"DR backup accessed once per quarter"**
→ Coldline (90-day minimum matches quarterly access pattern, avoids early retrieval penalty).

**"Disaster recovery — need to restore within hours"**
→ Nearline or Standard, not Coldline/Archive (high retrieval latency and cost for frequent restores).

## Exam Tips

- Min storage duration penalties apply if you delete/transition an object *before* the minimum — you still pay for the full minimum period
- `SetStorageClass` rules only move objects *down* (cheaper) — you cannot use lifecycle to move back up to Standard
- Object Retention / Bucket Lock ≠ versioning — locking prevents *all* deletion including by admins; versioning just preserves history
- Autoclass is an alternative to manual lifecycle rules: GCP automatically moves objects between Standard and Nearline/Coldline based on access patterns — useful when access patterns are unpredictable
