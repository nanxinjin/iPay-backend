import sendSMS from '../utils/sendSMS'
import errorFactory from '../utils/errorFactory'
import VerificationCode from './models/VerificationCode'
import User from './models/User'

export default function sendFirstSMSCode (req, res) {
  const phone = req.body.phone
  const country = req.body.country

  const { code, message } = generateVerification(country)
  const phoneNumber = `+${country}${phone}`
  const verificationRecord = { code, phoneNumber, createAt: new Date() }

  User.findOne({ phoneNumber })
    .then((user) => {
      if (user) {
        throw errorFactory(403, 'Phone number already in use')
      }
      return VerificationCode.update({ phoneNumber }, verificationRecord, { upsert: true, setDefaultsOnInsert: true })
    })
    .then(() => {
      return sendSMS(phone, country, message)
    })
    .then((succeeded) => {
      res.status(200).end()
    })
    .catch((err) => {
      if (err.code) {
        res.status(err.code).json({ message: err.message })
        return
      }
      res.status(500).json({ message: err.message })
    })
}

function generateVerification (country) {
  let code = Math.floor(Math.random() * 999999)
  let codeString = leftpad(code.toString(), 6)

  let message = `亲爱的用户，您的验证码为${codeString}，验证码将于10分钟后过期，请尽快使用。`

  return { code: codeString, message }
}

function leftpad(str, length) {
  if (str.length >= length) {
    return str
  }
  let pad = '', num = length - str.length
  for (let i = 0; i < num; i++) {
    pad += '0'
  }
  return pad + str
}
