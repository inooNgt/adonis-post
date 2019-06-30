const Env = use('Env')
const qiniu = require('qiniu')

/**
 * 将文件传至第三方服务器
 *
 */
async function putFileToQN(...args) {
  let config0 = new qiniu.conf.Config()
  config0.zone = qiniu.zone.Zone_z0
  let formUploader = new qiniu.form_up.FormUploader(config0)
  let putExtra = new qiniu.form_up.PutExtra()
  let token = getUpToken()

  return new Promise((resolve, reject) => {
    formUploader.putFile(
      token,
      ...args,
      putExtra,
      (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(new Error(respErr))
        }
        if (respInfo && respInfo.statusCode == 200) {
          resolve(respBody)
        } else {
          reject(new Error(respInfo))
        }
      }
    )
  })
}

/**
 * 获取七牛uptoken
 * 详情见 https://developer.qiniu.com/kodo/sdk/1289/nodejs
 */
function getUpToken() {
  const qnconfig = {
    Port: Env.get('PORT'),
    AccessKey: Env.get('QN_ACCESSKEY'),
    SecretKey: Env.get('QN_SECRETKEY'),
    Bucket: Env.get('QN_BUCKET'),
    UptokenUrl: Env.get('QN_UPTOKENURL'),
    Domain: Env.get('QN_DOMAIN')
  }
  let mac = new qiniu.auth.digest.Mac(qnconfig.AccessKey, qnconfig.SecretKey)
  let options = {
    scope: qnconfig.Bucket,
    deleteAfterDays: 1,
    returnBody:
      '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  }
  let putPolicy = new qiniu.rs.PutPolicy(options)
  let token = putPolicy.uploadToken(mac)

  return token
}

module.exports = { putFileToQN }
