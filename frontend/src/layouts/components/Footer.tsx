import React from "react";
import { Link } from "react-router-dom";
import { Activity, Github, Mail, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-sky-500" />
                            <span className="text-base font-bold text-gray-900">API Pulse</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                            Reliable API health monitoring for modern teams.
                        </p>
                        <div className="flex items-center space-x-4">
                           
                        </div>
                    </div>

                    {/* Links - Product */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="/features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</Link></li>
                            <li><Link to="/get-started" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Get Started</Link></li>
                        </ul>
                    </div>

                    {/* Links - Company */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</Link></li>
                            <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400 text-center">
                        © {new Date().getFullYear()} API Pulse. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</Link>
                        <Link to="/about" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">About</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
