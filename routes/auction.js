const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const Auction = require('../models/Auction')
const verifyToken = require('../verifyToken')

// GET Auctions (all)
router.get('/', verifyToken, async(req, res)=>{
    try{
        const auctions = await Auction.find().limit(10)
        res.send(auctions)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// GET One Auction (by iD)
router.get('/:postId', verifyToken, async (req, res)=>{
    try{
        const getPostById = await Auction.findById(req.params.postId)
        res.send(getPostById)
    }catch(err){
        res.send('Item ID is wrong.')
    }
})

// POST AUCTION
router.post('/', verifyToken, async (req, res)=>{
    const auctionData = new Auction({
            item:req.body.item,
            bidding_price:req.body.bidding_price,
            time_left:req.body.time_left,
            owner:req.body.owner
    })

    try{
        const auctionToSave = await auctionData.save()
        res.send(auctionToSave)
    }catch(err){
        //res.send('Oh no')
        res.status(400).send({message:err}['message']['message'])//['path'])//['details'][0]['message']})
    }
})
module.exports=router