const mongoose = require('mongoose')
const auctionSchema = mongoose.Schema({
    item:{
        type:String,
        required:true,
        min:3,
        max:256
    },
    bidding_price:{
        type:Number,
        required:true,
        min:0.01,
        max:1000000000
    },
    current_bidder:{
        type:String,
        default:'Be the first to bid!',
        min:2,
        max:256
    },
    status:{
        type:String,
        default:'Open for offers',
        min:4,
        max:16
    },
    owner:{
        type:String,
        required:true,
        min:3,
        max:256
    },

    duration_in_hours:{
        type:Number,
        min:1,
        max:256,
        required:true
    },

    milliseconds_to_go:{
        type:Number,
        min:1
    },

    end:{
        type:Date
    },
    winner:{
        type:String,
        default:'TBD',
        min:2,
        max:256
    },
    history:{
        type: []
    }
})
module.exports=mongoose.model('auction', auctionSchema)