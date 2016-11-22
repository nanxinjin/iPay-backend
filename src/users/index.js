import express from 'express'
const router = express.Router()

router.post('/sendVerifySMS', require('./sendVerifySMS').default)
router.post('/phoneSignup', require('./phoneSignUp').default)
router.post('/phoneSignin', require('./phoneSignin').default)
router.post('/wechatSignup', require('./wechatSignup').default)
router.post('/wechatSignin', require('./wechatSignin').default)

export default router
