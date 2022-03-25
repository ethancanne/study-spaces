let dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const HTMLWebpackPlugin = require("html-webpack-plugin");
const Path = require("path");
const PrettierPlugin = require("prettier-webpack-plugin");
const webpack = require("webpack");

const Configuration = require("./Configuration.js");

// SANITIZE ENVIRONMENT VARIABLES.
// Due to the way that the dotenv plugin incorporates environment variables
// into the scripts bundle, sensitive attributes should be sanitized.
const clientEnvironmentVariables = {
    DEVELOPMENT_SERVER_URL: dotenv.parsed.DEVELOPMENT_SERVER_URL,
    NODE_ENV: dotenv.parsed.NODE_ENV,
    PRODUCTION_SERVER_URL: dotenv.parsed.PRODUCTION_SERVER_URL
};

let webpackConfiguration = {
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
            },
            {
                test: /\.scss/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js", ".jsx"]
    },
    output: {
        path: Path.join(__dirname, "Client", "build"),
        publicPath: "/",
        filename: "bundle.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(clientEnvironmentVariables)
        }),
        new HTMLWebpackPlugin({
            template: Path.join(__dirname, "Client", "public", "index.html")
        })
    ],
    devServer: {
        static: {
            directory: Path.join(__dirname, "Client", "public")
        },
        historyApiFallback: true,
        port: 3000,
        proxy: {
            "/api": `http://localhost:${Configuration.getServerPort()}`
        }
    }
};

const applicationIsInDevelopment = !Configuration.isSetToProduction();
if (applicationIsInDevelopment) {
    webpackConfiguration.devtool = "inline-source-map";
}

module.exports = webpackConfiguration;
