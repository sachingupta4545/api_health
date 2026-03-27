import { lazy } from "react";
import { Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthMiddleware from "../middleware/AuthMiddleware";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const MonitorPage = lazy(() => import("../pages/monitor/MonitorPage"));
const MonitorCreatePage = lazy(() => import("../pages/monitor/MonitorCreatePage"));
const IncidentsPage = lazy(() => import("../pages/incidents/IncidentsPage"));
const IncidentDetailPage = lazy(() => import("../pages/incidents/IncidentDetailPage"));
const AlertsPage = lazy(() => import("../pages/alerts/AlertsPage"));
const AlertCreatePage = lazy(() => import("../pages/alerts/AlertCreatePage"));
const StatusPage = lazy(() => import("../pages/status/StatusPage"));
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));

export const appRoutes = (
    <Route element={<AuthMiddleware />}>
        <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/monitors" element={<MonitorPage />} />
            <Route path="/monitors/create" element={<MonitorCreatePage />} />
            <Route path="/monitors/edit/:id" element={<MonitorCreatePage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/incidents/:id" element={<IncidentDetailPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/alerts/create" element={<AlertCreatePage />} />
            <Route path="/alerts/:id/edit" element={<AlertCreatePage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/settings" element={<SettingsPage />} />
        </Route>
    </Route>
);

