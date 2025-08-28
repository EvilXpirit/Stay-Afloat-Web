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
        "/zenquotes": {
          target: "https://zenquotes.io",
          changeOrigin: true,
          // Rewrite the path to remove the '/zenquotes' prefix
          // so '/zenquotes/api/quotes' becomes '/api/quotes'
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_PROXY_PATH}`), ''),
        },
      },
    },
  };
});
