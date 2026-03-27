import api from "./api";

export interface Service {
    name: string;
    status: 'operational' | 'degraded' | 'outage' | 'maintenance';
    uptime: string;
    responseTime: string;
    description: string;
}

export interface StatusGroup {
    group: string;
    services: Service[];
}

export interface StatusPageData {
    groups: StatusGroup[];
}

export const getStatusData = async (): Promise<StatusPageData> => {
    const response = await api.get("/status");
    return response.data;
};
