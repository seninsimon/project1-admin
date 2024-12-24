import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";



// Fetch categories thunk
export const fetchCategoryThunk = createAsyncThunk(
    "category/fetchCategoryThunk",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/fetchcategory");

            console.log("Response from the server:", response);

            return response.data.categoryDetails; // This should return the list of categories
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error fetching categories");
        }
    }
);

// Add category thunk
export const categoryAddThunk = createAsyncThunk(
    "category/categoryAddThunk",
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/addcategory", { categoryData });

            console.log("Response from the server:", response);

            return response.data.categoryAdded;
            
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error adding category");
        }
    }
);

// Add category thunk
export const categoryEditThunk = createAsyncThunk(
    "category/categoryEditThunk",
    async (data, { rejectWithValue }) => {
        try {


            const response = await axiosClient.put("/categoryedit", data);

            console.log("Response from the server:", response);

            return response.data.newName.categoryName


        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error in editing category");
        }
    }
);

export const categoryDeleteThunk = createAsyncThunk(
    "category/categoryDeleteThunk",
    async (id, { rejectWithValue }) => {
        try {


            const response = await axiosClient.post("/disablecategory", { id });

            console.log("Response from the server:", response);



        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error in disbling category");
        }
    }
);

const initialState = {
    category: [],
    loading: false,
    error: null,
 
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryThunk.fulfilled, (state, action) => {
                state.category = action.payload; 
            })
            .addCase(categoryAddThunk.fulfilled, (state, action) => {
                state.category.push(action.payload); 
            })

    },
});

export default categorySlice.reducer;
