'use strict'

const Note = use('App/Models/Note')
const Database = use('Database')
const moment = require('moment')

class NoteController {
  /**
   * 笔记列表
   *
   */
  async index({ request, response }) {
    const _body = request.all()
    let page = _body.page || 1
    let perPage = _body.perPage || 1
    try {
      const notes = await Database.select(
        'notes.id',
        'notes.note_title',
        'notes.note_date',
        'notes.note_body',
        'notes.user_id',
        'notes.created_at',
        'users.username as author'
      )
        .from('notes')
        .leftOuterJoin('users', 'notes.user_id', 'users.id')
        .orderBy('created_at')
        .paginate(page, perPage || 20)

      let catalog = {}

      notes.data.forEach((item, index) => {
        let noteDate = item['note_date']

        item['created_at'] = moment(item['created_at']).format(
          'MMMM Do YYYY hh:mm'
        )

        if (catalog[noteDate] && catalog[noteDate].length) {
          catalog[noteDate].push(item)
        } else {
          catalog[noteDate] = [item]
        }
      })

      notes.catalog = catalog

      response.status(200).send(notes)
    } catch (e) {
      response.status(400).send(e)
    }
  }

  /**
   * 发布笔记
   *
   */
  async post({ request, response, auth }) {
    const note = new Note()
    const _body = request.all()

    const user = await auth.getUser()

    if (_body.note_title && _body.note_body) {
      note.note_date = moment().format('L')
      note.note_title = _body.note_title
      note.note_body = _body.note_body
      note.note_body_md = _body.note_body_md
      note.user_id = user.id
      try {
        await note.save()
        response.status(200).send({ id: note.id })
      } catch (e) {
        console.log(e)
        response.status(400).send(e)
      }
    } else {
      response.status(406).send(new Error('参数错误'))
    }
  }

  /**
   * 修改笔记
   *
   */
  async update({ request, response, auth }) {
    const _body = request.all()
    const noteId = _body.id
    const user = await auth.getUser()
    const note = await Note.findBy('id', noteId)

    if (_body.note_title && _body.note_body) {
      note.note_title = _body.note_title
      note.note_body = _body.note_body
      note.note_body_md = _body.note_body_md
      note.user_id = user.id
      try {
        await note.save()
        response.status(200).send(note)
      } catch (e) {
        console.log(e)
        response.status(400).send(e)
      }
    } else {
      response.status(406).send(new Error('参数错误'))
    }
  }

  /**
   * 删除笔记
   *
   */
  async delete({ request, response, auth }) {
    const _body = request.all()
    const noteId = _body.id
    const note = await Note.findBy('id', noteId)

    if (noteId !== undefined) {
      try {
        await note.delete()
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
   * 获取笔记详情
   *
   */
  async detail({ request, response }) {
    const _body = request.all()
    const id = _body.id
    let note
    if (!id) {
      response.status(400).send({ massage: 'note id can not be empty!' })
    }

    try {
      note = await Note.findBy('id', id)
      if (note) {
        response.status(200).send(note)
      } else {
        response.status(404).send({ message: 'not found' })
      }
    } catch (e) {
      response.status(400).send(e)
    }
  }
}

module.exports = NoteController
