const express = require('express')
const app = express()
const mongoose = require('mongoose')
//const bodyParser = require('body-parser')
require('dotenv/config')

// app.use(bodyParser.json())

// Middleware
// const authRoute = require('./routes/auth') // user authenticatoin
// const auctionRoute = require('./routes/auth) // auctions
// const itemsRoute = require('./routes/items) // items


// Routes
// app.use('/api/user', authRoute)
// app.use('/api/auctions', auctionRoute)
// app.use('/api/items', itemsRoute)
app.get('/', (req,res) =>{
    res.send('Homepage!')
})

// Connect DB
mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected')
})

// Start the server
app.listen(3000, ()=>{
    console.log('Server is running...')
})
