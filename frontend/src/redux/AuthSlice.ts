import { createSlice } from '@reduxjs/toolkit'
import { RegisterAuth } from './RegisterSlice'
import { LoginAuth } from './LoginSlice'

export interface AuthState {
    token: string | null
    user: {
        id: string
        name: string
        email: string
    } | null
}

const storedUser = localStorage.getItem('user')

const initialState: AuthState = {
    // Read token + user from localStorage so auth survives page refresh
    token: localStorage.getItem('token'),
    user: storedUser ? JSON.parse(storedUser) : null,
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null
            state.user = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
    },
    extraReducers: (builder) => {
        // When Register succeeds → store token + user
        builder.addCase(RegisterAuth.fulfilled, (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.user
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
        })
        // When Login succeeds → store token + user
        builder.addCase(LoginAuth.fulfilled, (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.user
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
        })
    },
})

export const { logout } = AuthSlice.actions
export default AuthSlice.reducer
