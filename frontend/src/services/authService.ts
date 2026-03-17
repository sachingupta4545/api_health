import api from "./api";

export const Register = async (data: any) => {
    const response = await api.post("/register", data);
    return response.data ?? [];
};

export const Login = async (data: any) => {
    const response = await api.post("/login", data);
    return response.data ?? [];
};