import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/Store";

export default function AuthMiddleware() {
    const token = useAppSelector((state) => state.auth.token);

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    
    return <Outlet />;
}