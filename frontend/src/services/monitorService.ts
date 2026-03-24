import api from "./api";

export interface Monitor {
    _id: string;
    name: string;
    url: string;
    method: string;
    interval: number;
    timeout: number;
    alert_contact: string;
    status: "active" | "paused";
    lastStatus: "up" | "down" | "unknown";
    lastChecked: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export const getMonitors = async () => {
    const response = await api.get("/monitors");
    return response.data;
};

export const getMonitorById = async (id: string) => {
    const response = await api.get(`/monitors/${id}`);
    return response.data;
};

export const createMonitor = async (data: Partial<Monitor>) => {
    const response = await api.post("/monitors", data);
    return response.data;
};

export const updateMonitor = async (id: string, data: Partial<Monitor>) => {
    const response = await api.put(`/monitors/${id}`, data);
    return response.data;
};

export const deleteMonitor = async (id: string) => {
    const response = await api.delete(`/monitors/${id}`);
    return response.data;
};
