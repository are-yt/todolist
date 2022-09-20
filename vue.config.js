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
    productionSourceMap: false,
    chainWebpack: config => {
        config.module
            .rule('worker-loader')
            .test(/\.worker\.js$/)
            .use({
                loader: 'worker-loader',
                options: {
                    inline: true
                }
            })
            .loader('worker-loader')
            .end()
    }
}