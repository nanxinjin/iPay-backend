import express from 'express'
const router = express.Router()

router.post('/sendVerifySMS', require('./sendVerifySMS').default)
router.post('/phoneCreateAccount', require('./phoneCreateAccount').default)

export default router
