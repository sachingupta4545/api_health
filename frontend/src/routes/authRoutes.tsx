import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import GuestMiddleware from "../middleware/GuestMiddleware";

const Home = lazy(() => import("../pages/Home"));
const Features = lazy(() => import("../pages/Features"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));

export const authRoutes = (
    <Route path="/" element={<HomeLayout />}>
        <Route index element={<Home />} />
        <Route path="features" element={<Features />} />

        {/* Only accessible when NOT logged in */}
        <Route element={<GuestMiddleware />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="get-started" element={<Signup />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
    </Route>
);