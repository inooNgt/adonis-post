'use strict'

const Env = use('Env')
const Filemap = use('App/Models/Filemap')
const Database = use('Database')
const moment = require('moment')
const { putFileToQN } = require('../../Utils')

class FilemapController {
  async files({ request, response }) {
    const _body = request.all()
    let page = _body.page || 1
    let perPage = _body.perPage || 20
    try {
      const filemaps = await Database.select('*')
        .from('filemaps')
        .orderBy('created_at', 'desc')
        .paginate(page, perPage)

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

  /**
   * 上传文件
   */
  async upload({ request, response, auth }) {
    const fileInfo = request.file('file', {
      types: ['image', 'zip'],
      size: '100mb',
      extnames: ['png', 'gif', 'md', 'txt', 'doc', 'zip', 'rar']
    })

    if (!fileInfo) {
      throw Error('upload file error')
    }

    let filename = `files/${new Date().getTime()}`
    if (fileInfo.clientName) {
      filename += `_${fileInfo.clientName}`
    } else {
      filename += `.${fileInfo.extname}`
    }

    let result = await putFileToQN(filename, fileInfo.tmpPath)
    let url = `${Env.get('QN_DOMAIN')}${result.key}`
    try {
      let res = await this.saveFile({
        url,
        filename,
        type: fileInfo.extname
      })
      // // bug response.ok(res) 在then方法中无效
      //   .then(re => {
      //   console.log('in then')
      //   response.ok(res)
      // })
      response.ok(res)
    } catch (e) {
      response.status(400).send(e)
    }
  }

  /**
   * 保存 url
   * @param {String} url
   */
  saveFile({ url, filename, type }) {
    let filemap = new Filemap()
    filemap.url = url
    filemap.filename = filename
    filemap.type = type
    return filemap.save().then(res => filemap)
  }
}

module.exports = FilemapController
