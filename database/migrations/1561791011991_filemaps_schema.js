'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FilemapsSchema extends Schema {
  up() {
    this.create('filemaps', table => {
      table.increments()
      table.string('filename', 254)
      table.string('url', 254)
      table.string('type', 128)
      table.string('upload_user', 128)
      table.timestamps()
    })
  }

  down() {
    this.drop('filemaps')
  }
}

module.exports = FilemapsSchema
