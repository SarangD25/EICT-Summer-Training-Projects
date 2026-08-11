import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Award, Plus, Filter, Download, Trash2 } from 'lucide-react';
export const GradesView = ({ students, courses, batches, grades, currentUser, onAddGrade, onDeleteGrade }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
    const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
    // New Grade Form State
    const [studentId, setStudentId] = useState(students[0]?.id || '');
    const [courseId, setCourseId] = useState(courses[0]?.id || '');
    const [assessmentType, setAssessmentType] = useState('Midterm');
    const [assessmentName, setAssessmentName] = useState('');
    const [maxScore, setMaxScore] = useState('100');
    const [scoreObtained, setScoreObtained] = useState('');
    const [remarks, setRemarks] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    // Filtered grades list
    const filteredGrades = grades.filter(g => {
        if (selectedCourseFilter !== 'all' && g.courseId !== selectedCourseFilter)
            return false;
        if (selectedBatchFilter !== 'all' && g.batchId !== selectedBatchFilter)
            return false;
        return true;
    });
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!studentId || !courseId || !assessmentName || !scoreObtained) {
            setErrorMsg('Please complete all required fields.');
            return;
        }
        setSaving(true);
        setErrorMsg(null);
        try {
            await onAddGrade({
                studentId,
                courseId,
                assessmentType,
                assessmentName,
                maxScore: Number(maxScore) || 100,
                scoreObtained: Number(scoreObtained),
                remarks,
                gradedBy: currentUser.name
            });
            // Reset form
            setAssessmentName('');
            setScoreObtained('');
            setRemarks('');
            setShowAddForm(false);
        }
        catch (err) {
            setErrorMsg(err.message || 'Failed to record grade');
        }
        finally {
            setSaving(false);
        }
    };
    // Export Grades
    const handleExportCSV = () => {
        const headers = ['Student Name', 'Roll Number', 'Course', 'Assessment', 'Type', 'Score Obtained', 'Max Score', 'Percentage', 'Grade Letter', 'Date'];
        const rows = [headers.join(',')];
        filteredGrades.forEach(g => {
            rows.push([
                `"${g.studentName}"`,
                `"${g.studentRoll}"`,
                `"${g.courseName}"`,
                `"${g.assessmentName}"`,
                `"${g.assessmentType}"`,
                g.scoreObtained,
                g.maxScore,
                `${g.percentage}%`,
                `"${g.gradeLetter}"`,
                `"${g.date}"`
            ].join(','));
        });
        const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grade_sheet_${new Date().toISOString().substring(0, 10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#222222]", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-black italic tracking-tight uppercase text-white", children: "Grades" }), _jsx("p", { className: "text-xs font-mono text-gray-500 mt-0.5 uppercase tracking-wider", children: "Log examination scores, continuous assessments, letter grade assignments, and transcripts" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: handleExportCSV, className: "text-xs border border-white px-3.5 py-2 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors rounded-sm flex items-center gap-2", children: [_jsx(Download, { className: "w-4 h-4" }), "Export Grades"] }), _jsxs("button", { onClick: () => setShowAddForm(!showAddForm), className: "text-xs bg-white text-black px-4 py-2 font-black uppercase tracking-wider hover:bg-gray-200 transition-colors rounded-sm flex items-center gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), showAddForm ? 'Cancel' : 'Add Grade'] })] })] }), showAddForm && (_jsxs("form", { onSubmit: handleFormSubmit, className: "bg-[#0F0F0F] border border-[#222222] p-6 rounded-sm space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-[#222222]", children: [_jsxs("h3", { className: "text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2", children: [_jsx(Award, { className: "w-4 h-4 text-white" }), " Record Assessment Entry"] }), _jsxs("span", { className: "text-xs font-mono text-gray-500 uppercase", children: ["Graded by: ", currentUser.name] })] }), errorMsg && (_jsx("div", { className: "p-3 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs rounded-sm uppercase", children: errorMsg })), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Student" }), _jsx("select", { value: studentId, onChange: (e) => setStudentId(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2.5 focus:outline-none focus:border-white uppercase", children: students.map(s => (_jsxs("option", { value: s.id, children: [s.firstName, " ", s.lastName, " (", s.rollNumber, ")"] }, s.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Course" }), _jsx("select", { value: courseId, onChange: (e) => setCourseId(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2.5 focus:outline-none focus:border-white uppercase", children: courses.map(c => (_jsxs("option", { value: c.id, children: [c.code, " - ", c.name] }, c.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Assessment Type" }), _jsxs("select", { value: assessmentType, onChange: (e) => setAssessmentType(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2.5 focus:outline-none focus:border-white uppercase", children: [_jsx("option", { value: "Midterm", children: "MIDTERM EXAM" }), _jsx("option", { value: "Final", children: "FINAL EXAM" }), _jsx("option", { value: "Assignment", children: "ASSIGNMENT" }), _jsx("option", { value: "Quiz", children: "QUIZ" }), _jsx("option", { value: "Project", children: "PROJECT" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Assessment Title" }), _jsx("input", { type: "text", placeholder: "E.G. MIDTERM EXAM 2026", value: assessmentName, onChange: (e) => setAssessmentName(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2 focus:outline-none focus:border-white uppercase", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Max Score" }), _jsx("input", { type: "number", value: maxScore, onChange: (e) => setMaxScore(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2 focus:outline-none focus:border-white uppercase", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Score Obtained" }), _jsx("input", { type: "number", placeholder: "E.G. 88", value: scoreObtained, onChange: (e) => setScoreObtained(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2 focus:outline-none focus:border-white uppercase", required: true })] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { className: "block text-[10px] font-mono font-bold text-gray-500 uppercase mb-1", children: "Faculty Remarks" }), _jsx("input", { type: "text", placeholder: "E.G. EXCELLENT WORK ON TREE STRUCTURES", value: remarks, onChange: (e) => setRemarks(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white p-2 focus:outline-none focus:border-white uppercase" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAddForm(false), className: "px-4 py-2 border border-[#333] hover:border-white text-white text-xs font-bold uppercase transition-colors rounded-sm", children: "Cancel" }), _jsx("button", { type: "submit", disabled: saving, className: "px-5 py-2 bg-white text-black hover:bg-gray-200 text-xs font-black uppercase tracking-wider rounded-sm transition-colors", children: saving ? 'Saving...' : 'Save Grade Entry' })] })] })), _jsxs("div", { className: "bg-[#0F0F0F] border border-[#222222] p-4 rounded-sm flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Filter, { className: "w-4 h-4 text-gray-500" }), _jsxs("select", { value: selectedCourseFilter, onChange: (e) => setSelectedCourseFilter(e.target.value), className: "bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white px-3 py-1.5 focus:outline-none focus:border-white uppercase", children: [_jsx("option", { value: "all", children: "ALL COURSES" }), courses.map(c => (_jsxs("option", { value: c.id, children: [c.code, " - ", c.name] }, c.id)))] }), _jsxs("select", { value: selectedBatchFilter, onChange: (e) => setSelectedBatchFilter(e.target.value), className: "bg-[#181818] border border-[#333333] rounded-sm text-xs font-mono text-white px-3 py-1.5 focus:outline-none focus:border-white uppercase", children: [_jsx("option", { value: "all", children: "ALL BATCHES" }), batches.map(b => (_jsx("option", { value: b.id, children: b.code }, b.id)))] })] }), _jsxs("span", { className: "text-xs font-mono text-gray-500 uppercase", children: ["SHOWING ", filteredGrades.length, " ENTRIES"] })] }), _jsx("div", { className: "bg-[#0F0F0F] border border-[#222222] rounded-sm overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-left text-xs font-mono text-gray-300", children: [_jsx("thead", { className: "bg-[#181818] text-gray-400 font-bold uppercase tracking-wider border-b border-[#222222] text-[10px]", children: _jsxs("tr", { children: [_jsx("th", { className: "py-3 px-4", children: "Student" }), _jsx("th", { className: "py-3 px-4", children: "Course" }), _jsx("th", { className: "py-3 px-4", children: "Assessment Title" }), _jsx("th", { className: "py-3 px-4", children: "Type" }), _jsx("th", { className: "py-3 px-4", children: "Score / Max" }), _jsx("th", { className: "py-3 px-4", children: "Grade" }), _jsx("th", { className: "py-3 px-4", children: "Date" }), _jsx("th", { className: "py-3 px-4 text-right", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y divide-[#181818]", children: filteredGrades.map((g) => (_jsxs("tr", { className: "hover:bg-[#181818] transition-colors", children: [_jsxs("td", { className: "py-3.5 px-4 font-bold text-white font-sans", children: [_jsx("div", { children: g.studentName }), _jsx("div", { className: "text-[10px] text-gray-500 font-mono", children: g.studentRoll })] }), _jsx("td", { className: "py-3.5 px-4 font-bold text-white", children: g.courseName }), _jsx("td", { className: "py-3.5 px-4 text-gray-300", children: g.assessmentName }), _jsx("td", { className: "py-3.5 px-4", children: _jsx("span", { className: "px-2 py-0.5 rounded-sm bg-[#222] text-gray-300 border border-[#333] uppercase text-[10px]", children: g.assessmentType }) }), _jsxs("td", { className: "py-3.5 px-4 font-mono font-bold text-white", children: [g.scoreObtained, " / ", g.maxScore, " ", _jsxs("span", { className: "text-gray-500 font-normal", children: ["(", g.percentage, "%)"] })] }), _jsx("td", { className: "py-3.5 px-4", children: _jsx("span", { className: `px-2 py-0.5 rounded-sm font-bold text-xs ${g.gradeLetter === 'A+' || g.gradeLetter === 'A'
                                                    ? 'bg-white text-black'
                                                    : g.gradeLetter === 'B' || g.gradeLetter === 'C'
                                                        ? 'bg-yellow-500 text-black'
                                                        : 'bg-red-500 text-white'}`, children: g.gradeLetter }) }), _jsx("td", { className: "py-3.5 px-4 text-gray-400", children: g.date }), _jsx("td", { className: "py-3.5 px-4 text-right", children: _jsx("button", { onClick: () => onDeleteGrade(g.id), className: "p-1.5 text-gray-500 hover:text-red-400 rounded-sm hover:bg-[#222222] transition-colors", title: "Delete Entry", children: _jsx(Trash2, { className: "w-4 h-4" }) }) })] }, g.id))) })] }) }) })] }));
};
