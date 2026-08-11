export const INITIAL_USERS = [
    {
        id: 'usr-1',
        name: 'Dr. Rajesh Iyer',
        email: 'rajesh.iyer@university.edu',
        role: 'admin',
        avatar: '',
        department: 'Dean of Academic Affairs',
        title: 'Chief Academic Officer'
    },
    {
        id: 'usr-2',
        name: 'Prof. Vikram Sharma',
        email: 'vikram.sharma@university.edu',
        role: 'faculty',
        avatar: '',
        department: 'Computer Science',
        title: 'Senior Associate Professor'
    },
    {
        id: 'usr-3',
        name: 'Prof. Sunita Reddy',
        email: 'sunita.reddy@university.edu',
        role: 'faculty',
        avatar: '',
        department: 'Electrical Engineering',
        title: 'Assistant Professor'
    }
];

export const INITIAL_BATCHES = [
    {
        id: 'batch-1',
        code: 'CS-2024',
        name: 'Computer Science Batch 2024',
        department: 'Computer Science',
        year: 2024,
        semester: 4,
        studentCount: 8,
        advisorId: 'usr-2',
        advisorName: 'Prof. Vikram Sharma',
        status: 'active'
    },
    {
        id: 'batch-2',
        code: 'EE-2024',
        name: 'Electrical Engineering Batch 2024',
        department: 'Electrical Engineering',
        year: 2024,
        semester: 4,
        studentCount: 6,
        advisorId: 'usr-3',
        advisorName: 'Prof. Sunita Reddy',
        status: 'active'
    },
    {
        id: 'batch-3',
        code: 'CS-2025',
        name: 'Computer Science Batch 2025',
        department: 'Computer Science',
        year: 2025,
        semester: 2,
        studentCount: 6,
        advisorId: 'usr-2',
        advisorName: 'Prof. Vikram Sharma',
        status: 'active'
    },
    {
        id: 'batch-4',
        code: 'ME-2023',
        name: 'Mechanical Engineering Batch 2023',
        department: 'Mechanical Engineering',
        year: 2023,
        semester: 6,
        studentCount: 5,
        advisorId: 'usr-1',
        advisorName: 'Dr. Rajesh Iyer',
        status: 'active'
    }
];

export const INITIAL_COURSES = [
    {
        id: 'crs-101',
        code: 'CS101',
        name: 'Data Structures & Algorithms',
        department: 'Computer Science',
        credits: 4,
        facultyId: 'usr-2',
        facultyName: 'Prof. Vikram Sharma',
        batchId: 'batch-1'
    },
    {
        id: 'crs-102',
        code: 'CS102',
        name: 'Full-Stack Web Architecture',
        department: 'Computer Science',
        credits: 3,
        facultyId: 'usr-2',
        facultyName: 'Prof. Vikram Sharma',
        batchId: 'batch-1'
    },
    {
        id: 'crs-201',
        code: 'EE201',
        name: 'Digital Signal Processing',
        department: 'Electrical Engineering',
        credits: 4,
        facultyId: 'usr-3',
        facultyName: 'Prof. Sunita Reddy',
        batchId: 'batch-2'
    },
    {
        id: 'crs-202',
        code: 'EE202',
        name: 'Microcontrollers & IoT Systems',
        department: 'Electrical Engineering',
        credits: 3,
        facultyId: 'usr-3',
        facultyName: 'Prof. Sunita Reddy',
        batchId: 'batch-2'
    },
    {
        id: 'crs-103',
        code: 'CS100',
        name: 'Introduction to Programming (Python)',
        department: 'Computer Science',
        credits: 3,
        facultyId: 'usr-2',
        facultyName: 'Prof. Vikram Sharma',
        batchId: 'batch-3'
    },
    {
        id: 'crs-301',
        code: 'ME301',
        name: 'Fluid Dynamics & Thermodynamics',
        department: 'Mechanical Engineering',
        credits: 4,
        facultyId: 'usr-1',
        facultyName: 'Dr. Rajesh Iyer',
        batchId: 'batch-4'
    }
];

