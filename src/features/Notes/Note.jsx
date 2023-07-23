import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNoteById } from './notesApiSlice';

const Note = () => {
    const note =useSelector(state=> selectNoteById(state,noteId))
    const navigate=useNavigate()

 if(note){
    const created=new Date(note.createdAt).toLocaleString('en-US',{day:'numeric',month:'long'})
    const updated=new Date(note.updatedAt).toLocaleString('en-US',{day:'numeric',month:'long'})
    const handleEdit=()=>navigate(`/dash/notes/${noteId}`)
    
 }
}

export default Note