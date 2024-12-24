import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import axiosClient from "../api/axiosClient";



export const fetchProductThunk = createAsyncThunk("fetchProductThunk/productManagementThunk", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get("/fetchproduct")

        console.log("response from the server ", response.data.ProductDetails)

        return response.data.ProductDetails





    } catch (error) {

        return rejectWithValue("error in fetching" || error.response.message)
    }

})



export const addProductThunk = createAsyncThunk(
    "addProductThunk/productManagementThunk",
    async ({ productData, images }, { rejectWithValue }) => {
        console.log(productData, images );
        
        try {
            const uploadedImageUrls = [];

            // Upload each image to Cloudinary
            for (const image of images) {
                console.log(image);
                
                const formdata = new FormData();
                formdata.append("file", image);
                formdata.append("upload_preset", "pcaccessories");

                const cloudinaryResponse = await axios.post(
                    "https://api.cloudinary.com/v1_1/dzlubdbjc/image/upload",
                    formdata
                );
                
                
                uploadedImageUrls.push(cloudinaryResponse.data.secure_url);
            }

            // Combine product data with image URLs
            const data = { ...productData, imageUrls: uploadedImageUrls };

            console.log("Final product data with images:", data);


            const response = await axiosClient.post('/addproduct' , data)

            console.log("response from the server : ",response);
            


        } catch (error) {

            return rejectWithValue("error in adding product" || error.response.message)
        }

    })



    export const editProductThunk = createAsyncThunk(
        "editProductThunk/productManagementThunk",
        async ( {fetchedData , images , id}  , { rejectWithValue }) => {
            console.log(fetchedData , images , id);
            
            try {
                const uploadedImageUrls = [];
    
                // Upload each image to Cloudinary
                for (const image of images) {
                    console.log("images........",image);
                    
                    const formdata = new FormData();
                    formdata.append("file", image);
                    formdata.append("upload_preset", "pcaccessories");
    
                    const cloudinaryResponse = await axios.post(
                        "https://api.cloudinary.com/v1_1/dzlubdbjc/image/upload",
                        formdata
                    );
                    
                    
                    uploadedImageUrls.push(cloudinaryResponse.data.secure_url);
                }


                const response = await axiosClient.put(`/editproduct/${id}` , {fetchedData , id, uploadedImageUrls } )

                console.log("response from the server : ",response);
                
    
               
            
            } catch (error) {
    
                return rejectWithValue("error in editing product" || error.response.message)
            }
    
        })




   
      


const initialState = {
    products: [],
    loading: false,
    error: null,
    deleted : false
}


const productManagementSlice = createSlice({
    name: "productManagement",
    initialState,
    reducers: {
        disable : (state,action)=>
        {
             const d = action.payload
             if(d)
             {
                state.deleted = !state.deleted
             }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductThunk.fulfilled, (state, action) => {
                state.products = action.payload
            })
    }
})


 export const {disable} = productManagementSlice.actions 
export default productManagementSlice.reducer