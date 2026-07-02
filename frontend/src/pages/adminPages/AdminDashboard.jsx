import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LuMap, LuBuilding2, LuMapPin, LuLayoutDashboard } from 'react-icons/lu';

const AdminDashboard = () => {
    // We define our navigation items in an array for clean rendering
    const navItems = [
        { path: '/admin/add-state', label: 'Add State', icon: <LuMap size={20} /> },
        { path: '/admin/add-city', label: 'Add City', icon: <LuBuilding2 size={20} /> },
        { path: '/admin/add-place', label: 'Add Tourist Place', icon: <LuMapPin size={20} /> },
    ];

    return (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0">
                {/* sticky keeps the sidebar in view if the form gets really long */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 px-2">
                        <LuLayoutDashboard className="text-green-600" />
                        Admin Panel
                    </h2>

                    {/* Navigation Links */}
                    <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                // NavLink provides 'isActive' so we can highlight the currently selected tab
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${isActive
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                {/* The Outlet is the magic placeholder where React Router injects our AddState, AddCity, etc. components */}
                <Outlet />
            </main>

        </div>
    );
};

export default AdminDashboard;