// Authorise users to access Auctioning API
const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Validation functions
// Hash

const jsonwebtoken = require('jsonwebtoken')
const { registerValidation } = require('../validations/validation')

// Register user
router.post('/register', async(req,res)=>{
    // Validate user input matches requirements
    // const {error} = registerValidation(req.body)
    // if(error){
    //     return res.status(400).send({message:error['details'][0]['message']})
    // }
    // // Check user exists
    // const userExists = await User.findOne({email:req.body.email})
    // if (userExists){
    //     return res.status(400).send({message:'User already exits'})
    // }

    res.send(registerValidation(req.body))
 
})

module.exports=router
