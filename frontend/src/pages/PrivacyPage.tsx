import React from "react";
import { Helmet } from "react-helmet-async";
import { Shield, Lock, Eye, Server, Mail } from "lucide-react";

const sections = [
    {
        icon: Eye,
        title: "Information We Collect",
        content: [
            "**Account Information:** When you create an account, we collect your name and email address.",
            "**Monitor Data:** URLs, HTTP methods, check intervals, and response data for the monitors you configure.",
            "**Usage Data:** Anonymized analytics about how you interact with the dashboard to improve the product.",
            "**Log Data:** Server logs including IP addresses, browser type, and pages visited, retained for up to 30 days.",
        ],
    },
    {
        icon: Lock,
        title: "How We Use Your Information",
        content: [
            "To provide, maintain, and improve the API Pulse monitoring service.",
            "To send you alert notifications when a monitor changes status.",
            "To send product updates and announcements (you can unsubscribe anytime).",
            "To diagnose technical issues and ensure service reliability.",
        ],
    },
    {
        icon: Server,
        title: "Data Storage & Security",
        content: [
            "All data is stored on secure servers with encryption at rest and in transit (TLS 1.2+).",
            "We do not sell, rent, or trade your personal information to third parties.",
            "Monitor check data is retained for 90 days for free plans and 1 year for paid plans.",
            "You may delete your account and all associated data at any time from your settings page.",
        ],
    },
    {
        icon: Shield,
        title: "Cookies & Tracking",
        content: [
            "We use essential cookies to keep you logged in and maintain your session.",
            "We do not use advertising cookies or third-party tracking pixels.",
            "You can clear cookies at any time through your browser settings — this will log you out.",
        ],
    },
    {
        icon: Mail,
        title: "Contact & Updates",
        content: [
            "If you have questions about this policy, contact us at privacy@apipulse.dev.",
            "We may update this Privacy Policy from time to time. We'll notify you of significant changes via email.",
            "Continued use of API Pulse after updates constitutes acceptance of the revised policy.",
        ],
    },
];

function renderContent(text: string) {
    // Bold markdown-style **text**
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="text-gray-800">{part}</strong> : part
    );
}

export default function PrivacyPage() {
    return (
        <div className="flex flex-col gap-12 pb-20 pt-6">
            <Helmet>
                <title>Privacy Policy — API Pulse</title>
                <meta name="description" content="API Pulse's Privacy Policy — how we collect, use, and protect your data." />
            </Helmet>

            {/* Hero */}
            <section className="max-w-3xl mx-auto text-center px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 rounded-full mb-6">
                    <Shield className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-xs font-semibold text-sky-600 uppercase tracking-widest">Privacy Policy</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
                    Your privacy, <span className="text-sky-500">our priority</span>
                </h1>
                <p className="text-base text-gray-500 leading-relaxed">
                    Last updated: <span className="font-semibold text-gray-700">April 2025</span>
                </p>
                <p className="text-base text-gray-500 leading-relaxed mt-3 max-w-xl mx-auto">
                    This Privacy Policy explains what information API Pulse collects, how we use it, and your rights around that data. We keep it plain and honest.
                </p>
            </section>

            {/* Policy Sections */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
                <div className="space-y-6">
                    {sections.map((section, i) => (
                        <div
                            key={i}
                            className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
                                    <section.icon className="w-4.5 h-4.5" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                            </div>
                            <ul className="space-y-3">
                                {section.content.map((item, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                                        <span>{renderContent(item)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Banner */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 text-white text-center">
                    <Mail className="w-8 h-8 text-sky-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Questions about your data?</h3>
                    <p className="text-slate-300 text-sm mb-6">
                        We're happy to help. Reach out to our privacy team directly.
                    </p>
                    <a
                        href="mailto:privacy@apipulse.dev"
                        className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all"
                    >
                        <Mail className="w-4 h-4" />
                        sgsolutions@gmail.com
                    </a>
                </div>
            </section>
        </div>
    );
}
