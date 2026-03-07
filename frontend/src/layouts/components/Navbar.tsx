import React from 'react';
import { Bell, User, LayoutGrid, Search } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left Section: Breadcrumbs or Active Page */}
            <div className="flex items-center gap-4">
                <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <div className="relative group hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search for monitor..." 
                        className="bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
                </button>
                
                <div className="h-8 w-px bg-gray-100 mx-2" />

                <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-xs font-bold text-gray-900 group-hover:text-sky-600 transition-colors">Sachin Gupta</p>
                        <p className="text-[10px] font-medium text-gray-400">Pro Developer</p>
                    </div>
                </button>
            </div>
        </header>
    );
};