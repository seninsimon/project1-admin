import { createAsyncThunk , createSlice } from "@reduxjs/toolkit";

import axiosClient from "../api/axiosClient";



export const adminLoginThunk = createAsyncThunk("adminLogin/adminLoginThunk" , async (adminLoginData , {rejectWithValue})=>
{
    try {
        const response = await axiosClient.post("/adminlogin" , adminLoginData)
        
        console.log("response from the server ", response);

        localStorage.setItem("adminToken",response.data.adminToken)
        
    } catch (error) {
        
        return rejectWithValue("error in admin login" || error.response.message)
    }

})

const initialState = {
    admin : null,
    loading : false,
    error : null
}


const adminLogin = createSlice({
    name : "adminLogin",
    initialState,
    reducers:{},
    extraReducers : (builder)=>
    {

    }
})



export default adminLogin.reducer