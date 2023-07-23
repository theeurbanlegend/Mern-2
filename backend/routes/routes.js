const express=require('express')
const { updateUser, deleteUser, addUser, getUsers } = require('../controllers/userRoutes')
const { getNotes, addNote, updateNote, deleteNote } = require('../controllers/noteRoutes')
const router=express.Router()
const verifyToken=require('../middleware/verifyJWT')

router.use(verifyToken)

router.route('/users')
.get(getUsers)
.post(addUser)
.patch(updateUser)
.delete(deleteUser)

router.route('/notes')
.get(getNotes)
.post(addNote)
.patch(updateNote)
.delete(deleteNote)

module.exports=router