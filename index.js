/**
 * 模块入口文件
 */
const config = require('./lib/config')
const yaml = require('./lib/yaml')
const codegen = require('./lib/codegen')

module.exports = conf => {
    config.init(conf)
    yaml.convert().then(data => {
        codegen.generate(data)
    }).catch(e => {
        console.error(e.message)
    })
}
