const Note=require('../models/noteSchema')
const User=require('../models/userSchema')
const asyncHandler=require('express-async-handler')
const mongoose=require('mongoose')

const getNotes=asyncHandler(async(req,res)=>{
    const notes=await Note.find({}).lean()
    if (!notes){
        return res.status(400).json({
            message: "An error occured while fetching notes"
        })
    }
    if (notes.length===0){
        return res.status(404).json({
            message: "No notes to display"
        })
    }
    res.status(200).json(notes)
})
const addNote=asyncHandler(async(req,res)=>{
    const {user,title,text}=req.body
    console.log(req.body)
    if(!user||!title||!text){
        return res.status(400).json({
            message:"Please ensure all fields are filled"
        })
    }
    if (!mongoose.isValidObjectId(user)) {
        return res.status(400).json({ message: "Invalid user id" });
      }
    const checkUser=await User.findById(user).lean().exec()
    console.log(checkUser)

    if(!checkUser){
        return res.status(404).json({
            message:"The user being assigned the note does not exist"
        })
    }
    
    const newNote=await Note.create({user,title,text})
    if(newNote){
        res.status(201).json({
            message:"New Note created successfully",
            reply:`Note assigned to ${checkUser.username}`,
            newNote:newNote
        })
        
    }else{
        return res.status(500).json({
            message:"Error while creating the Note"
        })
    }
    

})
const updateNote=asyncHandler(async(req,res)=>{
    const { id, user, title, text, completed } = req.body

        // Confirm data
        if (!id || !user || !title || !text || typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'All fields are required' })
        }
    
        // Confirm note exists to update
        const note = await Note.findById(id).exec()
    
        if (!note) {
            return res.status(400).json({ message: 'Note not found' })
        }
    
        // Check for duplicate title
        const duplicate = await Note.findOne({ title }).lean().exec()
    
        // Allow renaming of the original note 
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: 'Duplicate note title' })
        }
    
        note.user = user
        note.title = title
        note.text = text
        note.completed = completed
    
        const updatedNote = await note.save()
    
        res.json(`'${updatedNote.title}' updated`)
    })


const deleteNote=asyncHandler(async(req,res)=>{
    const { id } = req.body

        // Confirm data
        if (!id) {
            return res.status(400).json({ message: 'Note ID required' })
        }
    
        // Confirm note exists to delete 
        const note = await Note.findById(id).exec()
    
        if (!note) {
            return res.status(400).json({ message: 'Note not found' })
        }
    
        const result = await note.deleteOne()
    
        const reply = `Note '${result.title}' with ID ${result._id} deleted`
    
        res.json(reply)
    })
module.exports={
    getNotes,addNote,updateNote,deleteNote
}








// const Note = require('../models/Note')
// const User = require('../models/User')
// const asyncHandler = require('express-async-handler')

// // @desc Get all notes 
// // @route GET /notes
// // @access Private
// const getAllNotes = asyncHandler(async (req, res) => {
//     // Get all notes from MongoDB
//     const notes = await Note.find().lean()

//     // If no notes 
//     if (!notes?.length) {
//         return res.status(400).json({ message: 'No notes found' })
//     }

//     // Add username to each note before sending the response 
//     // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
//     // You could also do this with a for...of loop
//     const notesWithUser = await Promise.all(notes.map(async (note) => {
//         const user = await User.findById(note.user).lean().exec()
//         return { ...note, username: user.username }
//     }))

//     res.json(notesWithUser)
// })

// // @desc Create new note
// // @route POST /notes
// // @access Private
// const createNewNote = asyncHandler(async (req, res) => {
//     const { user, title, text } = req.body

//     // Confirm data
//     if (!user || !title || !text) {
//         return res.status(400).json({ message: 'All fields are required' })
//     }

//     // Check for duplicate title
//     const duplicate = await Note.findOne({ title }).lean().exec()

//     if (duplicate) {
//         return res.status(409).json({ message: 'Duplicate note title' })
//     }

//     // Create and store the new user 
//     const note = await Note.create({ user, title, text })

//     if (note) { // Created 
//         return res.status(201).json({ message: 'New note created' })
//     } else {
//         return res.status(400).json({ message: 'Invalid note data received' })
//     }

// })

// // @desc Update a note
// // @route PATCH /notes
// // @access Private
// const updateNote = asyncHandler(async (req, res) => {
//     const { id, user, title, text, completed } = req.body

//     // Confirm data
//     if (!id || !user || !title || !text || typeof completed !== 'boolean') {
//         return res.status(400).json({ message: 'All fields are required' })
//     }

//     // Confirm note exists to update
//     const note = await Note.findById(id).exec()

//     if (!note) {
//         return res.status(400).json({ message: 'Note not found' })
//     }

//     // Check for duplicate title
//     const duplicate = await Note.findOne({ title }).lean().exec()

//     // Allow renaming of the original note 
//     if (duplicate && duplicate?._id.toString() !== id) {
//         return res.status(409).json({ message: 'Duplicate note title' })
//     }

//     note.user = user
//     note.title = title
//     note.text = text
//     note.completed = completed

//     const updatedNote = await note.save()

//     res.json(`'${updatedNote.title}' updated`)
// })

// // @desc Delete a note
// // @route DELETE /notes
// // @access Private
// const deleteNote = asyncHandler(async (req, res) => {
//     const { id } = req.body

//     // Confirm data
//     if (!id) {
//         return res.status(400).json({ message: 'Note ID required' })
//     }

//     // Confirm note exists to delete 
//     const note = await Note.findById(id).exec()

//     if (!note) {
//         return res.status(400).json({ message: 'Note not found' })
//     }

//     const result = await note.deleteOne()

//     const reply = `Note '${result.title}' with ID ${result._id} deleted`

//     res.json(reply)
// })

// module.exports = {
//     getAllNotes,
//     createNewNote,
//     updateNote,
//     deleteNote
// }