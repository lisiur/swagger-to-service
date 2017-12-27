const Tapable = require('tapable')

const CONF_DEFAULT = {
    url: '',
    apiPath: './dist/api.js',
    servicePath: './dist/service.js',
    utPath: './dist/service.ut.js'
}

/**
 * 全局配置，由 Tapable 提供扩展机制
 */
class Config extends Tapable {
    init (options) {
        this._conf = Object.assign({}, CONF_DEFAULT, options)

        if (options.plugins) {
            this.apply(...options.plugins)
        }

        // @plugin init 提供修改 config 的扩展
        this.applyPlugins('init', this._conf)
        Object.freeze(this._conf) // 配置对象初始化一次之后禁止修改
    }

    all () {
        return this._conf
    }
}

module.exports = new Config()
