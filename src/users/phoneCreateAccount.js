import jwt from 'jsonwebtoken'
import errorFactory from '../utils/errorFactory'
import bcrypt from '../utils/bcrypt'
import getBioFromFBAccessToken from '../utils/getBioFromFBAccessToken'
import VerificationCode from './models/VerificationCode'
import User from './models/User'
import credentials from '../../credentials.json'

export default function iosCreateAccount (req, res) {
  const { phone, country, code, name, gender, password } = req.body
  let { birthday } = req.body

  if (!phone || !country || !code || !name || !birthday || !gender) {
    res.status(400).json({ message: 'Insufficient parameters' })
    return
  }

  birthday = new Date(birthday)
  if (isNaN(birthday)) {
    res.status(400).json({ message: 'Invalid Date' })
    return
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password is too short'})
    return
  }

  const phoneNumber = `+${country}${phone}`

  User.findOne({ phoneNumber })
    .then((user) => {
      if (user) {
        throw errorFactory(403, 'Phone number already in use')
      }
      return VerificationCode.findOne({ phoneNumber })
    })
    .then(({ code, createAt }) => {
      if (code !== code) {
        throw errorFactory(403, 'Invalid code')
      }

      const now = new Date().getTime()
      // Code expires after 11 minutes
      if (now - createAt > 660000) {
        throw errorFactory(403, 'Code has expired')
      }

      console.log('code')

      return bcrypt.hash(password)
    })
    .then((password) => {
      const userObject = {
        phoneNumber,
        password,
        name,
        birthday,
        gender
      }
      const user = new User(userObject)

      return user.save().then(() => {
        delete userObject.phoneNumber
        delete userObject.password
        return userObject
      })
    })
    .then((userObject) => {
      // TODO: use promise
      jwt.sign({ phoneNumber }, credentials.jwtKey, { expiresIn: '15d' }, (err, token) => {
        if (err) {
          throw err
        }
        userObject.jwt_token = token
        res.status(200).json(userObject)
      })
    })
    .catch((err) => {
      if (err.code) {
        res.status(err.code).json({ message: err.message })
        return
      }
      res.status(500).json({ message: err.message })
    })
}
