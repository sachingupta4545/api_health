import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, Menu, X } from "lucide-react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <div className="flex items-center gap-2 border-gray-900 rounded px-2 py-1 transition-colors hover:bg-gray-50">
                                <Activity className="w-5 h-5 text-sky-500" />
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-tighter">API Pulse</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Middle Section — desktop only */}
                    <nav className="hidden md:flex items-center space-x-10">
                        <Link to="/features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</Link>
                        <Link to="#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
                        <Link to="#docs" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Docs</Link>
                    </nav>

                    {/* Right Action Section — desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Login</Link>
                        <Link
                            to="/get-started"
                            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
                    <Link
                        to="/features"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
                    >
                        Features
                    </Link>
                    <Link
                        to="#pricing"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
                    >
                        Pricing
                    </Link>
                    <Link
                        to="#docs"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
                    >
                        Docs
                    </Link>
                    <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
                        <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
                        >
                            Login
                        </Link>
                        <Link
                            to="/get-started"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-lg text-sm font-bold transition-all shadow-sm"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};
