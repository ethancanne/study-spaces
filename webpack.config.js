const HTMLWebpackPlugin = require("html-webpack-plugin");
const Path = require("path");
const PrettierPlugin = require("prettier-webpack-plugin");

const Configuration = require("./Configuration.js");

let webpackConfiguration = {
  entry: Path.join(__dirname, "Client", "src", "index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: Path.join(__dirname, "Client", "build"),
    filename: "bundle.js",
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: Path.join(__dirname, "Client", "public", "index.html"),
    }),
    new PrettierPlugin()
  ],
  devServer: {
    static: {
      directory: Path.join(__dirname, "Client", "public"),
    },
    port: 3000,
    proxy: {
      "/api": `http://localhost:${ Configuration.getServerPort() }`,
    },
  },
};

const applicationIsInDevelopment = (!Configuration.isSetToProduction());
if (applicationIsInDevelopment) {
  webpackConfiguration.devtool = "inline-source-map";
}

module.exports = webpackConfiguration;
