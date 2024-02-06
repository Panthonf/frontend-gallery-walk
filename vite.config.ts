import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/", // You might need to adjust this depending on your project's setup
  build: {
    outDir: "dist",
    emptyOutDir: true, // Ensure the output directory is empty before building
    lib: {
      entry: "src/main.ts",
      name: "react-vite",
      fileName: (format) => `react-vite.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-router", "react-router-dom", "react-redux"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  server: {
    port: 3000, // Adjust the port if necessary
  },
});
