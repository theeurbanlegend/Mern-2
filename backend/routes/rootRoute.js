const path=require('path')
const router =require('express').Router()
const homepage=(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','index.html'))
}

module.exports=router.get('/',homepage)