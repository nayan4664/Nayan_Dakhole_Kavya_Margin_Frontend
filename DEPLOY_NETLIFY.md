Steps to deploy the frontend to Netlify

1. Push this repository to a Git host (GitHub/GitLab/Bitbucket).
2. In Netlify, click "Add new site" → "Import from Git" and connect your repo.
3. Set the build command to `npm run build` and the publish directory to `dist`.
4. If your frontend calls the backend, set an environment variable `VITE_API_BASE_URL` in Netlify's Site settings -> Build & deploy -> Environment to your backend's URL.
   - Vite exposes env vars that start with `VITE_` at build time and they are available as `import.meta.env.VITE_API_BASE_URL` in the app.
5. Deploy. Netlify will run the build and publish `dist`.

Local preview:

- Run the build locally with:

  ```bash
  npm install
  npm run build
  npm run preview
  ```

Backend options:

- Deploy the `backend/` Express app separately (recommended): Render, Railway, Fly, or Fly.io work well for Node apps. After deploying the backend, set `VITE_API_BASE_URL` to the backend URL (for example `https://api.example.com`).
- Alternatively, convert individual server endpoints into Netlify Functions and host them in the same Netlify site, but that requires refactoring the `backend/` code.

After deployment, verify that `VITE_API_BASE_URL` is set and the site can fetch from the API.
