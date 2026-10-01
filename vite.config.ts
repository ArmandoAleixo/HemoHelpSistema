import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const frontendSource = fileURLToPath(new URL("./frontend/src", import.meta.url));

export default defineConfig({
  resolve: { alias: { "@": frontendSource } },
  plugins: [
    tailwindcss(),
    tanstackStart({
      srcDirectory: "frontend/src",
      router: {
        routesDirectory: "routes",
        generatedRouteTree: "routeTree.gen.ts",
        autoCodeSplitting: true,
      },
      server: { entry: "server" },
    }),
    react(),
  ],
});
