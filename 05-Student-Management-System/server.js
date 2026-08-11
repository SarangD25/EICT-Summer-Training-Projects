try {
  process.loadEnvFile();
} catch (err) {
  // .env is optional or file not found
}

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_BATCHES,
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  generateSeedAttendance,
  generateSeedGrades,
  INITIAL_LOGS
} from './src/serverData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'youthmatrix'
};

let pool;

async function setupDatabase() {
  // First connect without selecting a database so the app can create it.
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  await connection.end();

  pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10
  });

  await createTables();
  await seedDatabase();
}

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      role VARCHAR(20) NOT NULL,
      avatar TEXT,
      department VARCHAR(150),
      title VARCHAR(150)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS batches (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(30) NOT NULL,
      name VARCHAR(150) NOT NULL,
      department VARCHAR(100) NOT NULL,
      year INT,
      semester INT,
      advisor_id VARCHAR(50),
      advisor_name VARCHAR(100),
      status VARCHAR(20) DEFAULT 'active'
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(50) PRIMARY KEY,
      code VARCHAR(30) NOT NULL,
      name VARCHAR(150) NOT NULL,
      department VARCHAR(100),
      credits INT DEFAULT 3,
      faculty_id VARCHAR(50),
      faculty_name VARCHAR(100),
      batch_id VARCHAR(50)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id VARCHAR(50) PRIMARY KEY,
      roll_number VARCHAR(50) NOT NULL UNIQUE,
      first_name VARCHAR(80) NOT NULL,
      last_name VARCHAR(80) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      phone VARCHAR(40),
      date_of_birth DATE,
      gender VARCHAR(20),
      batch_id VARCHAR(50),
      department VARCHAR(100),
      enrollment_status VARCHAR(30) DEFAULT 'Active',
      gpa DECIMAL(4,2) DEFAULT 0,
      guardian_name VARCHAR(100),
      guardian_phone VARCHAR(40),
      address TEXT,
      avatar_url TEXT,
      created_at DATE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id VARCHAR(100) PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      batch_id VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      status VARCHAR(20) NOT NULL,
      remarks VARCHAR(255),
      recorded_by VARCHAR(100)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS grades (
      id VARCHAR(100) PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      course_id VARCHAR(50) NOT NULL,
      batch_id VARCHAR(50),
      assessment_type VARCHAR(30),
      assessment_name VARCHAR(150),
      max_score DECIMAL(6,2),
      score_obtained DECIMAL(6,2),
      grade_letter VARCHAR(5),
      percentage DECIMAL(6,2),
      remarks VARCHAR(255),
      graded_by VARCHAR(100),
      date DATE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id VARCHAR(100) PRIMARY KEY,
      timestamp DATETIME NOT NULL,
      user_id VARCHAR(50),
      user_name VARCHAR(100),
      role VARCHAR(30),
      action VARCHAR(100),
      details TEXT
    )
  `);
}

async function seedDatabase() {
  const [[oldCheck]] = await pool.query("SELECT COUNT(*) AS count FROM students WHERE first_name IN ('Liam', 'Ethan', 'Maya', 'Chloe', 'Daniel', 'Sophia', 'Benjamin', 'Lucas') OR email LIKE '%@student.edu'");
  const [[userCheck]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE name LIKE '%Eleanor%' OR name LIKE '%Marcus%'");

  if (Number(oldCheck?.count) > 0 || Number(userCheck?.count) > 0) {
    console.log('Clearing old sample data and re-seeding with updated data...');
    await pool.query('DELETE FROM activity_logs');
    await pool.query('DELETE FROM grades');
    await pool.query('DELETE FROM attendance');
    await pool.query('DELETE FROM students');
    await pool.query('DELETE FROM courses');
    await pool.query('DELETE FROM batches');
    await pool.query('DELETE FROM users');
  }

  await pool.query("UPDATE students SET avatar_url = ''");
  await pool.query("UPDATE users SET avatar = ''");

  // Always keep activity logs in sync safely
  for (const log of INITIAL_LOGS) {
    await pool.query(
      `INSERT INTO activity_logs (id, timestamp, user_id, user_name, role, action, details)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE timestamp=VALUES(timestamp), user_id=VALUES(user_id), user_name=VALUES(user_name), role=VALUES(role), action=VALUES(action), details=VALUES(details)`,
      [log.id, log.timestamp, log.userId, log.userName, log.role, log.action, log.details]
    );
  }

  const [[countRow]] = await pool.query('SELECT COUNT(*) AS count FROM students');
  if (Number(countRow.count) > 0) return;

  console.log('Adding sample data to MySQL...');

  for (const user of INITIAL_USERS) {
    await pool.query(
      `INSERT INTO users (id, name, email, role, avatar, department, title)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email)`,
      [user.id, user.name, user.email, user.role, user.avatar, user.department, user.title]
    );
  }

  for (const batch of INITIAL_BATCHES) {
    await pool.query(
      `INSERT INTO batches (id, code, name, department, year, semester, advisor_id, advisor_name, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [batch.id, batch.code, batch.name, batch.department, batch.year, batch.semester,
       batch.advisorId || null, batch.advisorName || null, batch.status]
    );
  }

  for (const course of INITIAL_COURSES) {
    await pool.query(
      `INSERT INTO courses (id, code, name, department, credits, faculty_id, faculty_name, batch_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [course.id, course.code, course.name, course.department, course.credits,
       course.facultyId, course.facultyName, course.batchId]
    );
  }

  for (const student of INITIAL_STUDENTS) {
    await pool.query(
      `INSERT INTO students
       (id, roll_number, first_name, last_name, email, phone, date_of_birth, gender,
        batch_id, department, enrollment_status, gpa, guardian_name, guardian_phone,
        address, avatar_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), last_name=VALUES(last_name)`,
      [student.id, student.rollNumber, student.firstName, student.lastName, student.email,
       student.phone, student.dateOfBirth, student.gender, student.batchId, student.department,
       student.enrollmentStatus, student.gpa, student.guardianName, student.guardianPhone,
       student.address, student.avatarUrl || '', student.createdAt]
    );
  }

  for (const record of generateSeedAttendance()) {
    await pool.query(
      `INSERT INTO attendance
       (id, student_id, batch_id, date, status, remarks, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE status=VALUES(status)`,
      [record.id, record.studentId, record.batchId, record.date, record.status,
       record.remarks || '', record.recordedBy]
    );
  }

  for (const grade of generateSeedGrades()) {
    await pool.query(
      `INSERT INTO grades
       (id, student_id, course_id, batch_id, assessment_type, assessment_name,
        max_score, score_obtained, grade_letter, percentage, remarks, graded_by, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE score_obtained=VALUES(score_obtained)`,
      [grade.id, grade.studentId, grade.courseId, grade.batchId, grade.assessmentType,
       grade.assessmentName, grade.maxScore, grade.scoreObtained, grade.gradeLetter,
       grade.percentage, grade.remarks || '', grade.gradedBy, grade.date]
    );
  }
}

function currentUserId(req, fallback = 'usr-1') {
  return req.headers['x-user-id'] || fallback;
}

async function addActivityLog(userId, action, details) {
  const [[user]] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);
  const fallback = user || INITIAL_USERS[0];
  const id = `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  await pool.query(
    `INSERT INTO activity_logs
     (id, timestamp, user_id, user_name, role, action, details)
     VALUES (?, NOW(), ?, ?, ?, ?, ?)`,
    [id, fallback.id, fallback.name, fallback.role, action, details]
  );
}

function studentFromRow(row) {
  return {
    id: row.id,
    rollNumber: row.roll_number,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone || '',
    dateOfBirth: row.date_of_birth ? String(row.date_of_birth).substring(0, 10) : '',
    gender: row.gender,
    batchId: row.batch_id,
    batchName: row.batch_name || 'Unassigned Batch',
    department: row.department,
    enrollmentStatus: row.enrollment_status,
    gpa: Number(row.gpa),
    guardianName: row.guardian_name || '',
    guardianPhone: row.guardian_phone || '',
    address: row.address || '',
    avatarUrl: row.avatar_url || '',
    createdAt: row.created_at ? String(row.created_at).substring(0, 10) : ''
  };
}

async function getStudents(where = '', params = []) {
  const [rows] = await pool.query(
    `SELECT s.*, b.name AS batch_name
     FROM students s
     LEFT JOIN batches b ON s.batch_id = b.id
     ${where}
     ORDER BY s.id`,
    params
  );
  return rows.map(studentFromRow);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'mysql', timestamp: new Date().toISOString() });
});

