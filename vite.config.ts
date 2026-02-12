import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("/react/") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "framework";
          }

          if (id.includes("@radix-ui") || id.includes("lucide-react")) {
            return "ui";
          }

          if (id.includes("gsap")) {
            return "anim";
          }

          if (
            id.includes("leaflet") ||
            id.includes("react-leaflet") ||
            id.includes("@turf")
          ) {
            return "map";
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          if (id.includes("@lottiefiles")) {
            return "lottie";
          }
        },
      },
    },
  },
});
