# Library Management System - MERN Stack

A full-stack library management application built with MongoDB, Express.js, React, and Node.js.

## 📋 Project Structure

This is a monorepo organized using pnpm workspaces:

```
library_mern/
├── client/          # React frontend application
├── server/          # Node.js/Express backend API
├── package.json     # Root workspace configuration
├── pnpm-workspace.yaml
└── README.md        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (v8 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library_mern
   ```

2. **Install pnpm** (if not already installed)
   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies for all workspaces**
   ```bash
   pnpm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # Email configuration (for nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## 🛠️ Development

### Run Both Client and Server

```bash
pnpm dev
```

### Run Server Only

```bash
pnpm dev:server
```

### Run Client Only

```bash
pnpm dev:client
```

## 📦 Server (Backend)

The backend API is built with:
- **Express.js** - Web framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email notifications
- **Cloudinary** - Image storage
- **Node-cron** - Scheduled tasks

### Server Features

- User authentication with email verification
- Role-based access control (Admin/User)
- Book management (CRUD operations)
- Borrowing system with due dates
- Automated email notifications
- Scheduled cleanup of unverified accounts
- File upload support for avatars

### Server Scripts

```bash
cd server
pnpm dev      # Development with nodemon
pnpm start    # Production
```

## 🎨 Client (Frontend)

The frontend is fully configured with **React + TypeScript + Tailwind CSS**. See [client/README.md](client/README.md) and [client/SETUP_SUMMARY.md](client/SETUP_SUMMARY.md) for details.

### Frontend Stack
- **React 18.3** with TypeScript 5.7
- **Vite 6.0** for lightning-fast development
- **Tailwind CSS 3.4** for styling
- **Axios** for API calls
- **React Router DOM** for navigation
- Full type safety and IntelliSense support

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify` - Verify email with code
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Create book (Admin)
- `PUT /api/books/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Borrowing
- `POST /api/borrow` - Borrow a book
- `PUT /api/borrow/:id/return` - Return a book
- `GET /api/borrow/user` - Get user's borrowed books

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (Admin)

## 🔧 Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for emails
- Cloudinary for image storage
- Node-cron for scheduled tasks

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Axios for HTTP requests
- React Context for state management
- React Router for navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📧 Contact

For any questions or issues, please open an issue on the repository.

---

**Note**: Make sure to configure your environment variables properly before running the application. Never commit sensitive information like API keys or passwords to version control.

