const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const config = {
    target: "electron-renderer",
    devtool: "source-map",
    entry: "./src/app/renderer.js",
    output: {
        filename: "renderer.js",
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
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },

            {
                test: /\.css$/,
                include: path.join(__dirname, 'src/app/components'),
                use: [
                    'style-loader', 'css-loader'
                ]
            }
        ]
    },

    resolve: {
        extensions: [".js"]
    },
    plugins: [htmlPlugin]
};

module.exports = (env, argv) => {
    return config;
};