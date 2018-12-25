'use strict'

const User = use('App/Models/User')

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
   * 用户注册
   *
   */
  async register({ request, response, auth }) {
    const user = new User()
    const _body = request.all()
    let token
    if (_body.username && _body.password) {
      user.username = _body.username
      user.password = _body.password
      user.avatar = _body.avatar
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
}

module.exports = UserController
