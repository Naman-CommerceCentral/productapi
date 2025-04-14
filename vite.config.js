import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Ensure this matches the frontend port
    proxy: {
      "/api": {
        target: "http://localhost:3001", // Ensure this matches the backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
