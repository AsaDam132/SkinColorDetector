import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Backend port must match server/index.js (default 4000, override with PORT).
const API = process.env.VITE_API_TARGET || "http://127.0.0.1:4000";

export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": API } },
  preview: { proxy: { "/api": API } },
});
