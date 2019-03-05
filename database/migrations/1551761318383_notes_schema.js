'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotesSchema extends Schema {
  up() {
    this.create('notes', table => {
      table.increments()
      table.string('note_title', 254)
      table.text('note_body')
      table.text('note_body_md')
      table.integer('user_id')
      table.timestamps()
    })
  }

  down() {
    this.drop('notes')
  }
}

module.exports = NotesSchema
