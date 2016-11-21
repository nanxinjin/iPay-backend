import mongoose from '../../rootModel'
const Schema = mongoose.Schema

const userSchema = new Schema({
  phoneNumber: String,
  password: String,
  wechatID: String,
  name: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  }
})

userSchema.index({ phoneNumber: true }, { unique: true })

const User = mongoose.model('User', userSchema)

export default User
