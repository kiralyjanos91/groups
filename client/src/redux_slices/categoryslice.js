import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "all"
}

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        changeCategory: ( state , action ) => { state.name = action.payload }
    }
})

export default categorySlice.reducer
export const { changeCategory } = categorySlice.actions