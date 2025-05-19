// import { defineConfig } from "vite";
// import { resolve } from "path";
// import { visualizer } from "rollup-plugin-visualizer";

// export default defineConfig({
//   build: {
//     lib: {
//       entry: resolve(__dirname, "src/components/Autocomplete.js"),
//       name: "Autocomplete",
//       fileName: (format) => `Autocomplete.${format}.js`,
//       formats: ["es", "umd"],
//     },
//     rollupOptions: {
//       external: ["lit"],
//       output: {
//         globals: {
//           lit: "lit",
//         },
//       },
//     },
//     plugins: [visualizer()],
//   },
// });

// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  // Library build configuration
  build: {
    lib: {
      entry: resolve(__dirname, "src/components/Autocomplete.js"),
      name: "Autocomplete",
      fileName: (format) => `Autocomplete.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["lit"],
      output: {
        globals: {
          lit: "lit",
        },
      },
    },
    plugins: [visualizer()],
  },

  // Dev server (npm run dev / npm start) configuration
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
    // Whitelist your Render domain so Vite will accept requests
    allowedHosts: ["autocomplete-editor-frontend.onrender.com"],
  },

  // Preview server (npm run preview) configuration
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: ["autocomplete-editor-frontend.onrender.com"],
  },
});
