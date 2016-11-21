import mongoose from '../../rootModel'
const Schema = mongoose.Schema

const verificationCodeSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    required: true
  }
})

verificationCodeSchema.index({ phoneNumber: true }, { unique: true })

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema)

export default VerificationCode
