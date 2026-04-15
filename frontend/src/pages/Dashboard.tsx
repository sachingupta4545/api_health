import React, { useState, useEffect } from 'react';
import {
    Monitor,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Activity,
    AlertCircle,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid
} from 'recharts';
import { Spin } from 'antd';
import { getDashboardMetrics } from '../services/monitorService';

interface DashboardStats {
    totalMonitors: number;
    upMonitors: number;
    downMonitors: number;
    avgResponseTime: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalMonitors: 0,
        upMonitors: 0,
        downMonitors: 0,
        avgResponseTime: 0
    });

    const [uptimeData, setUptimeData] = useState<any[]>([]);
    const [responseTimeData, setResponseTimeData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getDashboardMetrics();
                setStats(data.stats);
                setUptimeData(data.charts.uptimeChart || []);
                setResponseTimeData(data.charts.responseTimeChart || []);
            } catch (error) {
                console.error("Failed to fetch dashboard metrics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const statCards = [
        { label: 'Total Monitors', value: stats.totalMonitors.toString(), change: 'Tracking actively', icon: Monitor, color: 'sky' },
        { label: 'APIs Up', value: stats.upMonitors.toString(), change: stats.upMonitors === stats.totalMonitors && stats.totalMonitors > 0 ? 'All systems nominal' : `${stats.upMonitors} healthy`, icon: CheckCircle2, color: 'emerald' },
        { label: 'APIs Down', value: stats.downMonitors.toString(), change: stats.downMonitors > 0 ? `${stats.downMonitors} critical` : '0 issues', icon: AlertCircle, color: 'rose' },
        { label: 'Avg Response Time', value: `${stats.avgResponseTime}ms`, change: 'Global average', icon: Clock, color: 'amber' },
    ];

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Dashboard</h1>
                    <p className="text-sm font-medium text-gray-500">Welcome back, here's your live infrastructure overview.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-semibold text-gray-600">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    Last 7 Days
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500 transition-colors group-hover:bg-${stat.color}-500 group-hover:text-white`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <button className="text-gray-300 hover:text-gray-900 transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{stat.value}</h3>
                        <p className={`text-[11px] font-bold ${stat.color === 'rose' && stats.downMonitors > 0 ? 'text-rose-500' :
                            stat.color === 'emerald' ? 'text-emerald-500' : 'text-sky-500'
                            }`}>
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Uptime Percentage Chart */}
                <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-extrabold text-gray-900 tracking-tight">Uptime Percentage (7 Days)</h3>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
                            <Activity className="w-3 h-3" />
                            LIVE
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={uptimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={['dataMin - 10', 100]} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="percent" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorUptime)" name="Uptime %" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Response Time Trends Chart */}
                <div className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-8 flex-wrap gap-2">
                        <h3 className="font-extrabold text-gray-900 tracking-tight">Response Time (24h)</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1 bg-gray-50 rounded">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> P99
                            </span>
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1 bg-gray-50 rounded">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> P95
                            </span>
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1 bg-gray-50 rounded">
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Avg
                            </span>
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="p99" stroke="#F43F5E" strokeWidth={2} dot={false} name="P99 (ms)" />
                                <Line type="monotone" dataKey="p95" stroke="#F59E0B" strokeWidth={2} dot={false} name="P95 (ms)" />
                                <Line type="monotone" dataKey="avg" stroke="#0EA5E9" strokeWidth={2} dot={false} name="Avg (ms)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section Placeholder */}
            {stats.downMonitors > 0 && (
                <div className="bg-rose-50 p-4 sm:p-6 rounded-2xl border border-rose-100 shadow-sm min-h-[100px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-rose-600 font-bold mb-1 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Action Required
                        </h3>
                        <p className="text-sm text-rose-500 font-medium">You have {stats.downMonitors} API(s) currently experiencing an outage. Check the monitors tab for details.</p>
                    </div>
                    <a href="/monitors" className="shrink-0 px-4 py-2 bg-rose-600 text-white font-bold rounded-lg text-sm hover:bg-rose-700 transition">View Incidents</a>
                </div>
            )}
        </div>
    );
};
