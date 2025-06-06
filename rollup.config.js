import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const { default: pkg } = await import("./package.json", {
  with: { type: "json" },
});

const input = {
  index: "src/index.ts",
  "jsx-runtime": "src/jsx-runtime.ts",
};

export default defineConfig([
  {
    input,
    external: Object.keys(pkg.dependencies),
    output: [
      {
        dir: "dist",
        format: "esm",
        sourcemap: true,
        entryFileNames: "esm/[name].js",
        chunkFileNames: "esm/chunks/[name]-[hash].js",
      },
      {
        dir: "dist",
        format: "cjs",
        sourcemap: true,
        entryFileNames: "cjs/[name].js",
        chunkFileNames: "cjs/chunks/[name]-[hash].js",
      },
    ],
    plugins: [
      esbuild({
        tsconfig: "tsconfig.json",
        minify: true,
      }),
    ],
  },
  {
    input,
    external: Object.keys(pkg.dependencies),
    output: {
      dir: "dist/types",
      format: "es",
    },
    plugins: [dts()],
  },
]);
