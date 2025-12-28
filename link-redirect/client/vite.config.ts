// vite.config.js
import { defineConfig } from "vite"

export default defineConfig({
  server: {
    allowedHosts: [
      "uio.leganger.dev",
      // add more if needed
      // "localhost",
      // "127.0.0.1",
    ],
  },
})

