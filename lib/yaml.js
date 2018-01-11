/**
 * 读取服务器上的 yaml 文件并生成方便解析的 json 对象
 */
const SwaggerParser = require('swagger-parser')
const path = require('path')
const config = require('./config')

const upperCaseFirst = word => {
    if (!word) {
        return ''
    }

    return word.replace(/^[a-z]/, function(m) {
        return m.toUpperCase()
    })
}

/**
 * 解析参数，通常需要从 $ref 中获取对应的 bean
 */
const convertParams = (params, beans, isBean) => {
    if (!params || params.length === 0) {
        return null
    }

    if (isBean) {
        return Object.keys(params).map(key => {
            const item = params[key]
            // console.log(item.description)

            return {
                name: key,
                type: upperCaseFirst(item.type),
                description: item.description && item.description.replace(/[\r\n]/g, '') || ''
            }
        })
    }

    if (Array.isArray(params)) { // 若为数组
        const first = params[0] // 属性由 schema 定义的情况下需要检查第一个节点
        if (first.schema) { // 若属性定义在 schema 中
            const schema = first.schema
            if (schema.properties) {
                return convertParams(schema.properties, beans, true)
            } else if (schema['$ref']) {
                const beanName = schema['$ref'].split('/').pop()
                if (beans[beanName].properties) {
                    return convertParams(beans[beanName].properties, beans, true)
                } else {
                    return {items: [convertParams(beans[beanName].items.properties, beans, true)]}
                }
            } else if (schema.type === 'array') {
                const beanName = schema.items['$ref'].split('/').pop()
                if (beans[beanName].properties) {
                    return {items: convertParams(beans[beanName].properties, beans, true)}
                } else {
                    return {items: [convertParams(beans[beanName].items.properties, beans, true)]}
                }
            } else {
                console.log('please check other format', schema)
                return []
            }
        } else {
            return params.map(item => convertParams(item, beans))
        }
    } else { // 若为普通对象
        return {
            name: params.name,
            type: upperCaseFirst(params.type),
            description: params.description && params.description.replace(/[\r\n]/g, '') || ''
        }
    }
}

/**
 * 解析接口定义，优化输出格式
 */
const convertPaths = (paths, beans) => {
    const keys = Object.keys(paths)
    const ret = []

    keys.forEach(key => {
        const requests = paths[key]
        Object.keys(requests).forEach(method => {
            const detail = requests[method]
            const name = key.replace(/^\//, '').replace(/\//g, '_').toLowerCase()

            // @plugin before-params 原始参数定义
            config.applyPlugins('before-params', detail.parameters, key)

            let params = convertParams(detail.parameters, beans)

            // @plugin after-params 处理后的参数定义
            params = config.applyPluginsWaterfall('after-params', params, key)

            const paramIsArray = Array.isArray(params)
            const paramIsObj = !paramIsArray

            let newPath = {
                url: key,
                name,
                apiName: detail.operationId || `${method}_${name}`.replace(/_[a-z]/g, m => {
                    return m[1].toUpperCase()
                }),
                description: detail.description && detail.description.replace(/[\r\n]/g, '') || '',
                method,
                params,
                paramIsArray,
                paramIsObj,
                response: detail.responses['200'].schema
            }

            newPath = config.applyPluginsWaterfall('after-api', newPath, key)

            ret.push(newPath)
        })
    })

    return ret
}

/**
 * 远程加载 yaml 文件并处理
 */
const convert = () => {
    const configs = config.all()
    const api = configs.url
    const serviceFileName = path.basename(configs.servicePath)

    return SwaggerParser.parse(api).then(data => {
        // @plugin before-parse 处理 yaml 生成的原始 json 数据
        config.applyPlugins('before-parse', data, config)

        const fileUrl = api
        const fileName = path.basename(api)
        const title = data.info.title
        const description = data.info.description
        const baseUrl = `${data.schemes[0]}://${data.host}${data.basePath}`

        const ret = {
            fileUrl,
            fileName,
            serviceFileName: `@/services/${serviceFileName}`,
            title,
            description,
            baseUrl,
            contextPath: data.basePath,
            apis: convertPaths(data.paths, data.definitions)
        }

        // @plugin after-parse 处理渲染模板用的数据
        config.applyPlugins('after-parse', ret, config)

        return ret
    }).catch(e => {
        console.error(e.message)
        return null
    })
}

module.exports = {
    convert
}
