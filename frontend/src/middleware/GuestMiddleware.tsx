import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/redux/Store";

export default function GuestMiddleware() {
    const token = useAppSelector((state) => state.auth.token);
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
}