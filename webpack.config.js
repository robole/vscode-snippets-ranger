/* eslint-disable node/no-unpublished-require */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
  target: "node",
  entry: { main: "./src/extension.js" },
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
    filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded.
  },
};
module.exports = config;
