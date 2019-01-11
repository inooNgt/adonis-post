'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostsSchema extends Schema {
  up() {
    this.create('posts', table => {
      table.increments()
      table.string('post_title', 254)
      table.text('post_body')
      table.text('post_body_md')
      table.text('user_id')
      table.string('author', 80)
      table.timestamps()
    })
  }

  down() {
    this.drop('posts')
  }
}

module.exports = PostsSchema
