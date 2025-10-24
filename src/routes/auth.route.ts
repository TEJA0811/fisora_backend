import express from 'express'
const router = express.Router()


// TODO:  Login API (OTP and Password)
router.post('/login', (req, res) => {
  res.send('login')
})


// TODO: register API
router.post('/signup', (req, res) => {
  res.send('login')
})


// TODO: rest password API
router.post('/change_password', (req, res) => {
  res.send('change_password')
})


// TODO: Verify otp API
router.post('/verify_otp', (req, res) => {
    res.send('verify_otp')
})


// TODO: Get otp API
router.post('/get_otp', (req, res) => {
    res.send('get_otp')
})


export default router
