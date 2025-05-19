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

import { defineConfig } from "vite";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
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

  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
    allowedHosts: ["autocomplete-editor-frontend.onrender.com"],
  },

  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: ["autocomplete-editor-frontend.onrender.com"],
  },
});
