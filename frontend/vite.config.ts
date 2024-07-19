import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { config } from "dotenv";

config();

export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
