import { Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Features from "../pages/Features";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import HomeLayout from "../layouts/HomeLayout";
import AuthMiddleware from "../middleware/AuthMiddleware";

export const authRoutes = (
    <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />

        {/* Only accessible when NOT logged in */}
        <Route element={<AuthMiddleware />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="get-started" element={<Signup />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
    </Route>
);