'use strict'

const User = use('App/Models/User')

class UserController {
  async index({ request, response }) {
    const users = await User.all()
    console.log('response users', users)
    response.ok(users)
  }

  /**
   * 用户注册
   *
   */
  async register({ request, response }) {
    const user = new User()
    const _body = request.all()

    if (_body.username && _body.password) {
      user.username = _body.username
      user.password = _body.password

      try {
        await user.save()
        response.ok(user)
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
      console.log('auth token:', token)
      response.ok(token)
    } catch (e) {
      console.log('error:', e)
      response.status(400).send(e)
    }
  }
}

module.exports = UserController
