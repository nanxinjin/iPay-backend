import express from 'express'
const router = express.Router()

router.post('/sendVerifySMS', require('./sendVerifySMS').default)
router.post('/phoneSignUp', require('./phoneSignUp').default)

export default router
