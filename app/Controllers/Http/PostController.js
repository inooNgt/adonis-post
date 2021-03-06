'use strict'

const Post = use('App/Models/Post')
const Database = use('Database')
const moment = require('moment')

class PostController {
  async index({ request, response }) {
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
   * 发布文章
   *
   */
  async post({ request, response, auth }) {
    const post = new Post()
    const _body = request.all()

    const user = await auth.getUser()

    if (_body.post_title && _body.post_body) {
      post.post_title = _body.post_title
      post.post_body = _body.post_body
      post.post_body_md = _body.post_body_md
      post.user_id = user.id
      try {
        await post.save()
        response.status(200).send(post)
      } catch (e) {
        console.log(e)
        response.status(400).send(e)
      }
    } else {
      response.status(406).send(new Error('参数错误'))
    }
  }

  /**
   * 修改文章
   *
   */
  async update({ request, response, auth }) {
    const _body = request.all()
    const postId = _body.id
    const user = await auth.getUser()
    const post = await Post.findBy('id', postId)

    if (_body.post_title && _body.post_body) {
      post.post_title = _body.post_title
      post.post_body = _body.post_body
      post.post_body_md = _body.post_body_md
      post.user_id = user.id
      try {
        await post.save()
        response.status(200).send(post)
      } catch (e) {
        console.log(e)
        response.status(400).send(e)
      }
    } else {
      response.status(406).send(new Error('参数错误'))
    }
  }

  /**
   * 删除文章
   *
   */
  async delete({ request, response, auth }) {
    const _body = request.all()
    const postId = _body.id
    const post = await Post.findBy('id', postId)

    if (postId !== undefined) {
      try {
        await post.delete()
        response.status(200).send({ message: 'delete succeed' })
      } catch (e) {
        console.log(e)
        response.status(400).send(e)
      }
    } else {
      response.status(406).send(new Error('参数错误'))
    }
  }

  /**
   * 获取文章详情
   *
   */
  async detail({ request, response }) {
    const _body = request.all()
    const id = _body.id
    let post
    if (!id) {
      response.status(400).send({ massage: 'post id can not be empty!' })
    }

    try {
      post = await Post.findBy('id', id)
      if (post) {
        response.status(200).send(post)
      } else {
        response.status(404).send({ message: 'not found' })
      }
    } catch (e) {
      response.status(400).send(e)
    }
  }
}

module.exports = PostController
