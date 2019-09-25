const path = require("path");

const config = {
    target: "electron-main",
    devtool: "source-map",
    entry: "./src/main.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".css", ".json"]
    },
    node: {
        __dirname: false,
        __filename: false
    },
};

module.exports = (env, argv) => {
    return config;
};