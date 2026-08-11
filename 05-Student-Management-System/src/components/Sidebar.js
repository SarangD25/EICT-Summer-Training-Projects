import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { LayoutDashboard, Users, Layers, CalendarCheck2, Award, History } from 'lucide-react';
export const Sidebar = ({ activeTab, onTabChange, userRole, lowAttendanceCount }) => {
    const navItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            badge: null,
            adminOnly: false
        },
        {
            id: 'students',
            label: 'Students',
            icon: Users,
            badge: null,
            adminOnly: false
        },
        {
            id: 'batches',
            label: 'Batches & Courses',
            icon: Layers,
            badge: null,
            adminOnly: false
        },
        {
            id: 'attendance',
            label: 'Attendance',
            icon: CalendarCheck2,
            badge: lowAttendanceCount > 0 ? `${lowAttendanceCount} Alert` : null,
            badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            adminOnly: false
        },
        {
            id: 'grades',
            label: 'Grades',
            icon: Award,
            badge: null,
            adminOnly: false
        },
        {
            id: 'logs',
            label: 'Activity Logs',
            icon: History,
            badge: 'Admin',
            badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            adminOnly: true
        }
    ];
    return (_jsxs("aside", { className: "w-64 bg-[#0D0D0D] border-r border-[#222222] shrink-0 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-6 gap-8", children: [_jsxs("div", { children: [_jsx("div", { className: "mb-4", children: _jsx("p", { className: "text-[10px] text-gray-600 uppercase font-black mb-2 tracking-widest", children: "Main Menu" }) }), _jsx("nav", { className: "flex flex-col gap-1.5", children: navItems.map((item) => {
                            if (item.adminOnly && userRole !== 'admin')
                                return null;
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (_jsxs("button", { onClick: () => onTabChange(item.id), className: `w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${isActive
                                    ? 'bg-white text-black font-black'
                                    : 'text-gray-400 hover:text-white hover:bg-[#181818]'}`, children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: `w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black' : 'bg-transparent'}` }), _jsx("span", { children: item.label })] }), item.badge && (_jsx("span", { className: `text-[9px] font-mono px-1.5 py-0.5 rounded-sm uppercase ${isActive
                                            ? 'bg-black text-white'
                                            : 'bg-[#222222] text-red-400 border border-[#333333]'}`, children: item.badge }))] }, item.id));
                        }) })] }), _jsxs("div", { className: "mt-auto p-4 bg-[#111111] border border-[#222222] rounded-sm space-y-1", children: [_jsx("p", { className: "text-[10px] text-gray-500 font-bold uppercase tracking-widest", children: "System Status" }), _jsx("p", { className: "text-xs font-mono text-green-500 font-bold", children: "RUNNING" }), _jsxs("p", { className: "text-[10px] text-gray-500 uppercase tracking-tight mt-2", children: ["ROLE: ", _jsx("span", { className: "text-gray-300 font-bold", children: userRole.toUpperCase() })] })] })] }));
};
