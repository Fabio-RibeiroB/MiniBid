const mongoose = require('mongoose')
const auctionSchema = mongoose.Schema({
    item:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    bidding_price:{
        type:String,
        require:true,
        min:5,
        max:16
    },
    current_bidder:{
        type:String,
        require:true,
        default:'Be the first to bid!',
        min:2,
        max:256
    },
    status:{
        type:String,
        require:true,
        default:'Open for offers',
        min:4,
        max:16
    },
    time_left:{
        type:String,
        min:1,
        max:256,
        require:true
    },
    winner:{
        type:String,
        default:'TBD',
        min:2,
        max:256,
    }
})
module.exports=mongoose.model('auction', auctionSchema)