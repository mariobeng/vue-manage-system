module.exports = {
    baseUrl: '/',
    devServer: {
        proxy: {
            '': {
                target: 'http://47.52.192.24:8080',
                changeOrigin: true,
                ws: true,
                pathRewrite: {}
            }
        }
    }
}