const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    mode: 'development', // can be production
    entry: './src/app.js',
    output: {
          path: path.resolve(__dirname, 'dist'),
          filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                use: ['file-loader']
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: ['url-loader?limit=100000'] }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
};
