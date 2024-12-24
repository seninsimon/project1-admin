import { configureStore } from "@reduxjs/toolkit";
import   adminLoginReducer  from "../features/adminLoginSlice";
import  userManagementReducer from "../features/userManagementSlice";
import categoryReducer from "../features/categorySlice";
import productManagementReducer from "../features/productManagementSlice";


export const store = configureStore({
    reducer :
    {
        login : adminLoginReducer,
        usermanagement : userManagementReducer,
        category : categoryReducer,
        products : productManagementReducer
    }
})

