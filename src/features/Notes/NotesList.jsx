import React from 'react'
import { useGetNotesQuery } from '../Notes/notesApiSlice'
import Note from '../Notes/Note'
import useAuth from '../../hooks/useAuth'


const NotesList = () => {
  const {username,isManager,isAdmin}=useAuth()
  const {data:notes,isLoading,isSuccess,isError,error}=useGetNotesQuery(null,{
    pollingInterval:15000,
    refetchOnFocus:true,
    refetchOnMountOrArgChange:true
  }
  )
  
  let content

  if(isLoading)content= <p>Loading...</p>  

  if(isError){content= <p className={isError?"errmsg":"offscreen"}>{error?.data}</p>}  

  if(isSuccess){
     const {ids,entities}=notes
     let filteredIds
     if(isManager||isAdmin){
      filteredIds=[...ids]
     }else{
      filteredIds=ids.filter(noteId=>entities[noteId].username===username)
     }
     const tableContent=ids?.length && filteredIds.map(noteId =><Note
       key={noteId} noteId={noteId}/>)
  

  content=(
    <table className='table table--notes'>
      <thead className='table__thead'>
        <tr>
          <th scope='col' className='table__thnote__status'>Username</th>
          <th scope='col' className='table__thnote__created'>Created</th>
          <th scope='col' className='table__thnote__updated'>Updated</th>
          <th scope='col' className='table__thnote__updated'>Title</th>
          <th scope='col' className='table__thnote__username'>Owner</th>
          <th scope='col' className='table__thnote__edit'>Edit</th>
        </tr>
      </thead>
      <tbody>
        {tableContent}
      </tbody>
    </table>
  
  )}

    return content
}

export default NotesList