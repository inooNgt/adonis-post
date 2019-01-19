'use strict'

const Env = use('Env')
const User = use('App/Models/User')
const qiniu = require('qiniu')
const Helpers = use('Helpers')

class UserController {
  /**
   * 获取用户信息
   *
   */
  async index({ request, response, auth }) {
    let user
    try {
      user = await auth.getUser()
      response.ok(user)
    } catch (e) {
      response.status(400).send(e)
    }
  }
  /**
   * 查找用户信息
   *
   */
  async findUserByName({ request, response, auth }) {
    const _body = request.all()
    let user

    if (!_body || !_body.username) {
      response.status(400).send({ massage: 'username can not be empty!' })
      return
    }
    try {
      user = await User.findBy('username', _body.username)
      response.ok(user)
    } catch (e) {
      console.log(e)
      response.status(400).send(e)
    }
  }

  /**
   * 用户修改头像
   *
   */
  async avatar({ request, response, auth }) {
    const _body = request.all()

    if (!_body || !_body.avatar) {
      response.status(400).send({ massage: 'avatar can not be empty!' })
    }

    let authUser = await auth.getUser()
    let user = await User.findBy('id', authUser.id)
    user.avatar = _body.avatar

    try {
      await user.save()
      response.ok(user)
    } catch (e) {
      response.status(400).send(e)
    }
  }

  /**
   * 用户注册
   *
   */
  async register({ request, response, auth }) {
    const user = new User()
    const _body = request.all()
    let token
    const defaultAvatar = User.defaultAvatar
    if (_body.username && _body.password) {
      user.username = _body.username
      user.password = _body.password
      user.avatar = _body.avatar || defaultAvatar
      user.email = _body.email

      try {
        await user.save()
        token = await auth.attempt(_body.username, _body.password)
        response.ok(token)
      } catch (e) {
        response.status(400).send(e)
      }
    } else {
      response.status(406).send(new Error('参数错误'))
    }
  }

  /**
   * 用户登录
   *
   */
  async login({ request, response, auth }) {
    const { username, password } = request.all()
    let token
    try {
      token = await auth.attempt(username, password)
      response.ok(token)
    } catch (e) {
      console.log('error:', e)
      response.status(400).send(e)
    }
  }

  /**
   * 用户登出
   *
   */
  async logout({ request, response, auth }) {
    const apiToken = auth.getAuthHeader()

    try {
      await auth.authenticator('api').revokeTokens([apiToken])
      response.ok({ success: true })
    } catch (e) {
      console.log('error:', e)
      response.status(400).send(e)
    }
  }

  /**
   * 用户上传文件
   *
   */
  async userfile({ request, response, auth }) {
    let token = this.getUpToken()

    const fileInfo = request.file('file', {
      types: ['image'],
      size: '4mb'
    })
    const fileName = `${new Date().getTime()}.${fileInfo.extname}`

    try {
      let result = await this.putFile(token, fileName, fileInfo.tmpPath)
      response.ok({ ...result, url: `${Env.get('QN_DOMAIN')}${result.key}` })
    } catch (e) {
      console.log(e)
      response.send(fileInfo)
    }
  }

  /**
   * 将文件传至第三方服务器
   *
   */
  async putFile(...args) {
    let config0 = new qiniu.conf.Config()
    config0.zone = qiniu.zone.Zone_z0
    let formUploader = new qiniu.form_up.FormUploader(config0)
    let putExtra = new qiniu.form_up.PutExtra()

    return new Promise((resolve, reject) => {
      formUploader.putFile(...args, putExtra, (respErr, respBody, respInfo) => {
        if (respErr) {
          reject(new Error(respErr))
        }
        if (respInfo && respInfo.statusCode == 200) {
          resolve(respBody)
        } else {
          reject(new Error(respInfo))
        }
      })
    })
  }

  /**
   * 获取七牛uptoken
   *
   */
  getUpToken() {
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
}

module.exports = UserController
