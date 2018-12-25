'use strict'

const Post = use('App/Models/Post')

class PostController {
  async index({ request, response }) {
    const posts = await Post.all()
    response.status(200).send({ posts: posts.toJSON() })
  }

  /**
   * 发布文章
   *
   */
  async post({ request, response, auth }) {
    const post = new Post()
    const _body = request.all()

    console.log(request)

    const user = await auth.getUser()

    if (_body.post_title && _body.post_body) {
      post.post_title = _body.post_title
      post.post_body = _body.post_body
      post.user_id = user.id
      try {
        await post.save()
        response.status(200).send(post)
      } catch (e) {
        response.status(400).send(e)
      }
    } else {
      response.status(406).send(new Error('参数错误'))
    }
  }
}

module.exports = PostController
