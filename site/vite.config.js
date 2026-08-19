import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the GitHub Pages project path: https://<org>.github.io/awesome-rsi/
export default defineConfig({
  base: "/awesome-rsi/",
  plugins: [react()],
});