app.get('/api/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM users ORDER BY id');
  res.json(rows.map(row => ({
    id: row.id, name: row.name, email: row.email, role: row.role,
    avatar: row.avatar, department: row.department, title: row.title
  })));
});

app.get('/api/batches', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT b.*, COUNT(s.id) AS student_count
    FROM batches b
    LEFT JOIN students s ON b.id = s.batch_id
    GROUP BY b.id
    ORDER BY b.id
  `);
  res.json(rows.map(row => ({
    id: row.id, code: row.code, name: row.name, department: row.department,
    year: Number(row.year), semester: Number(row.semester), studentCount: Number(row.student_count),
    advisorId: row.advisor_id, advisorName: row.advisor_name, status: row.status
  })));
});

app.post('/api/batches', async (req, res) => {
  const { code, name, department, year, semester, advisorId, advisorName } = req.body;
  if (!code || !name || !department) return res.status(400).json({ error: 'Code, name, and department are required' });

  const id = `batch-${Date.now()}`;
  await pool.query(
    `INSERT INTO batches (id, code, name, department, year, semester, advisor_id, advisor_name, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
    [id, code.toUpperCase(), name, department, Number(year) || new Date().getFullYear(),
     Number(semester) || 1, advisorId || null, advisorName || 'Unassigned']
  );

  await addActivityLog(currentUserId(req), 'Created Batch', `Created new batch: ${name} (${code.toUpperCase()})`);
  res.status(201).json({ id, code: code.toUpperCase(), name, department, year: Number(year) || new Date().getFullYear(), semester: Number(semester) || 1, studentCount: 0, advisorId, advisorName: advisorName || 'Unassigned', status: 'active' });
});

