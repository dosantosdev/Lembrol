import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "Lembrol — Project Manager",
        short_name: "Lembrol",
        description: "A project and task manager with intelligent reminders.",
        start_url: "/",
        scope: "/",
        display: "standalone",

        theme_color: "#0d0918",
        background_color: "#0d0918",

        icons: [
          {
            src: "/lembrol.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/lembrol.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
