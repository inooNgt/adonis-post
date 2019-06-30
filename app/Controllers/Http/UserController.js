'use strict'

const Env = use('Env')
const User = use('App/Models/User')
const moment = require('moment')
const Database = use('Database')

const { putFileToQN } = require('../../Utils')

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
      response.status(400).send(e)
    }
  }

  /**
   * 获取我发布的文章
   *
   */
  async getMyPosts({ request, response, auth }) {
    let user = await auth.getUser()
    const _body = request.all()
    let page = _body.page || 1
    let perPage = _body.perPage || 1

    try {
      const posts = await Database.select(
        'posts.id',
        'posts.post_title',
        'posts.user_id',
        'posts.created_at',
        'users.username as author'
      )
        .from('posts')
        .where('user_id', user.id)
        .leftOuterJoin('users', 'posts.user_id', 'users.id')
        .orderBy('created_at', 'desc')
        .paginate(page, perPage || 20)

      posts.data.forEach(item => {
        item['created_at'] = moment(item['created_at']).format(
          'MMMM Do YYYY hh:mm'
        )
      })

      response.status(200).send(posts)
    } catch (e) {
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
    console.log('login', username, password)
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
    const fileInfo = request.file('file', {
      types: ['image'],
      size: '4mb'
    })
    const fileName = `${new Date().getTime()}.${fileInfo.extname}`

    try {
      let result = await putFileToQN(fileName, fileInfo.tmpPath)
      response.ok({ ...result, url: `${Env.get('QN_DOMAIN')}${result.key}` })
    } catch (e) {
      console.log(e)
      response.send(fileInfo)
    }
  }
}

module.exports = UserController