app.put('/api/batches/:id', async (req, res) => {
  const { id } = req.params;
  const [[oldBatch]] = await pool.query('SELECT * FROM batches WHERE id = ?', [id]);
  if (!oldBatch) return res.status(404).json({ error: 'Batch not found' });

  const fields = ['code', 'name', 'department', 'year', 'semester', 'advisor_id', 'advisor_name', 'status'];
  const values = [];
  const sets = [];
  const map = { code: 'code', name: 'name', department: 'department', year: 'year', semester: 'semester', advisorId: 'advisor_id', advisorName: 'advisor_name', status: 'status' };

  for (const key of Object.keys(map)) {
    if (req.body[key] !== undefined) {
      sets.push(`${map[key]} = ?`);
      values.push(req.body[key]);
    }
  }
  if (sets.length) {
    values.push(id);
    await pool.query(`UPDATE batches SET ${sets.join(', ')} WHERE id = ?`, values);
  }

  const [[updated]] = await pool.query('SELECT * FROM batches WHERE id = ?', [id]);
  await addActivityLog(currentUserId(req), 'Updated Batch', `Updated batch details for ${updated.name}`);
  res.json({ ...updated, studentCount: 0, advisorId: updated.advisor_id, advisorName: updated.advisor_name });
});

app.delete('/api/batches/:id', async (req, res) => {
  const { id } = req.params;
  const [[batch]] = await pool.query('SELECT * FROM batches WHERE id = ?', [id]);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });

  const [[count]] = await pool.query('SELECT COUNT(*) AS count FROM students WHERE batch_id = ?', [id]);
  if (Number(count.count) > 0) return res.status(400).json({ error: `Cannot delete batch '${batch.name}'. Remove or reassign its ${count.count} students first.` });

  await pool.query('DELETE FROM batches WHERE id = ?', [id]);
  await addActivityLog(currentUserId(req), 'Deleted Batch', `Deleted batch ${batch.name}`);
  res.json({ success: true, deletedId: id });
});