export const INITIAL_STUDENTS = [
    {
        id: 'std-101',
        rollNumber: 'CS2024-001',
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'aarav.sharma@student.edu',
        phone: '+91 98765 43210',
        dateOfBirth: '2003-05-14',
        gender: 'Male',
        batchId: 'batch-1',
        batchName: 'Computer Science Batch 2024',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 3.85,
        guardianName: 'Rajesh Sharma',
        guardianPhone: '+91 98765 11111',
        address: '42 Park Avenue, Indiranagar, Bengaluru, KA',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-102',
        rollNumber: 'CS2024-002',
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@student.edu',
        phone: '+91 98765 43211',
        dateOfBirth: '2003-08-22',
        gender: 'Female',
        batchId: 'batch-1',
        batchName: 'Computer Science Batch 2024',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 3.92,
        guardianName: 'Sanjay Patel',
        guardianPhone: '+91 98765 22222',
        address: '108 CG Road, Navrangpura, Ahmedabad, GJ',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-103',
        rollNumber: 'CS2024-003',
        firstName: 'Karan',
        lastName: 'Verma',
        email: 'karan.verma@student.edu',
        phone: '+91 98765 43212',
        dateOfBirth: '2002-11-03',
        gender: 'Male',
        batchId: 'batch-1',
        batchName: 'Computer Science Batch 2024',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 2.68,
        guardianName: 'Suresh Verma',
        guardianPhone: '+91 98765 33333',
        address: '77 Sector 17, Chandigarh, PB',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-104',
        rollNumber: 'CS2024-004',
        firstName: 'Diya',
        lastName: 'Nair',
        email: 'diya.nair@student.edu',
        phone: '+91 98765 43213',
        dateOfBirth: '2003-01-19',
        gender: 'Female',
        batchId: 'batch-1',
        batchName: 'Computer Science Batch 2024',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 3.70,
        guardianName: 'Ramesh Nair',
        guardianPhone: '+91 98765 44444',
        address: '15 Marine Drive, Kochi, KL',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-105',
        rollNumber: 'CS2024-005',
        firstName: 'Aditya',
        lastName: 'Joshi',
        email: 'aditya.joshi@student.edu',
        phone: '+91 98765 43214',
        dateOfBirth: '2003-04-11',
        gender: 'Male',
        batchId: 'batch-1',
        batchName: 'Computer Science Batch 2024',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 3.45,
        guardianName: 'Prakash Joshi',
        guardianPhone: '+91 98765 55555',
        address: '89 FC Road, Shivaji Nagar, Pune, MH',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-106',
        rollNumber: 'CS2024-006',
        firstName: 'Zara',
        lastName: 'Khan',
        email: 'zara.khan@student.edu',
        phone: '+91 98765 43215',
        dateOfBirth: '2003-09-30',
        gender: 'Female',
        batchId: 'batch-1',
        batchName: 'Computer Science Batch 2024',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 3.60,
        guardianName: 'Tariq Khan',
        guardianPhone: '+91 98765 66666',
        address: '22 Civil Lines, Lucknow, UP',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-107',
        rollNumber: 'CS2024-007',
        firstName: 'Kabir',
        lastName: 'Deshmukh',
        email: 'kabir.deshmukh@student.edu',
        phone: '+91 98765 43216',
        dateOfBirth: '2003-02-14',
        gender: 'Male',
        batchId: 'batch-1',
        batchName: 'Computer Science Batch 2024',
        department: 'Computer Science',
        enrollmentStatus: 'On Leave',
        gpa: 3.10,
        guardianName: 'Mahesh Deshmukh',
        guardianPhone: '+91 98765 77777',
        address: '404 Jubilee Hills, Hyderabad, TS',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-108',
        rollNumber: 'CS2024-008',
        firstName: 'Kavya',
        lastName: 'Singhania',
        email: 'kavya.singhania@student.edu',
        phone: '+91 98765 43217',
        dateOfBirth: '2003-07-08',
        gender: 'Female',
        batchId: 'batch-1',
        batchName: 'Computer Science Batch 2024',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 3.98,
        guardianName: 'Vikram Singhania',
        guardianPhone: '+91 98765 88888',
        address: '12 Salt Lake City, Kolkata, WB',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-201',
        rollNumber: 'EE2024-001',
        firstName: 'Devansh',
        lastName: 'Gupta',
        email: 'devansh.gupta@student.edu',
        phone: '+91 98765 43218',
        dateOfBirth: '2003-03-25',
        gender: 'Male',
        batchId: 'batch-2',
        batchName: 'Electrical Engineering Batch 2024',
        department: 'Electrical Engineering',
        enrollmentStatus: 'Active',
        gpa: 3.78,
        guardianName: 'Sunil Gupta',
        guardianPhone: '+91 98765 99999',
        address: '55 Connaught Place, New Delhi, DL',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-202',
        rollNumber: 'EE2024-002',
        firstName: 'Ananya',
        lastName: 'Roy',
        email: 'ananya.roy@student.edu',
        phone: '+91 98765 43219',
        dateOfBirth: '2003-06-12',
        gender: 'Female',
        batchId: 'batch-2',
        batchName: 'Electrical Engineering Batch 2024',
        department: 'Electrical Engineering',
        enrollmentStatus: 'Active',
        gpa: 3.55,
        guardianName: 'Subhash Roy',
        guardianPhone: '+91 98765 10101',
        address: '300 Park Street, Kolkata, WB',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-203',
        rollNumber: 'EE2024-003',
        firstName: 'Rohan',
        lastName: 'Mehta',
        email: 'rohan.mehta@student.edu',
        phone: '+91 98765 43220',
        dateOfBirth: '2003-10-18',
        gender: 'Male',
        batchId: 'batch-2',
        batchName: 'Electrical Engineering Batch 2024',
        department: 'Electrical Engineering',
        enrollmentStatus: 'Active',
        gpa: 2.50,
        guardianName: 'Anil Mehta',
        guardianPhone: '+91 98765 20202',
        address: '78 SV Road, Bandra, Mumbai, MH',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-204',
        rollNumber: 'EE2024-004',
        firstName: 'Ishita',
        lastName: 'Banerjee',
        email: 'ishita.banerjee@student.edu',
        phone: '+91 98765 43221',
        dateOfBirth: '2003-12-05',
        gender: 'Female',
        batchId: 'batch-2',
        batchName: 'Electrical Engineering Batch 2024',
        department: 'Electrical Engineering',
        enrollmentStatus: 'Active',
        gpa: 3.88,
        guardianName: 'Arup Banerjee',
        guardianPhone: '+91 98765 30303',
        address: '101 Southern Avenue, Kolkata, WB',
        avatarUrl: '',
        createdAt: '2024-08-15'
    },
    {
        id: 'std-301',
        rollNumber: 'CS2025-001',
        firstName: 'Vivaan',
        lastName: 'Chawla',
        email: 'vivaan.chawla@student.edu',
        phone: '+91 98765 43222',
        dateOfBirth: '2004-01-30',
        gender: 'Male',
        batchId: 'batch-3',
        batchName: 'Computer Science Batch 2025',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 3.65,
        guardianName: 'Harpreet Chawla',
        guardianPhone: '+91 98765 40404',
        address: '88 MG Road, Gurugram, HR',
        avatarUrl: '',
        createdAt: '2025-08-20'
    },
    {
        id: 'std-302',
        rollNumber: 'CS2025-002',
        firstName: 'Sneha',
        lastName: 'Kulkarni',
        email: 'sneha.kulkarni@student.edu',
        phone: '+91 98765 43223',
        dateOfBirth: '2004-04-17',
        gender: 'Female',
        batchId: 'batch-3',
        batchName: 'Computer Science Batch 2025',
        department: 'Computer Science',
        enrollmentStatus: 'Active',
        gpa: 3.90,
        guardianName: 'Vijay Kulkarni',
        guardianPhone: '+91 98765 50505',
        address: '234 Law College Road, Pune, MH',
        avatarUrl: '',
        createdAt: '2025-08-20'
    }
];

