import api from "./api";

export interface Monitor {
    _id: string;
    name: string;
    url: string;
    method: string;
    interval: number;
    timeout: number;
    status: "active" | "paused";
    lastStatus: "up" | "down" | "unknown";
    lastChecked: string | null;
}

export const getMonitors = async () => {
    const response = await api.get("/monitors");
    return response.data;
};
