import { createSelector,createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter=createEntityAdapter({
    sortComparer:(a,b)=>(a.completed ===b.completed)?0:a.completed?1:-1
})
const initialState=notesAdapter.getInitialState()

 export const notesApiSlice= apiSlice.injectEndpoints({
    endpoints:builder=>({
        getNotes:builder.query({
            query:()=>'./api/notes',
            validateStatus:(response,result)=>{
                return (response.status===200||response.status===404) && !result.isError
            },
            
            transformResponse:responseData=>{
                if (Array.isArray(responseData) && responseData.length === 0) {
                    // If the response contains an empty array, set error in the result
                    return { error: { message: "No notes to display" } };}
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
        }),
        addNewNote: builder.mutation({
            query:initialNoteData=>({
                url:'/api/notes',
                method:'POST',
                body:{
                    ...initialNoteData
                }
            }),
            invalidatesTags:[
                {type: 'Note', id:'LIST'}
            ]
        }),
        updateNote: builder.mutation({
            query:initialNoteData=>({
                url:'/api/notes',
                method:'PATCH',
                body:{
                    ...initialNoteData,
                }
            }),
            invalidatesTags:(result,error,arg)=>[
                {type: 'Note', id: arg.id}
            ]
        }),
        deleteNote: builder.mutation({
            query:({id})=>({
                url:'/api/notes',
                method:'DELETE',
                body:{id}
            }),
            invalidatesTags:(result,error,arg)=>[
                {type: 'Note', id: arg.id}
            ]
        })
    })
 })
export const {useGetNotesQuery,useAddNewNoteMutation,useUpdateNoteMutation,useDeleteNoteMutation}=notesApiSlice

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