export function generateSeedAttendance() {
    const records = [];
    const dates = [
        '2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05',
        '2026-08-08', '2026-08-09', '2026-08-10'
    ];
    INITIAL_STUDENTS.forEach((student) => {
        dates.forEach((date, index) => {
            let status = 'Present';
            if (student.id === 'std-103') {
                if (index % 2 === 0)
                    status = 'Absent';
                else if (index === 1)
                    status = 'Late';
            }
            else if (student.id === 'std-203') {
                if (index % 3 === 0)
                    status = 'Absent';
            }
            else {
                if (index === 3 && Math.random() > 0.6)
                    status = 'Late';
                if (index === 6 && Math.random() > 0.8)
                    status = 'Absent';
            }
            records.push({
                id: `att-${student.id}-${date}`,
                studentId: student.id,
                studentName: `${student.firstName} ${student.lastName}`,
                studentRoll: student.rollNumber,
                batchId: student.batchId,
                date,
                status,
                remarks: status === 'Absent' ? 'Unexcused Absence' : status === 'Late' ? 'Arrived 15m late' : '',
                recordedBy: 'Prof. Vikram Sharma'
            });
        });
    });
    return records;
}

export function generateSeedGrades() {
    const grades = [];
    INITIAL_STUDENTS.forEach((student) => {
        const isCs = student.batchId === 'batch-1' || student.batchId === 'batch-3';
        const courseId = isCs ? 'crs-101' : 'crs-201';
        const courseName = isCs ? 'Data Structures & Algorithms' : 'Digital Signal Processing';
        const midtermScore = Math.round(student.gpa * 23 + Math.random() * 5);
        const clampedMidterm = Math.min(100, Math.max(50, midtermScore));
        let letter = 'A';
        if (clampedMidterm >= 90)
            letter = 'A+';
        else if (clampedMidterm >= 80)
            letter = 'A';
        else if (clampedMidterm >= 70)
            letter = 'B';
        else if (clampedMidterm >= 60)
            letter = 'C';
        else
            letter = 'D';
        grades.push({
            id: `grd-${student.id}-midterm`,
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentRoll: student.rollNumber,
            courseId,
            courseName,
            batchId: student.batchId,
            assessmentType: 'Midterm',
            assessmentName: 'Midterm Examination 2026',
            maxScore: 100,
            scoreObtained: clampedMidterm,
            gradeLetter: letter,
            percentage: clampedMidterm,
            remarks: clampedMidterm >= 80 ? 'Excellent analytical understanding' : 'Needs improvement in core topics',
            gradedBy: 'Prof. Vikram Sharma',
            date: '2026-07-20'
        });
        const quizScore = Math.min(20, Math.max(8, Math.round(clampedMidterm / 5)));
        grades.push({
            id: `grd-${student.id}-quiz1`,
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentRoll: student.rollNumber,
            courseId,
            courseName,
            batchId: student.batchId,
            assessmentType: 'Quiz',
            assessmentName: 'Quiz 1: Fundamentals & Theory',
            maxScore: 20,
            scoreObtained: quizScore,
            gradeLetter: quizScore >= 18 ? 'A+' : quizScore >= 15 ? 'A' : 'B',
            percentage: Math.round((quizScore / 20) * 100),
            remarks: 'Completed on time',
            gradedBy: 'Prof. Vikram Sharma',
            date: '2026-06-15'
        });
    });
    return grades;
}

