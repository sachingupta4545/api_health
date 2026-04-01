import api from "./api";

export interface AlertRule {
    _id: string;
    name: string;
    monitor: {
        _id: string;
        name: string;
        url: string;
    };
    condition: "down" | "slow" | "ssl_expiry" | "status_code";
    threshold: number;
    status_pattern?: string;
    emails: string[];
    enabled: boolean;
    lastTriggered: string | null;
    triggerCount: number;
    createdAt: string;
    updatedAt: string;
}

export const getAlerts = async () => {
    const response = await api.get("/alerts");
    return response.data;
};

export const getAlertById = async (id: string) => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
};

export const createAlert = async (data: any) => {
    const response = await api.post("/alerts", data);
    return response.data;
};

export const updateAlert = async (id: string, data: any) => {
    const response = await api.put(`/alerts/${id}`, data);
    return response.data;
};

export const deleteAlert = async (id: string) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
};
