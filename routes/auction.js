const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const Auction = require('../models/Auction')
const verifyToken = require('../validations/verifyToken')

const date = require('date-and-time')



// GET Auctions (all)
router.get('/', verifyToken, async(req, res)=>{
    

    try{
        
        let now = Date.now();
        let date_ob = new Date(now);
        let hour = date_ob.getHours();
        let minutes = date_ob.getMinutes();

        // Change and update status of auction if they are Completed
        const updatedStatus = await Auction.updateMany(
            {end:{$lte: now}},

        
            [
            {$set:{status:'Completed', winner:"$current_bidder"}},
            {$unset:"current_bidder"}
            ]
        )
        

        const updateTime = await Auction.updateMany(
            {end:{$gt: now}},
            [
                // Stage 1: Subtract stop time and now
                {$set:
                    {
                        milliseconds_to_go: {$subtract: ["$end", date_ob]}
                    }
                }
            ]
        )


        const auctions = await Auction.find().select({'history':0}).limit(10) // don't display the bidding history
        res.send(auctions)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// GET Auctions SOLD ITEMS
router.get('/sold', verifyToken, async(req, res)=>{
    

    try{
        
        let now = Date.now();
        let date_ob = new Date(now);
        let hour = date_ob.getHours();
        let minutes = date_ob.getMinutes();

        // Change and update status of auction if they are Completed
        const updatedStatus = await Auction.updateMany(
            {end:{$lte: now}},

        
            [
            {$set:{status:'Completed', winner:"$current_bidder"}},
            {$unset:"current_bidder"}
            ]
        )
        

        const updateTime = await Auction.updateMany(
            {end:{$gt: now}},
            [
                // Stage 1: Subtract stop time and now
                {$set:
                    {
                        milliseconds_to_go: {$subtract: ["$end", date_ob]}
                    }
                }
            ]
        )


        const auctions = await Auction.find({status:'Completed'}).select({'history':0, 'current_bidder':0, 'milliseconds_to_go':0}).limit(10) // don't display the bidding history
        res.send(auctions)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// GET One Auction's history (by iD)
router.get('/history/:postId', verifyToken, async (req, res)=>{
    try{
                
        const getPostById = await Auction.findById(req.params.postId).select({'history':1, '_id':0})
        res.send(getPostById)
    }catch(err){
        res.send('Something went wrong.')
    }
})

// GET One Auction (by iD)
router.get('/:postId', verifyToken, async (req, res)=>{
    try{
                
        let now = Date.now();
        let date_ob = new Date(now);
        let hour = date_ob.getHours();
        let minutes = date_ob.getMinutes();

        // Change and update status of auction if they are Completed
        const updatedStatus = await Auction.updateMany(
            {end:{$lte: now}},

        
            [
            {$set:{status:'Completed', winner:"$current_bidder"}},
            {$unset:"current_bidder"}
            ]
        )
        

        const updateTime = await Auction.updateMany(
            {end:{$gt: now}},
            [
                // Stage 1: Subtract stop time and now
                {$set:
                    {
                        milliseconds_to_go: {$subtract: ["$end", date_ob]}
                    }
                }
            ]
        )


        const getPostById = await Auction.findById(req.params.postId)
        res.send(getPostById)
    }catch(err){
        res.send('Something went wrong.')
    }
})

// POST AUCTION
router.post('/', verifyToken, async (req, res)=>{

    const auctionData = new Auction({
            item:req.body.item,
            bidding_price:req.body.bidding_price,
            duration_in_hours:req.body.duration_in_hours,
            owner:req.body.owner,
            end:Date.now() + req.body.duration_in_hours*60*60*1000,
            milliseconds_to_go:req.body.duration_in_hours*60*60*1000,
            history:[]
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
    const now = new Date()
    // Owners cannot bid for their own items.
    // can only bid if Open for offers and before the end of auction
    try{
        const getPostById = await Auction.findById(req.params.postId)
        if(getPostById.status == 'Open for offers' && now < getPostById.end && req.body.bidding_price >= getPostById.bidding_price && req.body.current_bidder != getPostById.owner){ 
            try{
                // Update the price and bidder
                const updateAuctionById = await Auction.updateOne(
                    {_id:req.params.postId},

                    [
                        {$set:{
                            bidding_price:req.body.bidding_price, current_bidder:req.body.current_bidder}},
                        
                    ]
                )
            
                // Push the new data onto history log
                const updateAuctionById2 = await Auction.updateOne(
                    {_id:req.params.postId},
                        {$push:{
                            history:[req.body.bidding_price, req.body.current_bidder, now]}}
                )
            
                res.send(updateAuctionById2)
            }catch(err){
                res.status(400).send({message:err})
            }
        }else{res.status(423).send('You cannot bid for this item.')}
    }catch(err){
        res.status(400).send('Something went wrong.')
    }
})
module.exports=router