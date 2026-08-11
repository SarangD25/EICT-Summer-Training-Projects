import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { X, BookOpen, Save } from 'lucide-react';
export const CourseModal = ({ isOpen, onClose, onSubmit, batches }) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('Computer Science');
    const [credits, setCredits] = useState('4');
    const [facultyName, setFacultyName] = useState('Prof. Vikram Sharma');
    const [batchId, setBatchId] = useState(batches[0]?.id || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code || !name) {
            setError('Please fill in Course Code and Name.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onSubmit({
                code,
                name,
                department,
                credits: Number(credits) || 3,
                facultyName,
                batchId
            });
            onClose();
        }
        catch (err) {
            setError(err.message || 'Failed to create course');
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-[#0F0F0F] border border-[#222222] rounded-sm max-w-md w-full p-6 shadow-2xl relative text-white space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-[#222222]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BookOpen, { className: "w-5 h-5 text-white" }), _jsx("h3", { className: "text-lg font-black italic uppercase tracking-wider text-white", children: "Add Course to Catalog" })] }), _jsx("button", { onClick: onClose, className: "p-1 text-gray-400 hover:text-white hover:bg-[#222222] transition-colors rounded-sm", children: _jsx(X, { className: "w-5 h-5" }) })] }), error && (_jsx("div", { className: "p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs rounded-sm uppercase", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-3 text-xs font-mono", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Course Code (e.g. CS101) *" }), _jsx("input", { type: "text", value: code, onChange: (e) => setCode(e.target.value), placeholder: "E.G. CS204", className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 font-mono text-white focus:outline-none focus:border-white uppercase", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Course Title *" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "E.G. OPERATING SYSTEMS & KERNEL DESIGN", className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase font-sans", required: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Department" }), _jsxs("select", { value: department, onChange: (e) => setDepartment(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase", children: [_jsx("option", { value: "Computer Science", children: "COMPUTER SCIENCE" }), _jsx("option", { value: "Electrical Engineering", children: "ELECTRICAL ENGINEERING" }), _jsx("option", { value: "Mechanical Engineering", children: "MECHANICAL ENGINEERING" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Credit Hours" }), _jsx("input", { type: "number", value: credits, onChange: (e) => setCredits(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Target Batch" }), _jsx("select", { value: batchId, onChange: (e) => setBatchId(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase", children: batches.map(b => (_jsxs("option", { value: b.id, children: [b.code, " - ", b.name] }, b.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Assigned Faculty Instructor" }), _jsx("input", { type: "text", value: facultyName, onChange: (e) => setFacultyName(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase font-sans" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-3 border-t border-[#222222]", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 border border-[#333] hover:border-white text-white text-xs font-bold uppercase transition-colors rounded-sm", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: saving, className: "px-5 py-2 bg-white text-black hover:bg-gray-200 text-xs font-black uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors", children: [_jsx(Save, { className: "w-4 h-4" }), saving ? 'Saving...' : 'Add Course'] })] })] })] }) }));
};
