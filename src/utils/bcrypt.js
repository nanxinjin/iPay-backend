import bcrypt from 'bcrypt'
import Promise from 'bluebird'

const saltRound = 12

const bc = {
  hash: function (password) {
    const hash = Promise.promisify(bcrypt.hash)
    return hash(password, saltRound)
  },
  compare: function (password, hash) {
    const compare = Promise.promisify(bcrypt.compare)
    return compare(password, hash)
  }
}

export default bc
