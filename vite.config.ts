import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom plugin to inject the DEFAULT_MODULE value from config
const defaultModulePlugin = (): Plugin => {
  let defaultModule: string;
  
  return {
    name: 'vite-plugin-default-module',
    configResolved() {
      // Read the config file to get the DEFAULT_MODULE value
      try {
        const configPath = path.resolve(__dirname, 'client/src/config.ts');
        const configContent = fs.readFileSync(configPath, 'utf8');
        // Extract the DEFAULT_MODULE value using regex
        const match = configContent.match(/DEFAULT_MODULE:\s*ModuleType\s*=\s*"([^"]+)"/);
        defaultModule = match ? match[1] : 'dashboard';
        console.log(`[DefaultModulePlugin] Using "${defaultModule}" as default module`);
      } catch (error) {
        console.error('[DefaultModulePlugin] Error reading config:', error);
        defaultModule = 'dashboard'; // Fallback
      }
    },
    transformIndexHtml(html) {
      // Replace the placeholder with the actual default module
      return html.replace(/"__DEFAULT_MODULE__"/g, `"${defaultModule}"`);
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    defaultModulePlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  },
});
