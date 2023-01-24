import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: {}
}

export const userDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        updateUserData: ( state , action ) => { state.data = action.payload }
    }
})

export default userDataSlice.reducer
export const { updateUserData } = userDataSlice.actions