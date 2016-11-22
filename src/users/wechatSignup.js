import jwt from 'jsonwebtoken'
import errorFactory from '../utils/errorFactory'
import getWechatAccessToken from '../utils/getWechatAccessToken'
import User from './models/User'
import credentials from '../../credentials.json'

export default function wechatSignup (req, res) {
  const { code, name, gender } = req.body
  let { birthday } = req.body

  if (!code || !name || !birthday || !gender) {
    res.status(400).json({ message: 'Insufficient parameters' })
    return
  }

  birthday = new Date(birthday)
  if (isNaN(birthday)) {
    res.status(400).json({ message: 'Invalid Date' })
    return
  }

  let userObject = {}
  getWechatAccessToken(code)
    .then((result) => {
      return User.findOne({ wechatID: result.openid }).then((user) => {
        if (user) {
          throw errorFactory(403, 'WechatID already in use');
        }
        return result
      })
    })
    .then((result) => {
      let userObject = {
        wechatID: result.openid,
        name,
        birthday,
        gender
      }
      const user = new User(userObject)

      return user.save().then((user) => {
        delete userObject.wechatID
        userObject._id = user._id
        userObject.wechatTokens = result
        return userObject
      })
    })
    .then((userObject) => {
      // TODO: use promise
      jwt.sign({ _id: userObject._id }, credentials.jwtKey, { expiresIn: '15d' }, (err, token) => {
        if (err) {
          throw err
        }
        userObject.jwtToken = token
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
