import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  return {
    plugins: [react()],
    base: "/", // You might need to adjust this depending on your project's setup
    build: {
      outDir: isProduction ? 'dist' : 'build',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react"],
            "react-dom": ["react-dom"],
          },
        },
        input: {
          main: "index.html", // Path to your index.html file
        },
      },
    },
  };
});
