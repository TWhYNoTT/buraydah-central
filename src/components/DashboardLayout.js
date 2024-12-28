import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Menu,
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/PatientRegistration', label: '  Add New Patient', icon: FileText },
        { path: '/register', label: 'Register New Admin', icon: Users },
        // Add more menu items as needed
    ];

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                }`}>
                <div className="h-full flex flex-col">
                    {/* Logo/Header */}
                    <div className="h-16 flex items-center justify-between px-4 border-b">
                        {isSidebarOpen && (
                            <h1 className="text-xl font-bold text-gray-800">BCH Lab</h1>
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
                                    onClick={() => navigate(item.path)}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white shadow-sm flex items-center px-6">
                    <Menu className="w-6 h-6 text-gray-600" />
                    <h2 className="ml-4 text-xl font-semibold text-gray-800">
                        {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;