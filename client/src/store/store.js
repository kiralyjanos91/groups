import { configureStore } from "@reduxjs/toolkit"
import accessUpdateReducer from "../redux_slices/accessupdateslice"
import userDataReducer from "../redux_slices/userdataslice"
import categoryReducer from "../redux_slices/categoryslice"

export const store = configureStore({
    reducer: {
        accessupdate: accessUpdateReducer,
        userData: userDataReducer,
        category: categoryReducer
    }
})