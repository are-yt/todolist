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
            }
        }
    },
    productionSourceMap: false
}