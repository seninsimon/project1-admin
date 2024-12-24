import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";

import axiosClient from "../api/axiosClient";



export const userManagementThunk = createAsyncThunk("userManagement/userManagementThunk" , async (_, {rejectWithValue})=>
{
    try {
        const response = await axiosClient.get("/usermanagement")

        console.log("response from the server ", response);

        return response.data.users
        
    } catch (error) {
        
        return rejectWithValue("error in user fetching" || error.response.message)
    }

})

export const userBlockThunk = createAsyncThunk("userManagement/userBlockThunk" , async (id, {rejectWithValue})=>
    {
        try {

            const response = await axiosClient.post("/usermanagement" , {id})

            
    
            console.log("response from the server ", response);
            
            
    

            
        } catch (error) {
            
            return rejectWithValue("error in blocking users fetching" || error.response.message)
        }
    
    })
    







const initialState = {
    users : [],
    loading : false,
    error : null
}


const userManagementSlice = createSlice({
    name : "userManagement",
    initialState,
    reducers:{},
    extraReducers : (builder)=>
    {
        builder
        .addCase(userManagementThunk.fulfilled , (state,action)=>
        {
            state.users = action.payload
        })

    }
})



export default userManagementSlice.reducer