 const HtmlWebPackPlugin = require("html-webpack-plugin");


module.exports = {
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {minimize: true}
                }
                ]
            },
            {
                test: /\.glb$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        minimize: false,
                        name: 'assets/[hash]-[name].[ext]'
                    }
                }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        minimize: false,
                        name: 'assets/[hash]-[name].[ext]'
                    }
                }
                ],
            }
        ],
    },
    plugins: [
         new HtmlWebPackPlugin({
             template: "./src/index.html",
             filename: "./index.html"
         })
    ]
}