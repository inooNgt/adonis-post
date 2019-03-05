'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Note extends Model {
  /**
   * user is the author of the note
   *
   */

  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Note
