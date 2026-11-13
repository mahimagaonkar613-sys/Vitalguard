VITALGUARD - GITHUB PAGES DEPLOYMENT

This copy is configured for a GitHub repository named exactly:
vitalguard

It uses Vite + React and GitHub Actions to build the app and publish the dist/ folder.
The site uses HashRouter, which is compatible with a GitHub Pages project URL.

STEPS
1. Sign in at https://github.com
2. Create a NEW PUBLIC repository named: vitalguard
3. Upload the CONTENTS of this vg-react folder to the repository root.
   Include the hidden .github folder and all project folders (src, public, data).
   Do NOT upload node_modules or dist if they exist on your computer.
4. Commit the upload to the main branch.
5. In the repository, open Settings -> Pages.
6. Under Build and deployment -> Source, choose GitHub Actions.
7. Open the Actions tab and wait for "Deploy VitalGuard to GitHub Pages" to finish with a green check.
8. Your website URL will be:
   https://YOUR-GITHUB-USERNAME.github.io/vitalguard/

IMPORTANT
- Replace YOUR-GITHUB-USERNAME with your actual GitHub username.
- Repository name must remain vitalguard unless vite.config.js base is also changed.
- Keep the repository Public if using GitHub Free for Pages.
- Do not upload passwords, API keys, private records, or personal secrets.
- This is a static React app; no PHP or server-side Node process is required for this prototype.

LOCAL TEST (optional)
Open a terminal inside the vg-react folder and run:
  npm install
  npm run build
To run locally in development:
  npm run dev

If you rename the repository, change base in vite.config.js to /NEW-REPO-NAME/.
