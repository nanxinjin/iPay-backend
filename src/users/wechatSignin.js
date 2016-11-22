import jwt from 'jsonwebtoken'
import errorFactory from '../utils/errorFactory'
import getWechatAccessToken from '../utils/getWechatAccessToken'
import User from './models/User'
import credentials from '../../credentials.json'

export default function wechatSignin (req, res) {
  const { code } = req.body

  if (!code) {
    res.status(400).json({ message: 'Insufficient parameters '})
    return
  }

  getWechatAccessToken(code)
    .then((result) => {
      User.findOne({ wechatID: result.openid }).then((user) => {
        if (!user) {
          throw errorFactory(403, 'User does not exist')
        }

        let userObject = {
          _id: user._id,
          name: user.name,
          birthday: user.birthday,
          gender: user.gender,
          wechatTokens: result
        }

        jwt.sign({ _id: userObject._id }, credentials.jwtKey, { expiresIn: '15d' }, (err, token) => {
          if (err) {
            throw err
          }
          userObject.jwtToken = token
          res.status(200).json(userObject)
        })
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
