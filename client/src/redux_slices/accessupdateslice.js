import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: undefined
}

export const accessUpdateSlice = createSlice({
    name: "accessupdate",
    initialState,
    reducers: {
        setToken: (state , action) => { state.token = action.payload } 
    }
})

export default accessUpdateSlice.reducer
export const { setToken } = accessUpdateSlice.actions