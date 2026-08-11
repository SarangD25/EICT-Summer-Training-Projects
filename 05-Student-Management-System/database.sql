CREATE DATABASE IF NOT EXISTS youthmatrix;
USE youthmatrix;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  role VARCHAR(20) NOT NULL,
  avatar TEXT,
  department VARCHAR(150),
  title VARCHAR(150)
);

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
);

CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(150) NOT NULL,
  department VARCHAR(100),
  credits INT DEFAULT 3,
  faculty_id VARCHAR(50),
  faculty_name VARCHAR(100),
  batch_id VARCHAR(50)
);

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
);

CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(100) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  batch_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  remarks VARCHAR(255),
  recorded_by VARCHAR(100)
);

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
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(100) PRIMARY KEY,
  timestamp DATETIME NOT NULL,
  user_id VARCHAR(50),
  user_name VARCHAR(100),
  role VARCHAR(30),
  action VARCHAR(100),
  details TEXT
);
