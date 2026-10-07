# Local → GitHub → Vercel

This is a standard static Vite site. No serverless APIs, secrets, backend or custom vercel.json are required for the current foundation. The migration does not deploy, commit or push.

Use Node.js 20.19+ or 22.12+ compatible with the pinned dependencies. From the repository root Monster_World:

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

Build emits dist/; preview serves that production output locally. Review changes, then the user handles Git commits and pushes to the existing GitHub remote. To set up Vercel later, import that GitHub repository, choose Vite, set project Root Directory to the repository root (the folder containing package.json), Build Command npm run build, Output Directory dist and Install Command npm ci. Commit package-lock.json. After setup, deployments may follow main automatically through the Git integration.

Local → Git → GitHub → Vercel Project → Vite Build → dist/ → automatic deployment from main after user setup.

The local checkout's parent folder is not the Git root; Monster_World is the repository root. Public GLB paths must resolve in preview and deployment; references/history stay outside public and are not emitted by Vite. See [Vite static deployment](https://vite.dev/guide/static-deploy.html#vercel). Optional domain/account settings and release approval remain user decisions. No .env is needed.
