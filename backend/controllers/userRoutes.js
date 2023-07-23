const bcrypt=require('bcrypt')
const Note=require('../models/noteSchema')
const User=require('../models/userSchema')
const asyncHandler=require('express-async-handler')
const mongoose=require('mongoose')

const getUsers=asyncHandler(async(req,res)=>{
    const users=await User.find({}).select('-password').lean()
    if (!users){
        return res.status(400).json({
            status: "An error occured while fetching users"
        })
    }
    if (users.length===0){
        return res.status(404).json({
            status: "No users to display"
        })
    }
    res.status(200).json(users)
})
const addUser=asyncHandler(async(req,res)=>{
    const {username,password,roles}=req.body
    if(!username||!password||!Array.isArray(roles)||roles.length===0){
        return res.status(400).json({
            status:"Please ensure all fields are entered"
        })
    }
    // check for duplicates
    const dupUser=await User.findOne({username:username}).lean()
    if (dupUser){
        return res.status(409).json({
            status:"That username has already been taken"
        })
    }
    // if all fields are present and no dupuser
    const hashedPassword=await bcrypt.hash(password,10)

    const userObj={username,password:hashedPassword,roles}

    const newUser=await User.create(userObj)
    if(!newUser){
        return res.status(500).json({
            status:"Error while creating the user"
        })
    }
    return res.status(201).json({
        status:"New user created successfully",
        newUser:newUser
    })
})
const updateUser=asyncHandler(async(req,res)=>{
    const {id, username,password,roles,active}=req.body
    
    if(!id||!username||!password||!Array.isArray(roles)||roles.length===0||!typeof active==='Boolean'){
        return res.status(400).json({
            status:"Please ensure all fields are entered"
        })
    }
    // check if username exists
    const checkUser=await User.findById(id).exec()
    if(!checkUser){
        return res.status(404).json({
            status:"User not Found!"
        })
    }
    // check for duplicates
    const dupUser=await User.findOne({username:username}).lean().exec()
    if (dupUser&&dupUser?._id.toString()!==id){
        return res.status(409).json({
            status:"That username has already been taken"
        })
    }
    
    checkUser.username=username
    checkUser.roles=roles
    checkUser.active=active


    // if all fields are present and no dupuser
    if(password){
    checkUser.password=await bcrypt.hash(password,10)
    }
    const updatedUser=await checkUser.save()
    res.status(200).json({
        status:`User ${updatedUser.username} has succesfully updated details`,
        content:updatedUser
    })
    
})
const deleteUser=asyncHandler(async(req,res)=>{
    const {id}=req.body
    if(!id){
        return res.status(400).json({
            status:"User ID Required!!"
        })
    }
    const notes=await Note.findOne({user:id}).lean().exec()
    if(notes?.length){
        return res.status(400).json({
            status:"User has assigned notes"
        })
    }

    const user=await User.findById(id).exec()

    if(!user){
        return res.status(404).json({
            status:"User Not Found"
        })
    }
    const deletedUser=await user.deleteOne()
    res.status(200).json({
        status:`User ${deletedUser.username} has been erased from the database`
    })
})  
module.exports={addUser,getUsers,updateUser,deleteUser}