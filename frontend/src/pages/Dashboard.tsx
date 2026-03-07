import React from 'react';
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

export default function Dashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Dashboard</h1>
                    <p className="text-sm font-medium text-gray-500">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-semibold text-gray-600">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    Nov 25 - Dec 1, 2026
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Monitors', value: '8', change: '+2 this week', icon: Monitor, color: 'sky' },
                    { label: 'APIs Up', value: '6', change: 'All systems nominal', icon: CheckCircle2, color: 'emerald' },
                    { label: 'APIs Down', value: '1', change: '1 critical', icon: AlertCircle, color: 'rose' },
                    { label: 'Avg Response Time', value: '309ms', change: '-12ms from yesterday', icon: Clock, color: 'amber' },
                ].map((stat, i) => (
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
                        <p className={`text-[11px] font-bold ${
                            stat.color === 'rose' ? 'text-rose-500' : 
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
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-extrabold text-gray-900 tracking-tight">Uptime Percentage</h3>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">
                            <Activity className="w-3 h-3" />
                            LIVE
                        </div>
                    </div>
                    {/* SVG Chart Placeholder - Recreating the visual curve */}
                    <div className="relative h-64 w-full group">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map(y => (
                                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="2,2" />
                            ))}
                            {/* Area */}
                            <path 
                                d="M0,20 C50,15 100,50 150,30 C200,10 250,60 300,50 C350,40 400,10 400,10 L400,100 L0,100 Z" 
                                fill="url(#uptimeGradient)" 
                            />
                            {/* Line */}
                            <path 
                                d="M0,20 C50,15 100,50 150,30 C200,10 250,60 300,50 C350,40 400,10 400,10" 
                                fill="none" 
                                stroke="#0EA5E9" 
                                strokeWidth="2.5" 
                                strokeLinecap="round"
                            />
                            {/* Points */}
                            <circle cx="150" cy="30" r="3" fill="white" stroke="#0EA5E9" strokeWidth="2" className="drop-shadow-sm cursor-pointer" />
                        </svg>
                        {/* Axes Labels */}
                        <div className="absolute top-0 left-0 -translate-x-full pr-4 h-full flex flex-col justify-between text-[10px] font-bold text-gray-400">
                            <span>100%</span>
                            <span>99%</span>
                            <span>98%</span>
                            <span>97%</span>
                            <span>96%</span>
                        </div>
                        <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            <span>Nov 25</span>
                            <span>Nov 26</span>
                            <span>Nov 27</span>
                            <span>Nov 28</span>
                            <span>Nov 29</span>
                            <span>Nov 30</span>
                            <span>Dec 1</span>
                        </div>
                    </div>
                </div>

                {/* Response Time Trends Chart */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-extrabold text-gray-900 tracking-tight">Response Time Trends</h3>
                        <div className="flex gap-2">
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
                    {/* Multi-line SVG Chart */}
                    <div className="relative h-64 w-full overflow-visible">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map(y => (
                                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="2,2" />
                            ))}
                            {/* P99 - Rose Line */}
                            <path d="M0,50 C50,60 100,50 150,20 C200,10 250,30 300,50 C350,55 400,60" fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
                            {/* P95 - Amber Line */}
                            <path d="M0,70 C50,80 100,75 150,50 C200,45 250,55 300,75 C350,80 400,85" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                            {/* Avg - Sky Line */}
                            <path d="M0,85 C50,90 100,85 150,75 C200,70 250,80 300,90 C350,92 400,95" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {/* Axes Labels */}
                        <div className="absolute top-0 left-0 -translate-x-full pr-4 h-full flex flex-col justify-between text-[10px] font-bold text-gray-400">
                            <span>1000ms</span>
                            <span>750ms</span>
                            <span>500ms</span>
                            <span>250ms</span>
                            <span>0ms</span>
                        </div>
                        <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            <span>00.00</span>
                            <span>04.00</span>
                            <span>08.00</span>
                            <span>12.00</span>
                            <span>16.00</span>
                            <span>20.00</span>
                            <span>23.59</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section Placeholder */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[200px] flex items-center justify-center border-dashed">
                <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 mb-2">Failures Over Time</p>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">Detailed incident logs and failure root cause analysis will appear here.</p>
                </div>
            </div>
        </div>
    );
};

