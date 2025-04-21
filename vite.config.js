import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this matches the frontend port
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Ensure this matches the backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
