import React from 'react';
import { Bell, User, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/Store';
import { logout } from '@/redux/AuthSlice';
import { Popconfirm } from 'antd';

interface NavbarProps {
    openMobileSidebar: () => void;
}

export default function Navbar({ openMobileSidebar }: NavbarProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
            {/* Left Section */}
            <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <button
                    onClick={openMobileSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                    aria-label="Open navigation menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
                </button>

                <div className="h-8 w-px bg-gray-100 hidden sm:block" />

                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 sm:gap-3 p-1 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                        <User className="w-5 h-5" />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-xs font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                            {user?.name ?? 'Guest'}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 max-w-[140px] truncate">
                            {user?.email ?? ''}
                        </p>
                    </div>
                </button>

                {/* Logout Button */}
                <Popconfirm
                    title="Logout"
                    description="Are you sure to logout?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={handleLogout}
                    className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                </Popconfirm>
            </div>
        </header>
    );
};