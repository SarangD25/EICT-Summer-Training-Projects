import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { BatchesCoursesView } from './components/BatchesCoursesView';
import { AttendanceView } from './components/AttendanceView';
import { GradesView } from './components/GradesView';
import { ActivityLogsView } from './components/ActivityLogsView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { StudentFormModal } from './components/StudentFormModal';
import { BatchModal } from './components/BatchModal';
import { CourseModal } from './components/CourseModal';
import { PerformanceReportModal } from './components/PerformanceReportModal';
export default function App() {
    const [allUsers, setAllUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    // Search & Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [batchFilter, setBatchFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    // Core Data
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [attendanceSummary, setAttendanceSummary] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    // Modals State
    const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);
    const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [reportStudent, setReportStudent] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    // Load Initial Data from Backend API
    const fetchAllData = async () => {
        try {
            const [usersRes, batchesRes, coursesRes, studentsRes, gradesRes, attSummaryRes, analyticsRes, logsRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/batches'),
                fetch('/api/courses'),
                fetch(`/api/students?search=${encodeURIComponent(searchQuery)}&batchId=${batchFilter}&status=${statusFilter}`),
                fetch('/api/grades'),
                fetch('/api/attendance/summary'),
                fetch('/api/analytics'),
                fetch('/api/activity-logs')
            ]);
            const usersData = await usersRes.json();
            const batchesData = await batchesRes.json();
            const coursesData = await coursesRes.json();
            const studentsData = await studentsRes.json();
            const gradesData = await gradesRes.json();
            const attSummaryData = await attSummaryRes.json();
            const analyticsData = await analyticsRes.json();
            const logsData = await logsRes.json();
            setAllUsers(usersData);
            if (!currentUser && usersData.length > 0) {
                setCurrentUser(usersData[0]); // Default to Admin Dr. Rajesh Iyer
            }
            setBatches(batchesData);
            setCourses(coursesData);
            setStudents(studentsData);
            setGrades(gradesData);
            setAttendanceSummary(attSummaryData);
            setAnalytics(analyticsData);
            setActivityLogs(logsData);
        }
        catch (err) {
            console.error('Error fetching data from API:', err);
        }
    };
    useEffect(() => {
        fetchAllData();
    }, [searchQuery, batchFilter, statusFilter]);
    // Headers for current user context
    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'x-user-id': currentUser?.id || 'usr-1'
    });
    // Switch Active User Role
    const handleSwitchUser = (user) => {
        setCurrentUser(user);
    };
    // Student CRUD
    const handleSaveStudent = async (studentData) => {
        const isEdit = !!studentData.id;
        const url = isEdit ? `/api/students/${studentData.id}` : '/api/students';
        const method = isEdit ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: getHeaders(),
            body: JSON.stringify(studentData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to save student');
        }
        await fetchAllData();
    };
    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm('Are you sure you want to remove this student record?'))
            return;
        const res = await fetch(`/api/students/${studentId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.ok) {
            await fetchAllData();
        }
    };
    const handleUpdateStudentStatus = async (studentId, enrollmentStatus) => {
        await fetch(`/api/students/${studentId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ enrollmentStatus })
        });
        if (selectedStudentProfile && selectedStudentProfile.id === studentId) {
            setSelectedStudentProfile({ ...selectedStudentProfile, enrollmentStatus });
        }
        await fetchAllData();
    };
    // View Student Profile Detail
    const handleSelectStudentProfile = async (studentId) => {
        try {
            const res = await fetch(`/api/students/${studentId}`);
            const data = await res.json();
            setSelectedStudentProfile(data);
        }
        catch (err) {
            console.error('Error fetching student profile detail:', err);
        }
    };
    // Batch & Course CRUD
    const handleCreateBatch = async (batchData) => {
        const res = await fetch('/api/batches', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(batchData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to create batch');
        }
        await fetchAllData();
    };
    const handleDeleteBatch = async (batchId) => {
        if (!window.confirm('Are you sure you want to delete this batch?'))
            return;
        const res = await fetch(`/api/batches/${batchId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) {
            const err = await res.json();
            alert(err.error);
            return;
        }
        await fetchAllData();
    };
    const handleCreateCourse = async (courseData) => {
        const res = await fetch('/api/courses', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(courseData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to create course');
        }
        await fetchAllData();
    };
    // Attendance Bulk Save
    const handleSaveBulkAttendance = async (batchId, date, records) => {
        const res = await fetch('/api/attendance/bulk', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                batchId,
                date,
                records,
                recordedBy: currentUser?.name || 'Faculty Member'
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to record attendance');
        }
        await fetchAllData();
    };
    // Grades CRUD
    const handleAddGrade = async (gradeData) => {
        const res = await fetch('/api/grades', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(gradeData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to add grade');
        }
        await fetchAllData();
    };
    const handleDeleteGrade = async (gradeId) => {
        if (!window.confirm('Delete this grade entry?'))
            return;
        const res = await fetch(`/api/grades/${gradeId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.ok) {
            await fetchAllData();
        }
    };
    // Student Performance Report
    const handleOpenPerformanceReport = async (student) => {
        setReportStudent(student);
        setReportData(null);
        setReportLoading(true);
        try {
            const res = await fetch('/api/student-report', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ studentId: student.id })
            });
            const report = await res.json();
            setReportData(report);
        }
        catch (err) {
            console.error('Error generating performance report:', err);
        }
        finally {
            setReportLoading(false);
        }
    };
    if (!currentUser) {
        return (_jsx("div", { className: "min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center text-sm", children: "Loading Student Management System..." }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col", children: [_jsx(Navbar, { currentUser: currentUser, allUsers: allUsers, onSwitchUser: handleSwitchUser, searchQuery: searchQuery, onSearchChange: setSearchQuery }), _jsxs("div", { className: "flex-1 flex max-w-7xl w-full mx-auto", children: [_jsx(Sidebar, { activeTab: activeTab, onTabChange: setActiveTab, userRole: currentUser.role, lowAttendanceCount: analytics?.lowAttendanceCount || 0 }), _jsxs("main", { className: "flex-1 p-6 overflow-y-auto", children: [activeTab === 'dashboard' && analytics && (_jsx(DashboardView, { analytics: analytics, onSelectStudent: handleSelectStudentProfile, onNavigateTab: setActiveTab, onOpenPerformanceReport: handleOpenPerformanceReport })), activeTab === 'students' && (_jsx(StudentsView, { students: students, batches: batches, userRole: currentUser.role, searchQuery: searchQuery, onSearchChange: setSearchQuery, selectedBatchFilter: batchFilter, onBatchFilterChange: setBatchFilter, selectedStatusFilter: statusFilter, onStatusFilterChange: setStatusFilter, onOpenAddModal: () => {
                                    setEditingStudent(null);
                                    setIsStudentFormOpen(true);
                                }, onOpenEditModal: (std) => {
                                    setEditingStudent(std);
                                    setIsStudentFormOpen(true);
                                }, onDeleteStudent: handleDeleteStudent, onSelectStudent: handleSelectStudentProfile, onOpenPerformanceReport: handleOpenPerformanceReport })), activeTab === 'batches' && (_jsx(BatchesCoursesView, { batches: batches, courses: courses, userRole: currentUser.role, onOpenAddBatchModal: () => setIsBatchModalOpen(true), onOpenAddCourseModal: () => setIsCourseModalOpen(true), onDeleteBatch: handleDeleteBatch })), activeTab === 'attendance' && (_jsx(AttendanceView, { students: students, batches: batches, courses: courses, currentUser: currentUser, onSaveBulkAttendance: handleSaveBulkAttendance, attendanceSummary: attendanceSummary })), activeTab === 'grades' && (_jsx(GradesView, { students: students, courses: courses, batches: batches, grades: grades, currentUser: currentUser, onAddGrade: handleAddGrade, onDeleteGrade: handleDeleteGrade })), activeTab === 'logs' && (_jsx(ActivityLogsView, { logs: activityLogs }))] })] }), _jsx(StudentProfileModal, { student: selectedStudentProfile, onClose: () => setSelectedStudentProfile(null), userRole: currentUser.role, onUpdateStatus: handleUpdateStudentStatus, onOpenPerformanceReport: handleOpenPerformanceReport }), _jsx(StudentFormModal, { isOpen: isStudentFormOpen, onClose: () => setIsStudentFormOpen(false), onSubmit: handleSaveStudent, initialData: editingStudent, batches: batches }), _jsx(BatchModal, { isOpen: isBatchModalOpen, onClose: () => setIsBatchModalOpen(false), onSubmit: handleCreateBatch }), _jsx(CourseModal, { isOpen: isCourseModalOpen, onClose: () => setIsCourseModalOpen(false), onSubmit: handleCreateCourse, batches: batches }), _jsx(PerformanceReportModal, { isOpen: !!reportStudent, onClose: () => setReportStudent(null), student: reportStudent, reportData: reportData, loading: reportLoading })] }));
}
