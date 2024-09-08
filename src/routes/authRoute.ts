import {userRegister, userLogin, emailConfirmation, forgetPassword, resetPassword} from '../services/authService'
import express from 'express'

const router=express.Router()


router.post('/register',userRegister)
router.post('/emailconfirmation',emailConfirmation)
router.post('/login',userLogin)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword',resetPassword)

export default router