module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            '/bing': {
                target: 'https://cn.bing.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/bing': ''
                }
            },
            '/shici': {
                target: 'https://v2.jinrishici.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/shici': ''
                }
            }
        }
    },
    productionSourceMap: false
}