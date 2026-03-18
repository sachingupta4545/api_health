import { useState } from "react";
import { Register, Login } from "../../services/authService";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await Register(data);
            if (response.token) {
                localStorage.setItem("token", response.token);
            }
            setUser(response.user);
            return response;
        } catch (error: any) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            const response = await Login(data);
            if (response.token) {
                localStorage.setItem("token", response.token);
            }
            setUser(response.user);
            return response;
        } catch (error: any) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        register,
        login,
    };
};
