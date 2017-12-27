module.exports = {
    apply (config) {
        config.plugin('init', config => { // 处理初始化参数
            console.log('init', config)
        })

        config.plugin('before-parse', (data, config) => { // yaml 转换的原始 json 数据，直接处理
            console.log('--before-parse')
        })

        config.plugin('after-parse', (data, config) => { // 用于渲染模板的 json 数据，直接处理
            console.log('--after-parse')
        })

        config.plugin('before-params', (params, path) => { // 原始参数定义，直接处理
            console.log('----before-params')
        })

        config.plugin('after-params', (params, path) => { // 处理后的参数定义，使用返回值覆盖
            console.log('----after-params')
            return params
        })

        config.plugin('api-template', (template, data) => { // API 文件模板处理，使用返回值覆盖
            console.log('--api-template')
            return template
        })

        config.plugin('service-template', (template, data) => { // 服务文件模板处理，使用返回值覆盖
            console.log('--service-template')
            return template
        })

        config.plugin('test-template', (template, data) => { // 测试文件模板处理，使用返回值覆盖
            console.log('--test-template')
            return template
        })
    }
}
