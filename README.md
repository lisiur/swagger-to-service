# swagger-to-service

Convert API definitions to source code files of api/service/ut.

install:
```shell
yarn add swagger-to-service
```

usage:
```javascript
sts({
    url: 'http://yaml/server/test.yaml', // yaml uri
    apiPath: './out/api.js', // dist dir of api file
    servicePath: './out/service.js', // dist dir of service file
    utPath: './out/service.ut.js' // dist dir of service ut file
})
```
