/* eslint-disable node/no-unpublished-require */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const crypto = require("crypto");

const crypto_orig_createHash = crypto.createHash;
crypto.createHash = (algorithm) =>
  crypto_orig_createHash(algorithm === "md4" ? "sha256" : algorithm);

const config = {
  target: "node",
  entry: { main: "./src/main.js" },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin(), new TerserPlugin()],
  },
  plugins: [new MiniCssExtractPlugin({ filename: "styles.minified.css" })],
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded.
  },
};
module.exports = config;
