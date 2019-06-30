'use strict'

const Filemap = use('App/Models/Filemap')
const Database = use('Database')
const moment = require('moment')
const { putFileToQN } = require('../../Utils')

class FilemapController {
  async files({ request, response }) {
    const _body = request.all()
    let page = _body.page || 1
    let perPage = _body.perPage || 1
    try {
      const filemaps = await Database.select('*')
        .from('filemaps')
        .orderBy('created_at', 'desc')
        .paginate(page, perPage || 20)

      filemaps.data.forEach(item => {
        item['created_at'] = moment(item['created_at']).format(
          'MMMM Do YYYY hh:mm'
        )
      })

      response.status(200).send(filemaps)
    } catch (e) {
      response.status(400).send(e)
    }
  }
  async upload({ request, response, auth }) {
    const fileInfo = request.file('file', {
      types: ['image', 'zip'],
      size: '100mb',
      extnames: ['png', 'gif', 'md', 'txt', 'doc', 'zip', 'rar']
    })

    console.log('fileInfo:')
    console.log(fileInfo)

    if (!fileInfo) {
      throw Error('upload file error')
    }

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

module.exports = FilemapController
