const _conf = {
    url: '',
    apiPath: './dist/api.js',
    servicePath: './dist/service.js',
    utPath: './dist/service.ut.js'
}

module.exports = {
    init (config) {
        Object.assign(_conf, config)
        Object.freeze(_conf) // 配置对象初始化一次之后禁止修改
    },
    all () {
        return _conf
    }
}