app.get('/api/courses', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM courses ORDER BY id');
  res.json(rows.map(row => ({
    id: row.id, code: row.code, name: row.name, department: row.department,
    credits: Number(row.credits), facultyId: row.faculty_id, facultyName: row.faculty_name, batchId: row.batch_id
  })));
});

app.post('/api/courses', async (req, res) => {
  const { code, name, department, credits, facultyId, facultyName, batchId } = req.body;
  if (!code || !name) return res.status(400).json({ error: 'Course code and name are required' });
  const id = `crs-${Date.now()}`;
  const course = {
    id, code: code.toUpperCase(), name, department: department || 'General', credits: Number(credits) || 3,
    facultyId: facultyId || 'usr-2', facultyName: facultyName || 'Prof. Marcus Chen', batchId: batchId || 'batch-1'
  };
  await pool.query(
    `INSERT INTO courses (id, code, name, department, credits, faculty_id, faculty_name, batch_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, course.code, course.name, course.department, course.credits, course.facultyId, course.facultyName, course.batchId]
  );
  await addActivityLog(currentUserId(req), 'Created Course', `Created course ${course.code}: ${course.name}`);
  res.status(201).json(course);
});

app.get('/api/students', async (req, res) => {
  const { search, batchId, department, status } = req.query;
  const conditions = [];
  const params = [];
  if (search) {
    conditions.push('(s.first_name LIKE ? OR s.last_name LIKE ? OR s.roll_number LIKE ? OR s.email LIKE ?)');
    const q = `%${search}%`;
    params.push(q, q, q, q);
  }
  if (batchId && batchId !== 'all') { conditions.push('s.batch_id = ?'); params.push(batchId); }
  if (department && department !== 'all') { conditions.push('s.department = ?'); params.push(department); }
  if (status && status !== 'all') { conditions.push('s.enrollment_status = ?'); params.push(status); }
  const students = await getStudents(conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params);
  res.json(students);
});

app.get('/api/students/:id', async (req, res) => {
  const students = await getStudents('WHERE s.id = ?', [req.params.id]);
  if (!students.length) return res.status(404).json({ error: 'Student not found' });
  const student = students[0];

  const [attendance] = await pool.query(
    `SELECT a.*, CONCAT(s.first_name, ' ', s.last_name) AS studentName, s.roll_number AS studentRoll
     FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.student_id = ? ORDER BY a.date`,
    [req.params.id]
  );
  const [grades] = await pool.query(
    `SELECT g.*, CONCAT(s.first_name, ' ', s.last_name) AS studentName, s.roll_number AS studentRoll,
            c.name AS courseName
     FROM grades g JOIN students s ON g.student_id = s.id
     LEFT JOIN courses c ON g.course_id = c.id WHERE g.student_id = ? ORDER BY g.date DESC`,
    [req.params.id]
  );

  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
  const attendanceRate = totalClasses ? Math.round((presentCount / totalClasses) * 100) : 100;
  res.json({ ...student, attendanceRate, totalClasses, grades: grades.map(formatGrade), attendanceHistory: attendance.map(formatAttendance) });
});

app.post('/api/students', async (req, res) => {
  const { rollNumber, firstName, lastName, email, phone, dateOfBirth, gender, batchId, department, enrollmentStatus, gpa, guardianName, guardianPhone, address } = req.body;
  if (!rollNumber || !firstName || !lastName || !email || !batchId) return res.status(400).json({ error: 'Roll number, First Name, Last Name, Email, and Batch are required.' });

  const [[duplicate]] = await pool.query('SELECT id FROM students WHERE LOWER(roll_number) = LOWER(?) OR LOWER(email) = LOWER(?)', [rollNumber, email]);
  if (duplicate) return res.status(400).json({ error: 'A student with this roll number or email already exists.' });

  const [[batch]] = await pool.query('SELECT * FROM batches WHERE id = ?', [batchId]);
  if (!batch) return res.status(400).json({ error: 'Selected batch does not exist.' });

  const id = `std-${Date.now()}`;
  const student = {
    id, rollNumber, firstName, lastName, email, phone: phone || '', dateOfBirth: dateOfBirth || '2004-01-01',
    gender: gender || 'Other', batchId, batchName: batch.name, department: department || batch.department,
    enrollmentStatus: enrollmentStatus || 'Active', gpa: Number(gpa) || 3.5, guardianName: guardianName || '',
    guardianPhone: guardianPhone || '', address: address || '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString().slice(0, 10)
  };

  await pool.query(
    `INSERT INTO students
     (id, roll_number, first_name, last_name, email, phone, date_of_birth, gender, batch_id, department,
      enrollment_status, gpa, guardian_name, guardian_phone, address, avatar_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [student.id, student.rollNumber, student.firstName, student.lastName, student.email, student.phone,
     student.dateOfBirth, student.gender, student.batchId, student.department, student.enrollmentStatus,
     student.gpa, student.guardianName, student.guardianPhone, student.address, student.avatarUrl, student.createdAt]
  );

  await addActivityLog(currentUserId(req), 'Student Enrolled', `Registered new student ${firstName} ${lastName} (${rollNumber}) in ${batch.name}`);
  res.status(201).json(student);
});

app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const [[existing]] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
  if (!existing) return res.status(404).json({ error: 'Student not found' });

  const fields = {
    rollNumber: 'roll_number', firstName: 'first_name', lastName: 'last_name', email: 'email', phone: 'phone',
    dateOfBirth: 'date_of_birth', gender: 'gender', batchId: 'batch_id', department: 'department',
    enrollmentStatus: 'enrollment_status', gpa: 'gpa', guardianName: 'guardian_name', guardianPhone: 'guardian_phone', address: 'address'
  };
  const sets = [];
  const values = [];
  for (const [key, column] of Object.entries(fields)) {
    if (req.body[key] !== undefined) { sets.push(`${column} = ?`); values.push(req.body[key]); }
  }
  if (req.body.batchId) {
    const [[batch]] = await pool.query('SELECT name FROM batches WHERE id = ?', [req.body.batchId]);
    if (batch) { sets.push('department = ?'); values.push(req.body.department || existing.department); }
  }
  if (sets.length) { values.push(id); await pool.query(`UPDATE students SET ${sets.join(', ')} WHERE id = ?`, values); }

  const students = await getStudents('WHERE s.id = ?', [id]);
  const updated = students[0];
  await addActivityLog(currentUserId(req), 'Updated Student Record', `Updated record for ${updated.firstName} ${updated.lastName} (${updated.rollNumber})`);
  res.json(updated);
});

