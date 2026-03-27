import api from "./api";
import { Monitor } from "./monitorService";

export interface Incident {
    _id: string;
    id: string;
    title: string;
    monitorId: Monitor | null;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'investigating' | 'resolved';
    startedAt: string;
    resolvedAt: string | null;
    affectedUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getIncidents = async () => {
    const response = await api.get("/incidents");
    return response.data;
};

export const getIncidentById = async (id: string) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
};

export const createIncident = async (data: Partial<Incident>) => {
    const response = await api.post("/incidents", data);
    return response.data;
};

export const updateIncident = async (id: string, data: Partial<Incident>) => {
    const response = await api.put(`/incidents/${id}`, data);
    return response.data;
};

export const deleteIncident = async (id: string) => {
    const response = await api.delete(`/incidents/${id}`);
    return response.data;
};
