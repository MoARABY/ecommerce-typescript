import userModel from "../models/userModel";
import bcrybt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'
import dotenv from 'dotenv'
dotenv.config()

interface IData {
    fullName:string,
    userName:string,
    email:string,
    password:string
} 

const userRegister = asyncHandler(async (req, res)=>{
    const {fullName,userName,email,password}=req.body
    if (!fullName || !userName || !email || !password) {
        res.status(400)
        throw new Error('All fields are required')
    }
    if (password.length<6) {
        res.status(400)
        throw new Error('Password must be at least 6 characters')
    }
    if(!email.includes('@') || !email.includes('.')){
        res.status(400)
        throw new Error('Enter a valid email')
    }
    const user=await userModel.findOne({email})
    if(user){
        res.status(400)
        throw new Error('User already exists')
    }
    const salt=await bcrybt.genSalt(10)
    const hashedPassword=await bcrybt.hash(password,salt)
    const data:IData={
        fullName,
        userName,
        email,
        password:hashedPassword
    }
    const newUser=await userModel.create(data)
    const showUser={
        fullName:newUser.fullName,
        userName:newUser.userName,
        email:newUser.email,
        confirmationCode:newUser.confirmationCode
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: newUser.email,
        subject: 'Email Confirmation',
        text: `Hello ${newUser.fullName},\n\n` +
            `your confirmation code is: ${newUser.confirmationCode}\n\n` +
            `Please confirm your email by clicking the link: \nhttp://${req.headers.host}/api/v1/auth/emailconfirmation\n`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
            newUser ? res.status(201).json({message:'User created successfully',data:showUser}):res.status(400).json({message:'User not created'})
        }
    });
})

const emailConfirmation = asyncHandler(async (req:any, res:any)=>{
    const {email,confirmationCode}=req.body
    if (!confirmationCode || !email) {
        return res.status(400).json({message:'All fields are required'})
    }
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message:'User not found'})
    }
    if(confirmationCode == user.confirmationCode){
        user.emailConfirmed=true
        user.save()
        return res.status(200).json({message:'Email confirmed successfully'})
    } else {
        return res.status(400).json({message:'Invalid code'})
    }
})

const userLogin = asyncHandler(async (req:any, res:any)=>{
    const {email,password}=req.body
    if (!email || !password) {
        return res.status(400).json({message:'All fields are required'})
    }
    if(!email.includes('@') || !email.includes('.')){
        return res.status(400).json({message:'Enter a valid email'})
    }
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message:'User not found'})
    }
    const isMatch = await bcrybt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({message:'Invalid credentials'})
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET as string,{expiresIn:'30d'})
    const showUser={
        fullName:user.fullName,
        userName:user.userName,
        email:user.email
    }
    user ? res.cookie('token',token,{httpOnly:true}).status(200).json({message:'User logged in successfully',data:showUser,token:token}):res.status(400).json({message:'User not logged in'})   
})

const forgetPassword = asyncHandler(async (req:any, res:any)=>{
    const {email}=req.body
    if (!email) {
        return res.status(400).json({message:'Email is required'})
    }
    if(!email.includes('@') || !email.includes('.')){
        return res.status(400).json({message:'Enter a valid email'})
    }
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({message:'User not found'})
    }
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString(); 
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Reset Password',
        text: `Hello ${user.fullName},\n\n` +
            `your reset code is: ${resetCode}\n\n` +
            `Please click the link to reset your password: \nhttp://${req.headers.host}/api/v1/auth/resetpassword\n`
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
            user ? res.status(200).json({message:'Email sent successfully'}):res.status(400).json({message:'Email not sent'})
        }
    });

})

const resetPassword = asyncHandler(async (req:any, res:any)=>{
    const {resetcode,email,password,confirmPassword}=req.body
    if (!resetcode || !email || !password || !confirmPassword) {
        return res.status(400).json({message:'All fields are required'})
    }
    if (password.length<6) {
        return res.status(400).json({message:'Password must be at least 6 characters'})
    }
    if(password !== confirmPassword){
        return res.status(400).json({message:'Passwords do not match'})
    }
    const salt=await bcrybt.genSalt(10)
    const hashedPassword=await bcrybt.hash(password,salt)
    const user=await userModel.findOne({email,resetPasswordCode:resetcode,resetPasswordExpires:{$gt:Date.now()}})
    if(!user){
        return res.status(400).json({message:'User not found'})
    }
    user.password=hashedPassword
    user.resetPasswordCode=''
    user.resetPasswordExpires=0
    await user.save()
    return res.status(200).json({message:'Password reset successfully'})
})

export  {userRegister, userLogin, emailConfirmation, forgetPassword, resetPassword}