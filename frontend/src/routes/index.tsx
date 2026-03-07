import { createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { appRoutes } from './appRoutes';

export const router = createBrowserRouter(
    createRoutesFromElements([authRoutes, appRoutes])
);