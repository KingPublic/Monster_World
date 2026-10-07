# Web Bug Log

Observed during Task 00 browser validation, 2026-10-07:

| Issue | Reproduction / cause | Resolution | Verification |
| --- | --- | --- | --- |
| Deprecated shadow mode warning | Three.js 0.186 removed PCFSoftShadowMap | Use PCFShadowMap | Fresh browser boot: zero errors/warnings |
| Portrait camera cropping | Fixed vertical field-of-view on narrow aspect | Preserve horizontal framing with portrait field-of-view adjustment | 390×844 spatial inspection |
| Inspector stayed expanded after desktop-to-phone resize | details open state was set only at boot | Media-query change closes inspector in narrow viewports | Resize and viewport checks |

Missing GLB deliberately tested the fallback; it is an expected error path, not an unresolved bug. Historical prototype bugs are in [LEGACY_ROBLOX](../LEGACY_ROBLOX/TESTING/BUG_LOG.md). No full-game bug-free claim is made.
