import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Monitor,
    AlertTriangle,
    Bell,
    Globe,
    Settings,
    ChevronLeft,
    ChevronRight,
    Activity
} from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Monitor, label: 'Monitors', path: '/monitors' },
        { icon: AlertTriangle, label: 'Incidents', path: '/incidents' },
        { icon: Bell, label: 'Alerts', path: '/alerts' },
        { icon: Globe, label: 'Status Page', path: '/status' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside
            className={`bg-[#0F172A] text-slate-300 transition-all duration-300 flex flex-col h-screen sticky top-0 ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800/50 overflow-hidden shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shrink-0">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold text-lg text-white tracking-tight truncate">PulseGuard</span>
                    )}
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-grow py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all group
                            ${isActive
                                ? 'bg-sky-500/10 text-sky-500'
                                : 'hover:bg-slate-800/50 hover:text-white'
                            }
                        `}
                    >
                        <item.icon className={`w-5 h-5 shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                        {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section / Collapse Toggle */}
            <div className="p-4 border-t border-slate-800/50 shrink-0">
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400 hover:text-white"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs font-semibold">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
