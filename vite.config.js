import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project site: https://<username>.github.io/vitalguard/
export default defineConfig({
  base: "/vitalguard/",
  plugins: [react()],
  server: { port: 3000, open: true },
});
