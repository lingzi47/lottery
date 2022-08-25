module.exports = {
    publicPath: "./",
    devServer: {
        port: 8080,
        proxy: {
            '/api': {
                target: "https://y1.wjw.cool/api/app",
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}