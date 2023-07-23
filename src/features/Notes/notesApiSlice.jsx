import { createSelector,createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter=createEntityAdapter({})
const initialState=notesAdapter.getInitialState()

 export const notesApiSlice= apiSlice.injectEndpoints({
    endpoints:builder=>({
        getNotes:builder.query({
            query:()=>'./api/notes',
            validateStatus:(response,result)=>{
                return response.status===200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse:responseData=>{
                const loadedNotes=responseData.map(note=>{
                    note.id=note._id
                    return note
                })
                return notesAdapter.setAll(initialState,loadedNotes)
            },
            providesTags:(result,error,arg)=>{
                if(result?.ids){
                    return [
                        {type:'Note',id:'LIST'},
                        ...result.ids.map(id=>({type: 'Note',id}))
                    ]
                }else return [{type:'Note', id:'LIST'}]
            }
        })
    })
 })
export const {useGetNotesQuery}=notesApiSlice

// return the query result object

export const selectNotesResult=notesApiSlice.endpoints.getNotes.select()

// creates nemeoized selector
const selectNotesData=createSelector(selectNotesResult,noteResult=>noteResult.data)//normalized state bject with ids and entities

// getSelectors crates rhese selectors amd we rename them wirh aliases using determiners
export const {
    selectAll : selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
}=notesAdapter.getSelectors(state=>selectNotesData(state) ?? initialState)