import { Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Features from "../pages/Features";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import HomeLayout from "../layouts/HomeLayout";

export const authRoutes = (
    <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="get-started" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
    </Route>
);