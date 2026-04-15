import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Activity, Users, Target, Zap, Heart, ArrowRight } from "lucide-react";

const team = [
    {
        name: "SGSolutions",
        role: "Founder & Full-Stack Engineer",
        bio: "Building reliable developer tools and API infrastructure with a focus on performance and simplicity.",
        avatar: "SG",
        color: "bg-sky-500",
    },
];

const values = [
    {
        icon: Zap,
        title: "Speed & Reliability",
        desc: "We believe monitoring should be fast, accurate, and always available — because your APIs are.",
    },
    {
        icon: Users,
        title: "Developer-First",
        desc: "Every feature is designed with developers in mind. No fluff, just the insights you actually need.",
    },
    {
        icon: Target,
        title: "Transparency",
        desc: "We're open about our uptime, our roadmap, and our pricing. No surprises.",
    },
    {
        icon: Heart,
        title: "Built with Care",
        desc: "Every detail matters. From alert latency to dashboard design — we sweat the small stuff.",
    },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-20 pb-20 pt-6">
            <Helmet>
                <title>About — API Pulse</title>
                <meta name="description" content="Learn about API Pulse — the team, mission, and values behind the API monitoring platform built for modern teams." />
            </Helmet>

            {/* Hero */}
            <section className="max-w-3xl mx-auto text-center px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 rounded-full mb-6">
                    <Activity className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-xs font-semibold text-sky-600 uppercase tracking-widest">About Us</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
                    Built to keep your APIs <span className="text-sky-500">always on</span>
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                    API Pulse was created out of frustration with complex, overpriced monitoring tools. We built something lean, powerful, and developer-friendly — because your time is better spent shipping, not debugging outages.
                </p>
            </section>

            {/* Mission */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-8 sm:p-14 text-white">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-4 block">Our Mission</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6 max-w-2xl">
                        Instant visibility into every API, for every team.
                    </h2>
                    <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                        We believe every developer and team deserves to know the health of their APIs in real time —
                        without paying enterprise prices or wrestling with complex configurations. API Pulse turns monitoring
                        into something you actually want to use.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 inline-block">Our Values</span>
                    <h2 className="text-3xl font-bold text-gray-900">What we stand for</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 mb-5 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                                <v.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 inline-block">Team</span>
                    <h2 className="text-3xl font-bold text-gray-900">The people behind API Pulse</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    {team.map((member, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center max-w-xs w-full">
                            <div className={`w-16 h-16 rounded-2xl ${member.color} flex items-center justify-center text-white font-extrabold text-xl mb-5`}>
                                {member.avatar}
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                            <p className="text-xs font-semibold text-sky-500 uppercase tracking-wider mb-3">{member.role}</p>
                            <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                    Join developers and teams who trust API Pulse to keep their APIs healthy.
                </p>
                <Link
                    to="/get-started"
                    className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-95"
                >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </section>
        </div>
    );
}
