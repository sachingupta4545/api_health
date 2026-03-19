import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Register } from '@/services/authService'

export interface RegisterState {
    items: [],
    loading: boolean,
    error: any,
}

export const RegisterAuth = createAsyncThunk('register', Register)
const initialState: RegisterState = {
    items: [],
    loading: false,
    error: null,
}

export const RegisterSlice = createSlice({
    name: 'RegisterSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(RegisterAuth.fulfilled, (state, action) => {
            state.items = action.payload
            state.loading = false
            state.error = null
        })
        builder.addCase(RegisterAuth.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
        builder.addCase(RegisterAuth.pending, (state) => {
            state.loading = true
        })
    }
})

// Action creators are generated for each case reducer function
// export const { } = RegisterSlice.actions

export default RegisterSlice.reducer