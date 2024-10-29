const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  externals: [nodeExternals()],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: "@unicornshift/mui-iconify-picker",
    libraryTarget: "commonjs",
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, "./src"),
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
    ],
  },
};
