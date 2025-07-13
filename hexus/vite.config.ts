import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["**/*"],
            workbox: {
                globPatterns: ["**/*.{js,css,html,png,svg,mp3,json}"],
            },
            manifest: {
                name: "Hexus",
                short_name: "Hexus",
                start_url: "/",
                scope: "/",
                display: "standalone",
                background_color: "#2b3a4bff",
                theme_color: "#7699ceff",
                icons: [
                    {
                        src: "/blindern-logo.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/blindern-logo.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    server: {
        host: "0.0.0.0",
        port: 3000,
        allowedHosts: true,
        https: {
            key: fs.readFileSync(path.resolve(__dirname, "./.cert/key.pem")),
            cert: fs.readFileSync(path.resolve(__dirname, "./.cert/cert.pem")),
        },
    },
});