app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const [[student]] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  await pool.query('DELETE FROM attendance WHERE student_id = ?', [id]);
  await pool.query('DELETE FROM grades WHERE student_id = ?', [id]);
  await pool.query('DELETE FROM students WHERE id = ?', [id]);
  await addActivityLog(currentUserId(req), 'Deleted Student', `Removed student record for ${student.first_name} ${student.last_name} (${student.roll_number})`);
  res.json({ success: true, deletedId: id });
});

function formatAttendance(row) {
  return {
    id: row.id, studentId: row.student_id, studentName: row.studentName, studentRoll: row.studentRoll,
    batchId: row.batch_id, date: String(row.date).slice(0, 10), status: row.status,
    remarks: row.remarks || '', recordedBy: row.recorded_by
  };
}

function formatGrade(row) {
  return {
    id: row.id, studentId: row.student_id, studentName: row.studentName, studentRoll: row.studentRoll,
    courseId: row.course_id, courseName: row.courseName, batchId: row.batch_id,
    assessmentType: row.assessment_type, assessmentName: row.assessment_name,
    maxScore: Number(row.max_score), scoreObtained: Number(row.score_obtained), gradeLetter: row.grade_letter,
    percentage: Number(row.percentage), remarks: row.remarks || '', gradedBy: row.graded_by, date: String(row.date).slice(0, 10)
  };
}

