require('dotenv').config()
const express=require('express')
const path=require('path')
const app=express()
const {logger,logEvents}=require('./middleware/logger')
const errHandler=require('./middleware/errHandler')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const corsOptions = require('./config/corsOptions')
const mongoose = require('mongoose')
const homepage = require('./routes/rootRoute')
const routes=require('./routes/routes')
const authRoutes=require('./routes/authRoutes')


app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


app.use(express.static(path.join(__dirname,'/public')))




app.use('/',homepage)
app.use('/api',routes)
app.use('/auth',authRoutes)

app.all('*',(req,res)=>{
    res.status(404)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({
            status:"404 Not Found!"
        })
    }else{
        res.type('text').send("Oops! The resource you are loooking for is not found")
    }
})
app.use(errHandler)
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connection to database successful!")
    app.listen(process.env.PORT,()=>{
        console.log(`Server is functional and running on port ${process.env.PORT}`)
    })
})
.catch(err=>{
    console.log(err)
    logEvents(`${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErr.log')
})
