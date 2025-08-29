import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      proxy: {
        // Any request to a path starting with /zenquotes will be proxied
      '/api': {
        target: 'https://zenquotes.io',
        changeOrigin: true, // This is required for the proxy to work
        // We don't need a rewrite because your app calls /api/quotes
        // and the target server also expects /api/quotes.
      },
      },
    },
  };
});
