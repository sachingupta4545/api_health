import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Login } from '@/services/authService'

export interface LoginState {
    items: [],
    loading: boolean,
    error?: any,
}


export const LoginAuth = createAsyncThunk('login',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await Login(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);

        }
    })
const initialState: LoginState = {
    items: [],
    loading: false,
    error: null,
}

export const LoginSlice = createSlice({
    name: 'LoginSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(LoginAuth.fulfilled, (state, action) => {
            state.items = action.payload
            state.loading = false
            state.error = null
        })
        builder.addCase(LoginAuth.rejected, (state, action) => {
            state.error = action.payload
            state.loading = false
        })
        builder.addCase(LoginAuth.pending, (state) => {
            state.loading = true
            state.error = null
        })
    }
})


export default LoginSlice.reducer