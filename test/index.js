const sts = require('../index')
const DemoPlugin = require('./DemoPlugin')

sts({
    url: 'http://172.16.9.105:9000/platform/wec-smmp/yaml/wec-smmp-app.yaml',
    apiPath: './out/api.js',
    servicePath: './out/service.js',
    utPath: './out/service.ut.js',
    plugins: [DemoPlugin]
})
