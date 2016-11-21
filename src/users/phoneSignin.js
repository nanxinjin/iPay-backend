import jwt from 'jsonwebtoken'
import errorFactory from '../utils/errorFactory'
import bcrypt from '../utils/bcrypt'
import User from './models/User'
import credentials from '../../credentials.json'

export default function phoneSignin (req, res) {
  const { phone, country, password } = req.body

  if (!phone || !country || !password) {
    res.status(400).json({ message: 'Insufficient parameters '})
    return
  }

  const phoneNumber = `+${country}${phone}`

  User.findOne({ phoneNumber })
    .then((user) => {
      if (!user) {
        throw errorFactory(403, 'User does not exist')
      }

      return bcrypt.compare(password, user.password).then((match) => {
        const userObject = {
          _id: user._id,
          name: user.name,
          birthday: user.birthday,
          gender: user.gender
        }
        return { match, userObject }
      })
    })
    .then(({ match, userObject }) => {
      if (!match) {
        throw errorFactory(403, 'Invalid phone/password')
      }

      // TODO: use promise
      jwt.sign({ _id: userObject._id }, credentials.jwtKey, { expiresIn: '15d' }, (err, token) => {
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