app.get('/api/attendance', async (req, res) => {
  const { batchId, date, studentId } = req.query;
  const conditions = [];
  const params = [];
  if (batchId && batchId !== 'all') { conditions.push('a.batch_id = ?'); params.push(batchId); }
  if (date) { conditions.push('a.date = ?'); params.push(date); }
  if (studentId) { conditions.push('a.student_id = ?'); params.push(studentId); }

  const [rows] = await pool.query(
    `SELECT a.*, CONCAT(s.first_name, ' ', s.last_name) AS studentName, s.roll_number AS studentRoll
     FROM attendance a JOIN students s ON a.student_id = s.id
     ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''} ORDER BY a.date, s.roll_number`, params
  );
  res.json(rows.map(formatAttendance));
});

app.post('/api/attendance/bulk', async (req, res) => {
  const { batchId, date, records, recordedBy } = req.body;
  if (!batchId || !date || !Array.isArray(records)) return res.status(400).json({ error: 'batchId, date, and records array are required' });

  await pool.query('DELETE FROM attendance WHERE batch_id = ? AND date = ?', [batchId, date]);
  for (const record of records) {
    const [[student]] = await pool.query('SELECT * FROM students WHERE id = ?', [record.studentId]);
    if (!student) continue;
    await pool.query(
      `INSERT INTO attendance (id, student_id, batch_id, date, status, remarks, recorded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`att-${record.studentId}-${date}`, record.studentId, batchId, date, record.status || 'Present', record.remarks || '', recordedBy || 'Faculty Member']
    );
  }

  const [[batch]] = await pool.query('SELECT name FROM batches WHERE id = ?', [batchId]);
  await addActivityLog(currentUserId(req, 'usr-2'), 'Recorded Attendance', `Logged attendance for ${batch?.name || batchId} on ${date} (${records.length} students)`);
  res.json({ message: 'Attendance recorded successfully', count: records.length });
});

app.get('/api/attendance/summary', async (req, res) => {
  const { batchId } = req.query;
  const students = await getStudents(batchId && batchId !== 'all' ? 'WHERE s.batch_id = ?' : '', batchId && batchId !== 'all' ? [batchId] : []);
  const summaries = [];

  for (const student of students) {
    const [rows] = await pool.query('SELECT status FROM attendance WHERE student_id = ?', [student.id]);
    const totalClasses = rows.length;
    const presentCount = rows.filter(r => r.status === 'Present').length;
    const absentCount = rows.filter(r => r.status === 'Absent').length;
    const lateCount = rows.filter(r => r.status === 'Late').length;
    const excusedCount = rows.filter(r => r.status === 'Excused').length;
    const percentage = totalClasses ? Math.round(((presentCount + lateCount) / totalClasses) * 100) : 100;
    summaries.push({ studentId: student.id, studentName: `${student.firstName} ${student.lastName}`, rollNumber: student.rollNumber, batchName: student.batchName, batchId: student.batchId, totalClasses, presentCount, absentCount, lateCount, excusedCount, percentage });
  }
  res.json(summaries);
});

app.get('/api/grades', async (req, res) => {
  const { studentId, courseId, batchId } = req.query;
  const conditions = [];
  const params = [];
  if (studentId) { conditions.push('g.student_id = ?'); params.push(studentId); }
  if (courseId && courseId !== 'all') { conditions.push('g.course_id = ?'); params.push(courseId); }
  if (batchId && batchId !== 'all') { conditions.push('g.batch_id = ?'); params.push(batchId); }

  const [rows] = await pool.query(
    `SELECT g.*, CONCAT(s.first_name, ' ', s.last_name) AS studentName, s.roll_number AS studentRoll, c.name AS courseName
     FROM grades g JOIN students s ON g.student_id = s.id LEFT JOIN courses c ON g.course_id = c.id
     ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''} ORDER BY g.date DESC`, params
  );
  res.json(rows.map(formatGrade));
});

app.post('/api/grades', async (req, res) => {
  const { studentId, courseId, assessmentType, assessmentName, maxScore, scoreObtained, remarks, gradedBy } = req.body;
  if (!studentId || !courseId || !assessmentName || scoreObtained === undefined) return res.status(400).json({ error: 'Student, Course, Assessment Name, and Score are required' });

  const [[student]] = await pool.query('SELECT * FROM students WHERE id = ?', [studentId]);
  const [[course]] = await pool.query('SELECT * FROM courses WHERE id = ?', [courseId]);
  if (!student || !course) return res.status(400).json({ error: 'Student or course not found' });

  const max = Number(maxScore) || 100;
  const obtained = Number(scoreObtained);
  const percentage = Math.round((obtained / max) * 100);
  const gradeLetter = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';
  const id = `grd-${Date.now()}`;

  await pool.query(
    `INSERT INTO grades
     (id, student_id, course_id, batch_id, assessment_type, assessment_name, max_score, score_obtained, grade_letter, percentage, remarks, graded_by, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
    [id, studentId, courseId, student.batch_id, assessmentType || 'Assignment', assessmentName, max, obtained, gradeLetter, percentage, remarks || '', gradedBy || 'Faculty Member']
  );

  const [allGrades] = await pool.query('SELECT percentage FROM grades WHERE student_id = ?', [studentId]);
  const avgPercentage = allGrades.reduce((sum, g) => sum + Number(g.percentage), 0) / allGrades.length;
  const newGpa = Math.min(4, Math.max(1, Number((avgPercentage / 25).toFixed(2))));
  await pool.query('UPDATE students SET gpa = ? WHERE id = ?', [newGpa, studentId]);

  await addActivityLog(currentUserId(req, 'usr-2'), 'Graded Assessment', `Entered ${assessmentType || 'Assignment'} (${gradeLetter}) for ${student.first_name} ${student.last_name} in ${course.name}`);
  const [[created]] = await pool.query(
    `SELECT g.*, CONCAT(s.first_name, ' ', s.last_name) AS studentName, s.roll_number AS studentRoll, c.name AS courseName
     FROM grades g JOIN students s ON g.student_id = s.id LEFT JOIN courses c ON g.course_id = c.id WHERE g.id = ?`, [id]
  );
  res.status(201).json(formatGrade(created));
});

app.delete('/api/grades/:id', async (req, res) => {
  const [[grade]] = await pool.query('SELECT id FROM grades WHERE id = ?', [req.params.id]);
  if (!grade) return res.status(404).json({ error: 'Grade record not found' });
  await pool.query('DELETE FROM grades WHERE id = ?', [req.params.id]);
  res.json({ success: true, deletedId: req.params.id });
});

app.get('/api/analytics', async (req, res) => {
  const students = await getStudents();
  const [batches] = await pool.query('SELECT * FROM batches ORDER BY id');
  const [[courseCount]] = await pool.query('SELECT COUNT(*) AS count FROM courses');
  const [attendance] = await pool.query('SELECT * FROM attendance');
  const [grades] = await pool.query('SELECT * FROM grades');
  const [logs] = await pool.query('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 10');

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.enrollmentStatus === 'Active').length;
  const avgGpa = totalStudents ? Number((students.reduce((sum, s) => sum + Number(s.gpa), 0) / totalStudents).toFixed(2)) : 0;
  const averageAttendanceRate = attendance.length ? Math.round((attendance.filter(a => a.status === 'Present' || a.status === 'Late').length / attendance.length) * 100) : 100;

  const lowAttendanceStudents = [];
  for (const student of students) {
    const records = attendance.filter(a => a.student_id === student.id);
    const attended = records.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const pct = records.length ? Math.round((attended / records.length) * 100) : 100;
    if (records.length && pct < 75) lowAttendanceStudents.push({ student, totalCls: records.length, pct });
  }

  const gradeCounts = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
  grades.forEach(g => { gradeCounts[g.grade_letter] = (gradeCounts[g.grade_letter] || 0) + 1; });

  const batchPerformance = batches.map(batch => {
    const batchStudents = students.filter(s => s.batchId === batch.id);
    const batchAttendance = attendance.filter(a => a.batch_id === batch.id);
    const avg = batchStudents.length ? Number((batchStudents.reduce((sum, s) => sum + Number(s.gpa), 0) / batchStudents.length).toFixed(2)) : 0;
    const rate = batchAttendance.length ? Math.round((batchAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length / batchAttendance.length) * 100) : 100;
    return { batchId: batch.id, batchName: batch.code, fullName: batch.name, avgGpa: avg, attendanceRate: rate, studentCount: batchStudents.length };
  });

  res.json({
    totalStudents, activeStudents, totalBatches: batches.length, totalCourses: Number(courseCount.count),
    averageGpa: avgGpa, averageAttendanceRate, lowAttendanceCount: lowAttendanceStudents.length,
    lowAttendanceStudents, gradeDistribution: Object.entries(gradeCounts).map(([grade, count]) => ({ grade, count })),
    batchPerformance,
    recentActivities: logs.map(row => ({ id: row.id, timestamp: String(row.timestamp), userId: row.user_id, userName: row.user_name, role: row.role, action: row.action, details: row.details }))
  });
});

