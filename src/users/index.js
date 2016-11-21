import express from 'express'
const router = express.Router()

router.post('/sendVerifySMS', require('./sendVerifySMS').default)
router.post('/phoneSignup', require('./phoneSignUp').default)
router.post('/phoneSignin', require('./phoneSignin').default)

export default router
