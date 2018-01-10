/**
 * 根据接口数据生成 js 代码，生成目录包含 api 和 service 两个文件。
 * 代码生成的基础模板位于 tmpl 目录下。
 */
const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const config = require('./config')

let apiFile = null
let serviceFile = null
let serviceTestFile = null

// 创建输出目录
const prepareDir = () => {
    const confs = config.all()
    apiFile = confs.apiPath
    serviceFile = confs.servicePath
    serviceTestFile = confs.utPath

    mkdirp(path.dirname(apiFile))
    mkdirp(path.dirname(serviceFile))
    mkdirp(path.dirname(serviceTestFile))
}

// 模板预编译
const API_TMPL = path.resolve(__dirname, 'tmpl', 'api.js.tmpl')
const SERVICE_TMPL = path.resolve(__dirname, 'tmpl', 'service.js.tmpl')
const TEST_TMPL = path.resolve(__dirname, 'tmpl', 'service.ut.js.tmpl')
// const apiTmpl = Handlebars.compile(fs.readFileSync(API_TMPL, 'utf-8'))
// const serviceTmpl = Handlebars.compile(fs.readFileSync(SERVICE_TMPL, 'utf-8'))
// const testTmpl = Handlebars.compile(fs.readFileSync(TEST_TMPL, 'utf-8'))

// 生成源码
const genSourceCode = (data, template, targetFile) => {
    const fileContent = template(data)

    try {
        fs.writeFileSync(targetFile, fileContent, 'utf-8')
        console.info(`[${targetFile}] generated !`)
    } catch (e) {
        console.error(`generate [${targetFile}] failed !`, e.message)
    }
}

// 生成 api 文件
const genApiCode = (data) => {
    // @plugin api-template api 文件模板
    const template = Handlebars.compile(config.applyPluginsWaterfall('api-template', fs.readFileSync(API_TMPL, 'utf-8'), data))
    genSourceCode(data, template, apiFile)
}

// 生成 service 文件
const genServiceCode = (data) => {
    if (!data) {
        console.error('generate code failed !')
        return
    }

    // @plugin api-template 服务文件模板

    let template = Handlebars.compile(config.applyPluginsWaterfall('service-template', fs.readFileSync(SERVICE_TMPL, 'utf-8'), data))
    genSourceCode(data, template, serviceFile) // service source

    // @plugin api-template 测试文件模板
    template = Handlebars.compile(config.applyPluginsWaterfall('test-template', fs.readFileSync(TEST_TMPL, 'utf-8'), data))
    genSourceCode(data, template, serviceTestFile) // test code
}

module.exports = {
    generate (data) {
        prepareDir()
        genApiCode(data)
        genServiceCode(data)
    }
}
