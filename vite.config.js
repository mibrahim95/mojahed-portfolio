import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Keep accepting the old CRA-style REACT_APP_* variables so existing
  // deployment environment settings keep working after the move to Vite.
  envPrefix: ["VITE_", "REACT_APP_"],
  css: {
    // semantic-ui-css ships a few invalid selectors; skip them instead of
    // failing the minify step.
    lightningcss: { errorRecovery: true },
  },
  build: {
    // Same output folder as Create React App, so the host's publish
    // directory setting does not need to change.
    outDir: "build",
  },
  server: {
    port: 3000,
  },
});
