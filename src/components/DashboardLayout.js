import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Menu,
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

import hospitalLogo from '../assets/bch.jpeg';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/PatientRegistration', label: 'Add New Patient', icon: FileText },
        { path: '/register', label: 'Register New Admin', icon: Users },
    ];

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Desktop Sidebar */}
            <div className={`hidden md:block bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                }`}>
                <div className="h-full flex flex-col">
                    {/* Logo/Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b">
                        {isSidebarOpen && (
                            <img src={hospitalLogo} alt="Hospital Logo" className="h-10" />
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            {isSidebarOpen ? (
                                <ChevronLeft className="w-5 h-5" />
                            ) : (
                                <ChevronRight className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-2 py-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center px-4 py-2 mb-2 rounded-lg ${location.pathname === item.path
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {isSidebarOpen && (
                                        <span className="ml-3">{item.label}</span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="border-t p-4">
                        <button
                            onClick={logout}
                            className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            <LogOut className="w-5 h-5" />
                            {isSidebarOpen && <span className="ml-3">Logout</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
                    onClick={toggleMobileMenu}>
                </div>
            )}

            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out z-50 w-64 bg-white shadow-lg`}>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center justify-between px-4 border-b">
                        <img src={hospitalLogo} alt="Hospital Logo" className="h-10" />
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 px-2 py-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center px-4 py-2 mb-2 rounded-lg ${location.pathname === item.path
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="ml-3">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="border-t p-4">
                        <button
                            onClick={logout}
                            className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white shadow-sm flex items-center px-4 md:px-6">
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>
                    <h2 className="ml-4 text-lg md:text-xl font-semibold text-gray-800 truncate">
                        {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;