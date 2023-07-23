import { createSelector,createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter=createEntityAdapter({})
const initialState=usersAdapter.getInitialState()

 export const usersApiSlice= apiSlice.injectEndpoints({
    endpoints:builder=>({
        getUsers:builder.query({
            query:()=>'./api/users',
            validateStatus:(response,result)=>{
                return response.status===200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse:responseData=>{
                const loadedUsers=responseData.map(user=>{
                    user.id=user._id
                    return user
                })
                return usersAdapter.setAll(initialState,loadedUsers)
            },
            providesTags:(result,error,arg)=>{
                if(result?.ids){
                    return [
                        {type:'User',id:'LIST'},
                        ...result.ids.map(id=>({type: 'User',id}))
                    ]
                }else return [{type:'User', id:'LIST'}]
            }
        })
    })
 })
export const {useGetUsersQuery}=usersApiSlice

// return the query result object

export const selectUsersResult=usersApiSlice.endpoints.getUsers.select()

// creates nemeoized selector
const selectUsersData=createSelector(selectUsersResult,userResult=>userResult.data)//normalized state bject with ids and entities

// getSelectors crates rhese selectors amd we rename them wirh aliases using determiners
export const {
    selectAll : selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
}=usersAdapter.getSelectors(state=>selectUsersData(state) ?? initialState)