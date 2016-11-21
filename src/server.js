import path from 'path'
import express from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import compression from 'compression'

const __PROD__ = process.env.NODE_ENV === 'production'
const __TEST__ = process.env.NODE_ENV === 'test'
const port = process.env.PORT || 3000
const server = express()

server.disable('x-powered-by')
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

if (__PROD__ || __TEST__) {
  server.use(morgan('combined'))
  server.use(helmet())
  server.use(compression())
} else {
  server.use(morgan('dev'))
}

server.use('/users', require('./users').default)

console.log(__PROD__)
// Listen
server.listen(port, function onStart (err) {
  if (err) {
    console.log(err)
  }

  console.info('==> 🌎 Listening on port %s.' +
    'Open up http://localhost:%s/ in your browser.', port, port)
})

module.exports = server
