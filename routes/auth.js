// Authorise users to access Auctioning API
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jsonwebtoken = require('jsonwebtoken')
const { JsonWebTokenError } = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validations/validation')
const bcryptjs = require('bcryptjs')

// REGISTER
router.post('/register', async(req,res)=>{
    // Validate user input matches requirements
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }
    //
    // Check user exists
    const userExists = await User.findOne({email:req.body.email})
    if (userExists){
        return res.status(400).send({message:'User already exits'})
    }
    // Hash password with bcryptjs
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)
    // Create user
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })
    // Mongo save
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err){res.status(400).send({message:err})}
})

// LOGIN
router.post('/login', async (req, res)=>{
    // Validate user input meets requirements
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }
    // Check user exists in Mongo
    const user = await User.findOne({email:req.body.email})
    if (!user){
        return res.status(400).send({message:'User does not exist'})
    }
    // Check password
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if(!passwordValidation){
        return res.status(400).send({message:'Password is wrong'})
    }
    // Generate an auth-token for user on login
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token})
})
module.exports=router