import mongoose from 'mongoose'
import configs from '../config.json'

mongoose.connect(configs.mongo)
mongoose.Promise = require('bluebird')

export default mongoose
