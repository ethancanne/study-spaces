const HTMLWebpackPlugin = require("html-webpack-plugin");
const Path = require("path");

const Configuration = require("./Configuration.js");

module.exports = {
  entry: Path.join(__dirname, "Client", "src", "index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"]
      }
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: Path.join(__dirname, "Client", "build"),
    filename: "bundle.js",
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: Path.join(__dirname, "Client", "public", "index.html")
    })
  ],
  devServer: {
    static: {
      directory: Path.join(__dirname, "Client", "public"),
    },
    port: 3000,
    proxy: {
      "/api": `http://localhost:${Configuration.getServerPort()}`
    }
  },
};
