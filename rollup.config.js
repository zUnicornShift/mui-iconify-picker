const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const external = require("rollup-plugin-peer-deps-external");
const postcss = require("rollup-plugin-postcss");
const svg = require("rollup-plugin-svg");
const json = require("@rollup/plugin-json");

const packageJson = require("./package.json");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
      name: packageJson.name,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  external: ["react", "react-dom", "@mui/material"],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    postcss(),
    terser(),
    svg(),
    json(),
  ],
};
