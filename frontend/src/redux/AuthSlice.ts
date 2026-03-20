import { createSlice } from '@reduxjs/toolkit'
import { RegisterAuth } from './RegisterSlice'

export interface AuthState {
    token: string | null
    user: {
        id: string
        name: string
        email: string
    } | null
}

const initialState: AuthState = {
    // Read token from localStorage so auth survives page refresh
    token: localStorage.getItem('token'),
    user: null,
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null
            state.user = null
            localStorage.removeItem('token')
        },
    },
    extraReducers: (builder) => {
        // When Register succeeds → store token + user
        builder.addCase(RegisterAuth.fulfilled, (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.user
            localStorage.setItem('token', action.payload.token)
        })
    },
})

export const { logout } = AuthSlice.actions
export default AuthSlice.reducer