app.get('/api/activity-logs', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 100');
  res.json(rows.map(row => ({ id: row.id, timestamp: String(row.timestamp), userId: row.user_id, userName: row.user_name, role: row.role, action: row.action, details: row.details })));
});

app.post('/api/student-report', async (req, res) => {
  const students = await getStudents('WHERE s.id = ?', [req.body.studentId]);
  if (!students.length) return res.status(404).json({ error: 'Student not found' });
  const student = students[0];
  const [attendance] = await pool.query('SELECT status FROM attendance WHERE student_id = ?', [student.id]);
  const [grades] = await pool.query('SELECT percentage FROM grades WHERE student_id = ?', [student.id]);
  const attendanceRate = attendance.length ? Math.round((attendance.filter(a => a.status === 'Present' || a.status === 'Late').length / attendance.length) * 100) : 0;
  const averageMarks = grades.length ? Math.round(grades.reduce((sum, g) => sum + Number(g.percentage), 0) / grades.length) : 0;
  const overallRisk = attendanceRate < 60 || student.gpa < 2.5 ? 'High' : attendanceRate < 75 || student.gpa < 2.8 ? 'Moderate' : 'Low';
  const strengths = [];
  if (attendanceRate >= 85) strengths.push('Good attendance');
  if (student.gpa >= 3.5) strengths.push('Good overall academic performance');
  if (!strengths.length) strengths.push('Regular participation in the course records');
  const areasForImprovement = [];
  if (attendanceRate < 75) areasForImprovement.push('Attendance is below the 75% requirement');
  if (student.gpa < 3) areasForImprovement.push('Overall GPA can be improved');
  if (!areasForImprovement.length) areasForImprovement.push('Continue improving subject-wise performance');

  res.json({
    performanceSummary: `${student.firstName} ${student.lastName} has a GPA of ${student.gpa} and an attendance rate of ${attendanceRate}%. The average marks in recorded assessments are ${averageMarks}%.`,
    strengths,
    areasForImprovement,
    recommendedInterventions: [
      attendanceRate < 75 ? 'Try to attend classes regularly and avoid unnecessary absences.' : 'Continue maintaining regular attendance.',
      student.gpa < 3 ? 'Spend more time revising difficult subjects.' : 'Keep working consistently across all subjects.',
      'Review marks with the faculty member before the next assessment.'
    ],
    overallAcademicRisk: overallRisk
  });
});

app.post('/api/seed/reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM activity_logs');
    await pool.query('DELETE FROM grades');
    await pool.query('DELETE FROM attendance');
    await pool.query('DELETE FROM students');
    await pool.query('DELETE FROM courses');
    await pool.query('DELETE FROM batches');
    await pool.query('DELETE FROM users');

    await seedDatabase();
    res.json({ message: 'Database successfully reset and re-seeded with Indian names and photos.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  await setupDatabase();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, () => {
    console.log(`YouthMatrix running at http://localhost:${PORT}`);
    console.log(`MySQL database: ${dbConfig.database}`);
  });
}

startServer().catch(error => {
  console.error('Could not start YouthMatrix.');
  console.error(error.message);
  process.exit(1);
});
