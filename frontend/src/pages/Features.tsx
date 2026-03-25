import React from 'react';
import { Activity, Bell, BarChart3, Globe, Shield, Zap, ArrowRight, MessageSquare, Mail, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Features() {
    return (
        
        <div className="flex flex-col gap-24 pb-20">
            <Helmet>
                <title>{`Features - ${import.meta.env.VITE_APP_NAME || 'API Health Check'}`}</title>
                <meta name="description" content="Instant alerts, uptime tracking, and performance monitoring for all your APIs in one dashboard." />
            </Helmet>
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-sky-50/50 -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Powerful features for <br />
                        <span className="text-sky-500">unmatched API reliability</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Stop flying blind. API Pulse gives you the visibility and tools you need to ensure your services are sempre UP and performing at their best.
                    </p>
                </div>
            </section>

            {/* Detailed Feature 1: Real-time Monitoring */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                            <Activity className="w-6 h-6 text-sky-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Precision Real-time Monitoring</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Monitor your APIs from multiple globally distributed locations. We don't just check if your server is reachable; we validate responses, check status codes, and measure latency with millisecond precision.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Configurable check intervals (30s to 5m)",
                                "Global monitoring from 12+ regions",
                                "Support for REST, GraphQL, and gRPC",
                                "Custom headers and payload validation"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                                    <Zap className="w-4 h-4 text-sky-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 lg:p-4 rotate-1 hover:rotate-0 transition-transform duration-500">
                        <div className="bg-gray-900 rounded-xl overflow-hidden p-6 text-gray-300 font-mono text-xs leading-relaxed shadow-inner">
                            <div className="flex gap-1.5 mb-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-sky-400 font-bold mb-2">$ monitoring-engine --target "api.production.com/v1" --interval 30s</p>
                            <p>[09:21:05] [CHECK] Initializing global health check...</p>
                            <p className="text-emerald-400">[09:21:06] [PASS] US-East: 200 OK (42ms)</p>
                            <p className="text-emerald-400">[09:21:06] [PASS] EU-Central: 200 OK (115ms)</p>
                            <p className="text-emerald-400">[09:21:07] [PASS] AS-South: 200 OK (189ms)</p>
                            <p className="mt-4 text-gray-500">// Schema validation successful</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Feature 2: Intelligence Alerts */}
            <section className="bg-gray-50/50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 flex justify-center">
                            <div className="relative">
                                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-full max-w-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center">
                                            <Bell className="w-5 h-5 text-rose-500" />
                                        </div>
                                        <h4 className="font-bold text-gray-900">Incident Alert</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-rose-600 uppercase">Critical</span>
                                            <p className="text-sm font-semibold text-gray-900">Payment API is DOWN</p>
                                            <span className="text-xs text-gray-500">Detected in 3 regions simultaneously</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs py-2 border-b border-gray-50 text-gray-500">
                                            <span>Channel: #ops-warroom</span>
                                            <span>09:22 AM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                                <Bell className="w-6 h-6 text-rose-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Intelligence Multi-Channel Alerts</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Don't let your customers be the first to notify you about an outage. Get instant, high-fidelity alerts through your favorite communication tools.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { name: "Slack", icon: <MessageSquare className="w-4 h-4" /> },
                                    { name: "Discord", icon: <MessageSquare className="w-4 h-4" /> },
                                    { name: "Email", icon: <Mail className="w-4 h-4" /> },
                                    { name: "Webhooks", icon: <Terminal className="w-4 h-4" /> }
                                ].map((channel, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg">
                                        {channel.icon}
                                        <span className="text-sm font-medium text-gray-700">{channel.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Feature 3: Analytics */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                            <BarChart3 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Deep Insight Analytics</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Visualize trends over time. Identify slow endpoints before they become bottlenecks. We track p50, p95, and p99 response times so you can optimize for the real user experience.
                        </p>
                        <div className="space-y-4">
                            {[
                                "Historical uptime reporting",
                                "Global latency heatmaps",
                                "Performance regression detection",
                                "Exportable PDF and CSV reports"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-700 list-none">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="flex items-end gap-1 h-32 mb-4">
                            {[40, 60, 45, 90, 65, 30, 85, 40, 25, 70, 50, 60, 45, 90, 35].map((h, i) => (
                                <div key={i} className="flex-1 bg-sky-100 rounded-t-sm relative group hover:bg-sky-500 transition-colors" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}ms
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-medium font-mono uppercase tracking-tighter">
                            <span>08:00 AM</span>
                            <span>Latency (Last 12 hours)</span>
                            <span>08:00 PM</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 py-20 bg-gray-900 rounded-3xl max-w-7xl mx-auto w-full text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to secure your APIs?</h2>
                <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
                    Join thousands of developers who trust API Pulse for their monitoring. No credit card required.
                </p>
                <Link 
                    to="/get-started" 
                    className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-10 py-5 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-lg"
                >
                    Get Started Now
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </section>
        </div>
    );
};

