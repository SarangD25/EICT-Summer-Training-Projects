# YouthMatrix

YouthMatrix is a beginner-friendly **Student Management System** made as a college full-stack project.

It lets an admin/faculty member manage students, batches, courses, attendance and grades from one dashboard.

## Tech Stack

### Frontend
- React
- HTML / JSX
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Other libraries
- Vite
- Recharts
- Lucide React
- Tailwind CSS

## Project flow

```text
React + HTML + CSS + JavaScript
              |
            fetch()
              |
              v
       Node.js + Express
              |
         SQL queries
              |
              v
            MySQL
```

The frontend sends requests to the Express API. The Express routes read and update the MySQL database and return JSON data to React.

## Main features

- Student directory
- Add, edit and delete students
- Search and filter students
- Batch management
- Course management
- Attendance marking
- Attendance summary
- Grade entry and grade calculation
- Dashboard statistics and charts
- Activity logs
- Simple student performance report

## Requirements

Install these before running the project:

1. Node.js
2. MySQL Server (MySQL Workbench can be used to view the database)

## Run in VS Code

### 1. Open the project

Open the `05-Student-Management-System` folder in VS Code.

### 2. Install packages

Open the VS Code terminal:

```bash
npm install
```

### 3. Set MySQL details

The project uses these defaults:

```text
Host: localhost
Port: 3306
User: root
Password: empty
Database: youthmatrix
```

If your MySQL password is different, create a `.env` file in the project folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=youthmatrix
PORT=3000
```

The server creates the database and tables automatically when the MySQL user has permission to create databases.

You can also open `database.sql` in MySQL Workbench and run it manually first.

### 4. Start the project

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

On the first run, the server adds sample students, batches, courses, attendance and grades to the database.

## Project structure

```text
05-Student-Management-System/
├── src/
│   ├── components/
│   ├── App.js
│   ├── main.js
│   ├── index.css
│   └── serverData.js
├── database.sql
├── server.js
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Notes

This is a college/demo project, not a production student information system. Authentication and advanced security have deliberately been kept simple so that the application remains understandable for a beginner full-stack project.
