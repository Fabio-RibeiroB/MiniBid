const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const Auction = require('../models/Auction')
const verifyToken = require('../verifyToken')
const date = require('date-and-time')

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
        res.send('Something went wrong.')
    }
})

// POST AUCTION
router.post('/', verifyToken, async (req, res)=>{
    const now = new Date()
    const auctionData = new Auction({
            item:req.body.item,
            bidding_price:req.body.bidding_price,
            time_left:req.body.time_left,
            owner:req.body.owner,
            stop_time:date.addHours(now, req.body.time_left)
    })

    try{
        const auctionToSave = await auctionData.save()
        res.send(auctionToSave)
    }catch(err){
        res.status(400).send({message:err}['message']['message'])
    }
})

// PATCH (Bid)
router.patch('/:postId', verifyToken, async (req,res)=>{
    try{
        const getPostById = await Auction.findById(req.params.postId)
        if(getPostById.status == 'Open for offers'){
            try{
                const updateAuctionById = await Auction.updateOne(
                    {_id:req.params.postId},
                    {$set:{
                        bidding_price:req.body.bidding_price,
                        current_bidder:req.body.current_bidder
                    }
                })
                res.send(updateAuctionById)
            }catch(err){
                res.status(400).send({message:err})
            }
        }else{res.status(423).send('You can no longer bid for this item')}
        
    }catch(err){
        res.status(400).send('Something went wrong.')
    }
})

module.exports=router