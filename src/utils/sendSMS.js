import crypto from 'crypto'
import request from 'request-promise'
import credentials from '../../credentials.json'
import errorFactory from '../utils/errorFactory'

export default function (phone, country, content) {
  const { appKey, appID } = credentials
  const sig = generateSig(appKey, phone)

  const body = {
    tel: {
      nationcode: country,
      phone
    },
    type: '0',
    msg: content,
    sig,
    extend: '',
    ext: ''
  }

  const options = {
    method: 'post',
    body,
    json: true,
    url: 'https://yun.tim.qq.com/v3/tlssmssvr/sendsms',
    qs: {
      sdkappid: appID,
      random: random()
    }
  }

  return request(options).then(({ result, errmsg }) => {
    if (result === '0') {
      return true
    }
    throw errorFactory(500, errmsg)
  })
}

function generateSig (appKey, phone) {
  const md5 = crypto.createHash('md5')
  md5.update(appKey + phone)
  return md5.digest('hex')
}

function random () {
  const code = Math.floor(Math.random() * 999999)
  return code.toString()
}
