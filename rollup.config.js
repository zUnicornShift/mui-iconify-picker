const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const external = require("rollup-plugin-peer-deps-external");
const postcss = require("rollup-plugin-postcss");
const svg = require("rollup-plugin-svg");
const json = require("@rollup/plugin-json");
const nodePolyfills = require("rollup-plugin-polyfill-node");

const packageJson = require("./package.json");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: false,
      name: packageJson.name,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: false,
    },
  ],
  external: ["react", "react-dom", "@mui/material"],
  plugins: [
    external(),
    resolve({preferBuiltins: true, browser: true}),
    commonjs(),
    typescript({tsconfig: "./tsconfig.json"}),
    postcss(),
    terser(),
    svg({base64: true}),
    json(),
    nodePolyfills(),
  ],
};
