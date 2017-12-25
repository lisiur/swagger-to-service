/**
 * @deprecated 由于 swagger 已提供解析远程 api 的功能，目前此文件不需要
 * @description 获取服务器的静态文本文件内容
 */
const request = require('request')

const fetch = url => {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        return reject({err, response})
      }

      resolve(body)
    })
  })
}

module.exports = {fetch}