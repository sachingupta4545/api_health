import { Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import MonitorPage from "../pages/monitor/MonitorPage";
import MonitorCreatePage from "../pages/monitor/MonitorCreatePage";
import IncidentsPage from "../pages/incidents/IncidentsPage";
import IncidentDetailPage from "../pages/incidents/IncidentDetailPage";
import AlertsPage from "../pages/alerts/AlertsPage";
import AlertCreatePage from "../pages/alerts/AlertCreatePage";
import StatusPage from "../pages/status/StatusPage";
import SettingsPage from "../pages/settings/SettingsPage";
import AuthMiddleware from "../middleware/AuthMiddleware";

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