export const INITIAL_LOGS = [
    {
        id: 'log-1',
        timestamp: '2026-08-11 15:35:00',
        userId: 'usr-1',
        userName: 'Dr. Rajesh Iyer',
        role: 'admin',
        action: 'Header Optimization',
        details: 'Consolidated duplicate Faculty role controls in header navigation to display single role selector.'
    },
    {
        id: 'log-2',
        timestamp: '2026-08-11 15:25:00',
        userId: 'usr-1',
        userName: 'Dr. Rajesh Iyer',
        role: 'admin',
        action: 'Privacy & Security',
        details: 'Removed profile photo URLs across student profiles and staff header controls for privacy compliance.'
    },
    {
        id: 'log-3',
        timestamp: '2026-08-11 15:15:00',
        userId: 'usr-1',
        userName: 'Dr. Rajesh Iyer',
        role: 'admin',
        action: 'Demographics Update',
        details: 'Updated student directory and faculty records with Indian regional names, emails, and address details.'
    },
    {
        id: 'log-4',
        timestamp: '2026-08-11 08:30:00',
        userId: 'usr-1',
        userName: 'Dr. Rajesh Iyer',
        role: 'admin',
        action: 'System Maintenance',
        details: 'Verified academic term records and opened Batch 2024 semester grade submission window.'
    },
    {
        id: 'log-5',
        timestamp: '2026-08-10 14:15:22',
        userId: 'usr-2',
        userName: 'Prof. Vikram Sharma',
        role: 'faculty',
        action: 'Attendance Submission',
        details: 'Recorded attendance for Batch CS-2024 (8 students logged).'
    },
    {
        id: 'log-6',
        timestamp: '2026-08-09 11:45:10',
        userId: 'usr-2',
        userName: 'Prof. Vikram Sharma',
        role: 'faculty',
        action: 'Grade Entry',
        details: 'Published Midterm Examination 2026 scores for Data Structures & Algorithms.'
    }
];
