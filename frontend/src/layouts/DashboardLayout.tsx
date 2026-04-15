import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

export default function DashboardLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobileOpen={isMobileSidebarOpen}
                closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
            />

            <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
                <Navbar openMobileSidebar={() => setIsMobileSidebarOpen(true)} />
                <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
