import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';


export default function HomeLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            <Header />
            {/* Main content with flex-grow */}
            <main className="flex-grow ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mt-6">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Footer always at the bottom */}
            <Footer />
        </div>
    );

};