# Local admin access — 2026-10-14

User requests private debug/cheats for Adrian. In the current single-player project, the supported owner workflow is the local development server:

- Open `http://127.0.0.1:5174/?debug=1`, Begin/Continue, then **Admin Adrian · Lokal** at the right. It opens automatically; the summary collapses it.
- Current developer tools: +500Coins, +5Food,14nest positions, Sanctuary/services/Horse, egg slot speed×60 and secured Legendary/Mythical Egg grants. These change that browser's local adventure. Teleport still refuses active carried Eggs/mounted travel; Dragon recovery remains wall-clock. Reset save remains clearly destructive and was never clicked in verification.
- The gate requires `import.meta.env.DEV`, an exact loopback hostname (`127.0.0.1`, `localhost`, IPv6loopback), and explicit `?debug=1`. Vite binds127.0.0.1. LAN/public/lookalike hosts cannot enable this UI. Normal local play has no panel or `__MW` API.
- Production build has no active admin panel/debug API even with `?debug=1`. Earlier browser verified17buttons/coin/Food actions; Task12 expands to25buttons and verified the two grants through actual hatch/growth/riding/save. Normal/production0admin buttons/no API/errors[]. Two hostname/opt-in checks and build/typecheck pass. Evidence `ASSET_WORK/iteration6/admin-local-browser.json` and newest `ASSET_WORK/iteration7/adventure-expansion-browser.json`.

This is **local-development isolation, not account authentication**. Adrian's name in the panel is a label, not a verified login. Anyone with access to the same development computer/source could run their own local copy. An all-client local save can also be edited by its owner; this does not grant access to Adrian's computer. For an online game with an exclusive admin account, add server-verified identity/roles and authorize each privileged server action; a URL flag, hidden menu, password in JavaScript or browser-stored admin role cannot substitute for that. No login/backend/credentials/cloud provider was added, and no claim of authenticated public admin access is made.

No personal browser save, original assets, Git state or deployment was changed. Temporary preview5176 stops after verification; owner dev5174 remains running.
