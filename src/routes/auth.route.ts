import express from 'express'
const router = express.Router()

import {
    registerValidation,
    loginValidation,
    updatePasswordValidation,
    OTPValidation,
    getOTPValidation
} from '../validation/auth.validation.ts'

import {
    changePassword,
    getOtp,
    login,
    register,
    verifyOTP
} from '../controllers/auth.controller.ts'

router.post('/login', loginValidation, login)

router.post('/signup', registerValidation, register)

router.post('/change_password', updatePasswordValidation, changePassword)

router.post('/verify_otp', OTPValidation, verifyOTP)

router.post('/get_otp', getOTPValidation, getOtp)


export default router
