import { configureStore } from "@reduxjs/toolkit"
import accessUpdateReducer from "../redux_slices/accessupdateslice"
import userDataReducer from "../redux_slices/userdataslice"

export const store = configureStore({
    reducer: {
        accessupdate: accessUpdateReducer,
        userData: userDataReducer
    }
})