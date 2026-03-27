import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import RegisterReducer from './RegisterSlice'
import AuthReducer from './AuthSlice'
import LoginReducer from './LoginSlice'

export const store = configureStore({
    reducer: {
        RegisterReducer,
        auth: AuthReducer,
        LoginReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Pre-typed hooks – use these throughout your app instead of plain useDispatch/useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
