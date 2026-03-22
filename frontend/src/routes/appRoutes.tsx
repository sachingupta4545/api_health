import { Route } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import MonitorPage from "../pages/monitor/MonitorPage";
import MonitorCreatePage from "../pages/monitor/MonitorCreatePage";
import AuthMiddleware from "../middleware/AuthMiddleware";

export const appRoutes = (
    <Route element={<AuthMiddleware />}>
        <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard /> } />
            <Route path="/monitors" element={<MonitorPage />} />
            <Route path="/monitors/create" element={<MonitorCreatePage />} />
            <Route path="/incidents" element={<div className="p-8"><h1 className="text-2xl font-bold">Incidents Page (Coming Soon)</h1></div>} />
            <Route path="/alerts" element={<div className="p-8"><h1 className="text-2xl font-bold">Alerts Page (Coming Soon)</h1></div>} />
            <Route path="/status" element={<div className="p-8"><h1 className="text-2xl font-bold">Status Page (Coming Soon)</h1></div>} />
            <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings Page (Coming Soon)</h1></div>} />
        </Route>
    </Route>
);

