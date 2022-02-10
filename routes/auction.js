const express = require('express')
const router = express.Router()

// Auction Schema
const Auction = require('../models/Auction')

// GET Auctions (all)
router.get('/', async(req, res)=>{
    try{
        const auctions = await Auction.find().limit(10)
        res.send(auctions)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// GET One Auction (by iD)


module.exports=router