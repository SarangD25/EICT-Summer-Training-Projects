# Login & Registration System

A simple login and registration system built with Node.js, Express, MongoDB, and JWT.

## Features

- User Registration with form validation
- User Login with JWT authentication
- Password hashing using bcrypt
- Protected dashboard route
- Forgot Password / Password Reset via email
- Session management using HTTP-only cookies
- Client-side and server-side form validation

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Templating:** EJS
- **Email:** Nodemailer (Gmail)

## Setup

### Prerequisites

- Node.js installed
- MongoDB installed and running locally (or use MongoDB Atlas)

### Installation

1. Clone the repo or download the files

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root folder (or edit the existing one):
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/login_register_db
   JWT_SECRET=mysecretkey123changethislater
   JWT_EXPIRE=1d
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASS=yourapppassword
   ```

4. Start the server:
   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser

## Project Structure

```
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT auth middleware
├── models/
│   └── User.js            # User schema/model
├── public/
│   └── css/
│       └── style.css      # Stylesheet
├── routes/
│   └── authRoutes.js      # All routes (auth + pages)
├── views/
│   ├── login.ejs          # Login page
│   ├── register.ejs       # Register page
│   ├── dashboard.ejs      # Dashboard (protected)
│   ├── forgot-password.ejs # Forgot password page
│   ├── reset-password.ejs # Reset password page
│   └── 404.ejs            # 404 page
├── .env                   # Environment variables
├── server.js              # Entry point
└── package.json
```

## Notes

- For the password reset email to work, you need to set up a Gmail App Password (or use another email service)
- Make sure MongoDB is running before starting the server
- Change the JWT_SECRET to something more secure in production
