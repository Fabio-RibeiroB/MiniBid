const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const Auction = require('../models/Auction')
const verifyToken = require('../verifyToken')
const date = require('date-and-time')

// GET Auctions (all)
router.get('/', verifyToken, async(req, res)=>{
    

    try{
        
        const now = new Date()

        // Change and update status of auction if they are Completed
        const updatedStatus = await Auction.updateMany(
            {stop_time:{$lte: now}},

        
            [
            {$set:{status:'Completed', winner:"$current_bidder"}},
            {$unset:"current_bidder"}
            ]
        )
        
        //hours_left:0}})
        // Change hours_left
        //const updatedTime = await Auction.find({status:'Open for offers'},{$set:{current_bidder:updatedTime.winner}})//date.subtract("stop_time", now).toHours()}})
        //const updatedTime =  await Auction.updateMany({status:'Open for offers'}, [{$set:{hours_left:date.subtract("$stop_time", now).toHours()}}])

        // Announce the Winner!
        //const updatedWinner = await Auction.updateMany({status:'Completed'},[{$set:{winner:['$current_bidder']}}])
        

        const auctions = await Auction.find().select({'history':0}).limit(10) // don't display the bidding history
        res.send(auctions)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// GET One Auction's history (by iD)
router.get('/history/:postId', verifyToken, async (req, res)=>{
    try{
                
       //const now = new Date()

        // // Change and update status of auction if they are Completed
        // const updatedPosts = await Auction.updateMany({stop_time:{$lte: now}},
            
        //     [
        //         {$set:{status:'Completed', winner:"$current_bidder"}},
        //         {$unset:"current_bidder"}
        //         ]
        //     )


        const getPostById = await Auction.findById(req.params.postId).select({'history':1})
        res.send(getPostById)
    }catch(err){
        res.send('Something went wrong.')
    }
})

// GET One Auction (by iD)
router.get('/:postId', verifyToken, async (req, res)=>{
    try{
                
        const now = new Date()

        // Change and update status of auction if they are Completed
        const updatedPosts = await Auction.updateMany({stop_time:{$lte: now}},
            
            [
                {$set:{status:'Completed', winner:"$current_bidder"}},
                {$unset:"current_bidder"}
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
    const now = new Date()
    const auctionData = new Auction({
            item:req.body.item,
            bidding_price:req.body.bidding_price,
            hours_left:req.body.hours_left,
            owner:req.body.owner,
            stop_time:date.addHours(now, req.body.hours_left),
            history:[]
            //history:[[req.body.bidding_price, 'Auction Started', now]]
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

    try{
        const getPostById = await Auction.findById(req.params.postId)
        if(getPostById.status == 'Open for offers' && now < getPostById.stop_time && req.body.bidding_price >= getPostById.bidding_price){ // can only bid if Open for offers and before the end of auction
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
        }else{res.status(423).send('You cannot bid for this item (time expired or not high enough bid)')}
    }catch(err){
        res.status(400).send('Something went wrong.')
    }
})

// Update status to closed when time expired
// setInterval(function () {
//     const now = new Date()

//     // no await?
//     Auction.findOne({stop_time: {$gte:now} }, function (err, docs) {
//         if (err){
//             res.send({message:err})
//         }
//         else{
//             const time_to_go = date.subtract(docs.stop_time, now).toHours()
//             const updatedTime =  Auction.updateOne({_id:docs._id}, {$set:{hours_left:time_to_go}})
//             console.log(time_to_go)
//         }
//     })
//         // const now = new Date()
//         // try{
//         //     console.log('Testing')
//         //     const elapsed = Auction.find({stop_time:{$gte: now}})
            
//         //     //date.subtract("stop_time", now).toHours()}})
//         //     console.log(elapsed)//find the elapsed auction
//         // }catch{
//         //     console.log('Everything fine')
//         // } 
// }, 5000)
module.exports=router