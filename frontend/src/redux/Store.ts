import { configureStore } from '@reduxjs/toolkit'
import RegisterReducer from './RegisterSlice'

export const store = configureStore({
    reducer: {
        RegisterReducer,
    },
})
