import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { X, Layers, Save } from 'lucide-react';
export const BatchModal = ({ isOpen, onClose, onSubmit }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('Computer Science');
    const [year, setYear] = useState('2024');
    const [semester, setSemester] = useState('4');
    const [advisorName, setAdvisorName] = useState('Prof. Vikram Sharma');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code || !name) {
            setError('Please provide batch code and title.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onSubmit({
                code,
                name,
                department,
                year: Number(year),
                semester: Number(semester),
                advisorName
            });
            onClose();
        }
        catch (err) {
            setError(err.message || 'Failed to create batch');
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-[#0F0F0F] border border-[#222222] rounded-sm max-w-md w-full p-6 shadow-2xl relative text-white space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-[#222222]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Layers, { className: "w-5 h-5 text-white" }), _jsx("h3", { className: "text-lg font-black italic uppercase tracking-wider text-white", children: "Create Academic Batch" })] }), _jsx("button", { onClick: onClose, className: "p-1 text-gray-400 hover:text-white hover:bg-[#222222] transition-colors rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), error && (_jsx("div", { className: "p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs rounded-sm uppercase", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-3 text-xs font-mono", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Batch Code (e.g. CS-2024) *" }), _jsx("input", { type: "text", value: code, onChange: (e) => setCode(e.target.value), placeholder: "E.G. CS-2026", className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 font-mono text-white focus:outline-none focus:border-white uppercase", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Batch Title *" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "E.G. COMPUTER SCIENCE BATCH 2026", className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase font-sans", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Department" }), _jsxs("select", { value: department, onChange: (e) => setDepartment(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase", children: [_jsx("option", { value: "Computer Science", children: "COMPUTER SCIENCE" }), _jsx("option", { value: "Electrical Engineering", children: "ELECTRICAL ENGINEERING" }), _jsx("option", { value: "Mechanical Engineering", children: "MECHANICAL ENGINEERING" }), _jsx("option", { value: "Business Administration", children: "BUSINESS ADMINISTRATION" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Enrollment Year" }), _jsx("input", { type: "number", value: year, onChange: (e) => setYear(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Current Semester" }), _jsx("input", { type: "number", value: semester, onChange: (e) => setSemester(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Faculty Advisor Name" }), _jsx("input", { type: "text", value: advisorName, onChange: (e) => setAdvisorName(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase font-sans" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-3 border-t border-[#222222]", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 border border-[#333] hover:border-white text-white text-xs font-bold uppercase transition-colors rounded-sm", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: saving, className: "px-5 py-2 bg-white text-black hover:bg-gray-200 text-xs font-black uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors", children: [_jsx(Save, { className: "w-4 h-4" }), saving ? 'Creating...' : 'Create Batch'] })] })] })] }) }));
};
