'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * 从JSON输出中省略password字段
   *
   */
  static get hidden() {
    return ['password']
  }

  /**
   * defaultAvatar
   */
  static get defaultAvatar() {
    return 'http://qn.inoongt.tech/image/default_avatar.png'
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  /**
   * user posts
   * @method posts
   *
   * @return {Object}
   */
  posts() {
    return this.hasMany('App/Models/Post')
  }

  /**
   * user Note
   * @method Note
   *
   * @return {Object}
   */
  note() {
    return this.hasMany('App/Models/Note')
  }
}

module.exports = User
