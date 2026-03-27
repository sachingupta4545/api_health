import React from "react";
import { Link } from "react-router-dom";
import { Activity, Github, Mail, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-sky-500" />
                            <span className="text-base font-bold text-gray-900">API Pulse</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                            Reliable API health monitoring for modern teams.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-gray-400 hover:text-gray-600">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-600">
                                <Mail className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-600">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links - Product */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-6 font-semibold">Product</h4>
                        <ul className="space-y-4">
                            <li><Link to="#features" className="text-sm text-gray-500 hover:text-gray-900">Features</Link></li>
                            <li><Link to="#pricing" className="text-sm text-gray-500 hover:text-gray-900">Pricing</Link></li>
                            <li><Link to="#changelog" className="text-sm text-gray-500 hover:text-gray-900">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Links - Resources */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-6 font-semibold">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link to="#docs" className="text-sm text-gray-500 hover:text-gray-900">Docs</Link></li>
                            <li><Link to="#blog" className="text-sm text-gray-500 hover:text-gray-900">Blog</Link></li>
                            <li><Link to="#api" className="text-sm text-gray-500 hover:text-gray-900">API Reference</Link></li>
                        </ul>
                    </div>

                    {/* Links - Company */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-6 font-semibold">Company</h4>
                        <ul className="space-y-4">
                            <li><Link to="#about" className="text-sm text-gray-500 hover:text-gray-900">About</Link></li>
                            <li><Link to="#contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link></li>
                            <li><Link to="#privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center items-center">
                    <p className="text-xs text-gray-400 text-center">
                        © {new Date().getFullYear()} API Pulse. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

