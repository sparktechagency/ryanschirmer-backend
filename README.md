# unleakd.com Backend

Welcome to the backend repository for [unleakd.com](https://unleakd.com), a modern web platform. This project provides a robust, scalable, and secure RESTful API and real-time communication services for the Unleakd application.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Development Standards](#development-standards)
- [License](#license)

---

## Project Overview

This backend is built with Node.js, TypeScript, and Express, using MongoDB as the primary database. It supports authentication, user management, file uploads, email notifications, and real-time features via Socket.IO. The project is designed for scalability, maintainability, and security, following best practices in code quality and testing.

---

## Features

- **User Authentication & Authorization** (JWT, Firebase)
- **RESTful API** for core resources
- **Real-time Communication** with Socket.IO
- **File Uploads** (public/uploads)
- **Email Notifications**
- **Role-based Access Control**
- **Comprehensive Error Handling**
- **Environment-based Configuration**
- **Code Quality** enforced with ESLint, Prettier, and Husky

---

## Tech Stack

- **Node.js** & **TypeScript**
- **Express.js**
- **MongoDB** (via Mongoose)
- **Socket.IO**
- **Firebase Admin SDK**
- **JWT Authentication**
- **Bcrypt** for password hashing
- **Nodemailer** for emails
- **AWS S3** (optional, for file storage)
- **ESLint** & **Prettier** for code quality
- **Husky** for Git hooks

---

## Project Structure

```
.
├── src/
│   ├── app/                # Application modules (auth, user, utils, etc.)
│   ├── app.ts              # Express app setup
│   ├── server.ts           # Main server entry point
│   ├── socket.ts           # Socket.IO setup
│   └── ...
├── public/                 # Static files and uploads
├── .env                    # Environment variables
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
├── README.md               # Project documentation
└── ...
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance
- (Optional) AWS S3 credentials for file storage

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-org/ryanschirmer-backend.git
   cd ryanschirmer-backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values.

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Build for production:**
   ```sh
   npm run build
   ```

6. **Start in production:**
   ```sh
   npm run start:prod
   ```

---

## Scripts

- `npm run dev` — Start development server with hot reload
- `npm run build` — Compile TypeScript to JavaScript
- `npm run start:prod` — Start the compiled server
- `npm run lint:check` — Run ESLint
- `npm run prettier:check` — Check code formatting
- `npm run lint-prettier` — Run lint and prettier checks
- `npm run generate` — Generate folder structure

---

## Environment Variables

See `.env.example` for all required variables, including:

- `PORT` — API server port
- `SOCKET_PORT` — Socket.IO port
- `DATABASE_URL` — MongoDB connection string
- `JWT_SECRET` — JWT secret key
- `FIREBASE_*` — Firebase credentials
- `EMAIL_*` — Email service credentials

---

## Development Standards

- **Code Style:** Enforced with ESLint and Prettier.
- **Commits:** Pre-commit hooks via Husky.
- **Testing:** (Add your testing strategy here if available)
- **Documentation:** Keep this README and code comments up to date.

---

## License

This project is licensed under the ISC License.

---

## Contact

For questions or support, please contact [support@unleakd.com](mailto:support@unleakd.com).

---

© unleakd.com. All rights reserved.