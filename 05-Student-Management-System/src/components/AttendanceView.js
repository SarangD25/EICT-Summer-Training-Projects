import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, HelpCircle, Save, CheckCheck } from 'lucide-react';
export const AttendanceView = ({ students, batches, courses, currentUser, onSaveBulkAttendance, attendanceSummary }) => {
    const [activeTab, setActiveTab] = useState('entry');
    const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
    const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    // Attendance state map for current batch & date
    // Key: studentId -> { status: 'Present' | 'Absent' | 'Late' | 'Excused', remarks: string }
    const [attendanceState, setAttendanceState] = useState({});
    const batchStudents = students.filter(s => s.batchId === selectedBatchId);
    // Initialize attendance state when batch changes
    useEffect(() => {
        const initialState = {};
        batchStudents.forEach(std => {
            initialState[std.id] = { status: 'Present', remarks: '' };
        });
        setAttendanceState(initialState);
    }, [selectedBatchId, students]);
    const handleStatusChange = (studentId, status) => {
        setAttendanceState(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status }
        }));
    };
    const handleRemarksChange = (studentId, remarks) => {
        setAttendanceState(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], remarks }
        }));
    };
    const handleMarkAllPresent = () => {
        const newState = {};
        batchStudents.forEach(std => {
            newState[std.id] = { status: 'Present', remarks: attendanceState[std.id]?.remarks || '' };
        });
        setAttendanceState(newState);
    };
    const handleSave = async () => {
        setSaving(true);
        setSuccessMsg(null);
        const recordsPayload = batchStudents.map(std => ({
            studentId: std.id,
            studentName: `${std.firstName} ${std.lastName}`,
            studentRoll: std.rollNumber,
            status: attendanceState[std.id]?.status || 'Present',
            remarks: attendanceState[std.id]?.remarks || ''
        }));
        try {
            await onSaveBulkAttendance(selectedBatchId, selectedDate, recordsPayload);
            setSuccessMsg(`Attendance for ${batchStudents.length} students logged successfully.`);
            setTimeout(() => setSuccessMsg(null), 4000);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#222222]", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-black italic tracking-tight uppercase text-white", children: "Attendance" }), _jsx("p", { className: "text-xs font-mono text-gray-500 mt-0.5 uppercase tracking-wider", children: "Record daily batch attendance, register overrides, and analyze cumulative presence rates" })] }), _jsxs("div", { className: "flex items-center gap-1 bg-[#181818] p-1 rounded-sm border border-[#222222]", children: [_jsx("button", { onClick: () => setActiveTab('entry'), className: `px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase transition-all ${activeTab === 'entry' ? 'bg-white text-black font-black' : 'text-gray-400 hover:text-white'}`, children: "Attendance Entry" }), _jsx("button", { onClick: () => setActiveTab('summary'), className: `px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase transition-all ${activeTab === 'summary' ? 'bg-white text-black font-black' : 'text-gray-400 hover:text-white'}`, children: "Attendance Summary" })] })] }), activeTab === 'entry' ? (
            /* ATTENDANCE ENTRY FORM */
            _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "bg-[#0F0F0F] border border-[#222222] p-4 rounded-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Batch Cohort" }), _jsx("select", { value: selectedBatchId, onChange: (e) => setSelectedBatchId(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2.5 focus:outline-none focus:border-white uppercase", children: batches.map(b => (_jsxs("option", { value: b.id, children: [b.code, " - ", b.name] }, b.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Session Date" }), _jsx("input", { type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2 focus:outline-none focus:border-white uppercase" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Course Module" }), _jsx("select", { value: selectedCourseId, onChange: (e) => setSelectedCourseId(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2.5 focus:outline-none focus:border-white uppercase", children: courses.map(c => (_jsxs("option", { value: c.id, children: [c.code, " - ", c.name] }, c.id))) })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs("button", { onClick: handleMarkAllPresent, type: "button", className: "w-full py-2.5 px-3 border border-white hover:bg-white hover:text-black text-white text-xs font-bold uppercase transition-colors rounded-sm flex items-center justify-center gap-1.5", children: [_jsx(CheckCheck, { className: "w-3.5 h-3.5" }), "Mark All Present"] }) })] }), successMsg && (_jsxs("div", { className: "p-3 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-xs rounded-sm flex items-center gap-2 uppercase", children: [_jsx(CheckCircle2, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: successMsg })] })), _jsxs("div", { className: "bg-[#0F0F0F] border border-[#222222] rounded-sm overflow-hidden", children: [_jsxs("div", { className: "p-4 bg-[#181818] border-b border-[#222222] flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-white text-sm uppercase", children: ["Batch Roster Checklist (", batchStudents.length, " Students)"] }), _jsx("p", { className: "text-[10px] font-mono text-gray-500 uppercase", children: "Select status for each student and click submit to commit logs." })] }), _jsxs("button", { onClick: handleSave, disabled: saving || batchStudents.length === 0, className: "px-4 py-2 bg-white text-black hover:bg-gray-200 disabled:opacity-50 text-xs font-black uppercase tracking-wider rounded-sm flex items-center gap-2 transition-all", children: [_jsx(Save, { className: "w-4 h-4" }), saving ? 'Saving Logs...' : 'Submit Attendance'] })] }), batchStudents.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-500 font-mono text-xs uppercase", children: "No students enrolled in this batch." })) : (_jsx("div", { className: "divide-y divide-[#181818]", children: batchStudents.map((student) => {
                                    const currentStatus = attendanceState[student.id]?.status || 'Present';
                                    const currentRemarks = attendanceState[student.id]?.remarks || '';
                                    return (_jsxs("div", { className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#181818] transition-colors", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-[200px]", children: [_jsxs("div", { children: [_jsxs("div", { className: "font-bold text-white text-xs", children: [student.firstName, " ", student.lastName] }), _jsx("div", { className: "text-[10px] font-mono text-gray-400", children: student.rollNumber })] })] }), _jsxs("div", { className: "flex items-center gap-1 bg-[#181818] p-1 rounded-sm border border-[#333333]", children: [_jsxs("button", { type: "button", onClick: () => handleStatusChange(student.id, 'Present'), className: `px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 ${currentStatus === 'Present'
                                                            ? 'bg-green-500 text-black'
                                                            : 'text-gray-400 hover:text-white'}`, children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), " Present"] }), _jsxs("button", { type: "button", onClick: () => handleStatusChange(student.id, 'Absent'), className: `px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 ${currentStatus === 'Absent'
                                                            ? 'bg-red-500 text-white'
                                                            : 'text-gray-400 hover:text-white'}`, children: [_jsx(XCircle, { className: "w-3.5 h-3.5" }), " Absent"] }), _jsxs("button", { type: "button", onClick: () => handleStatusChange(student.id, 'Late'), className: `px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 ${currentStatus === 'Late'
                                                            ? 'bg-yellow-500 text-black'
                                                            : 'text-gray-400 hover:text-white'}`, children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), " Late"] }), _jsxs("button", { type: "button", onClick: () => handleStatusChange(student.id, 'Excused'), className: `px-3 py-1.5 rounded-sm text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 ${currentStatus === 'Excused'
                                                            ? 'bg-white text-black'
                                                            : 'text-gray-400 hover:text-white'}`, children: [_jsx(HelpCircle, { className: "w-3.5 h-3.5" }), " Excused"] })] }), _jsx("div", { className: "w-full sm:w-60", children: _jsx("input", { type: "text", placeholder: "Optional remarks...", value: currentRemarks, onChange: (e) => handleRemarksChange(student.id, e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono p-1.5 text-white placeholder-gray-600 focus:outline-none focus:border-white uppercase" }) })] }, student.id));
                                }) }))] })] })) : (
            /* ATTENDANCE SUMMARY & STATS */
            _jsxs("div", { className: "bg-[#0F0F0F] border border-[#222222] rounded-sm overflow-hidden", children: [_jsxs("div", { className: "p-4 bg-[#181818] border-b border-[#222222]", children: [_jsx("h3", { className: "font-bold text-white text-sm uppercase", children: "Institutional Attendance Rates" }), _jsx("p", { className: "text-[10px] font-mono text-gray-500 uppercase", children: "Cumulative presence metrics across recorded sessions." })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-xs font-mono text-gray-300", children: [_jsx("thead", { className: "bg-[#181818] text-gray-400 font-bold uppercase tracking-wider border-b border-[#222222] text-[10px]", children: _jsxs("tr", { children: [_jsx("th", { className: "py-3 px-4", children: "Student" }), _jsx("th", { className: "py-3 px-4", children: "Batch Cohort" }), _jsx("th", { className: "py-3 px-4", children: "Total Sessions" }), _jsx("th", { className: "py-3 px-4", children: "Present" }), _jsx("th", { className: "py-3 px-4", children: "Absent" }), _jsx("th", { className: "py-3 px-4", children: "Late" }), _jsx("th", { className: "py-3 px-4", children: "Presence Rate (%)" })] }) }), _jsx("tbody", { className: "divide-y divide-[#181818]", children: attendanceSummary.map((sum) => (_jsxs("tr", { className: "hover:bg-[#181818] transition-colors", children: [_jsxs("td", { className: "py-3.5 px-4 font-bold text-white", children: [_jsx("div", { children: sum.studentName }), _jsx("div", { className: "text-[10px] text-gray-500 font-mono", children: sum.rollNumber })] }), _jsx("td", { className: "py-3.5 px-4 text-gray-300", children: sum.batchName }), _jsx("td", { className: "py-3.5 px-4", children: sum.totalClasses }), _jsx("td", { className: "py-3.5 px-4 text-green-400 font-bold", children: sum.presentCount }), _jsx("td", { className: "py-3.5 px-4 text-red-400 font-bold", children: sum.absentCount }), _jsx("td", { className: "py-3.5 px-4 text-yellow-400", children: sum.lateCount }), _jsx("td", { className: "py-3.5 px-4", children: _jsxs("span", { className: `px-2 py-0.5 rounded-sm font-bold text-xs ${sum.percentage >= 85
                                                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                                                        : sum.percentage < 75
                                                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'}`, children: [sum.percentage, "%"] }) })] }, sum.studentId))) })] }) })] }))] }));
};
