import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
export const StudentFormModal = ({ isOpen, onClose, onSubmit, initialData, batches }) => {
    const [rollNumber, setRollNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('2004-01-01');
    const [gender, setGender] = useState('Male');
    const [batchId, setBatchId] = useState('');
    const [department, setDepartment] = useState('Computer Science');
    const [enrollmentStatus, setEnrollmentStatus] = useState('Active');
    const [gpa, setGpa] = useState('3.50');
    const [guardianName, setGuardianName] = useState('');
    const [guardianPhone, setGuardianPhone] = useState('');
    const [address, setAddress] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (initialData) {
            setRollNumber(initialData.rollNumber);
            setFirstName(initialData.firstName);
            setLastName(initialData.lastName);
            setEmail(initialData.email);
            setPhone(initialData.phone);
            setDateOfBirth(initialData.dateOfBirth);
            setGender(initialData.gender);
            setBatchId(initialData.batchId);
            setDepartment(initialData.department);
            setEnrollmentStatus(initialData.enrollmentStatus);
            setGpa(initialData.gpa.toString());
            setGuardianName(initialData.guardianName || '');
            setGuardianPhone(initialData.guardianPhone || '');
            setAddress(initialData.address || '');
        }
        else {
            setRollNumber(`CS2024-${Math.floor(100 + Math.random() * 900)}`);
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setDateOfBirth('2004-01-01');
            setGender('Male');
            setBatchId(batches[0]?.id || '');
            setDepartment(batches[0]?.department || 'Computer Science');
            setEnrollmentStatus('Active');
            setGpa('3.50');
            setGuardianName('');
            setGuardianPhone('');
            setAddress('');
        }
    }, [initialData, batches, isOpen]);
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !rollNumber || !batchId) {
            setError('Please fill in all mandatory fields.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            await onSubmit({
                id: initialData?.id,
                rollNumber,
                firstName,
                lastName,
                email,
                phone,
                dateOfBirth,
                gender,
                batchId,
                department,
                enrollmentStatus,
                gpa: Number(gpa) || 3.5,
                guardianName,
                guardianPhone,
                address
            });
            onClose();
        }
        catch (err) {
            setError(err.message || 'Failed to save student record');
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto", children: _jsxs("div", { className: "bg-[#0F0F0F] border border-[#222222] rounded-sm max-w-2xl w-full p-6 shadow-2xl relative text-white space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-[#222222]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(UserPlus, { className: "w-5 h-5 text-white" }), _jsx("h3", { className: "text-lg font-black italic uppercase tracking-wider text-white", children: initialData ? 'Edit Student Profile' : 'Enroll New Student' })] }), _jsx("button", { onClick: onClose, className: "p-1 rounded-sm text-gray-400 hover:text-white hover:bg-[#222222] transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), error && (_jsx("div", { className: "p-3 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs rounded-sm uppercase", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 font-mono", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Roll Number *" }), _jsx("input", { type: "text", value: rollNumber, onChange: (e) => setRollNumber(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white font-mono focus:outline-none focus:border-white uppercase", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Batch Assignment *" }), _jsx("select", { value: batchId, onChange: (e) => {
                                                setBatchId(e.target.value);
                                                const b = batches.find(x => x.id === e.target.value);
                                                if (b)
                                                    setDepartment(b.department);
                                            }, className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase", required: true, children: batches.map(b => (_jsxs("option", { value: b.id, children: [b.code, " - ", b.name] }, b.id))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "First Name *" }), _jsx("input", { type: "text", value: firstName, onChange: (e) => setFirstName(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase font-sans", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Last Name *" }), _jsx("input", { type: "text", value: lastName, onChange: (e) => setLastName(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase font-sans", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Email Address *" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Phone Number" }), _jsx("input", { type: "text", value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Date of Birth" }), _jsx("input", { type: "date", value: dateOfBirth, onChange: (e) => setDateOfBirth(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Enrollment Status" }), _jsxs("select", { value: enrollmentStatus, onChange: (e) => setEnrollmentStatus(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase", children: [_jsx("option", { value: "Active", children: "ACTIVE" }), _jsx("option", { value: "On Leave", children: "ON LEAVE" }), _jsx("option", { value: "Suspended", children: "SUSPENDED" }), _jsx("option", { value: "Graduated", children: "GRADUATED" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Cumulative GPA" }), _jsx("input", { type: "number", step: "0.01", min: "0", max: "4.0", value: gpa, onChange: (e) => setGpa(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Guardian Name" }), _jsx("input", { type: "text", value: guardianName, onChange: (e) => setGuardianName(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase font-sans" })] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { className: "block text-[10px] font-bold text-gray-500 uppercase mb-1", children: "Residential Address" }), _jsx("input", { type: "text", value: address, onChange: (e) => setAddress(e.target.value), className: "w-full bg-[#181818] border border-[#333333] rounded-sm p-2 text-white focus:outline-none focus:border-white uppercase" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-3 border-t border-[#222222]", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 border border-[#333] hover:border-white text-white text-xs font-bold uppercase transition-colors rounded-sm", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: saving, className: "px-5 py-2 bg-white text-black hover:bg-gray-200 text-xs font-black uppercase tracking-wider rounded-sm flex items-center gap-2 transition-colors", children: [_jsx(Save, { className: "w-4 h-4" }), saving ? 'Saving...' : 'Save Student Record'] })] })] })] }) }));
};
