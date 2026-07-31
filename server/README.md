# Library Management System - Backend (TypeScript)

## 🎉 TypeScript Backend

This is the backend API for the Library Management System, fully built with TypeScript.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Node-cron** - Scheduled tasks

## 📦 Installation

```bash
# Install dependencies
pnpm install
```

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/library

# JWT
JWT_SECRET=your_jwt_secret_key_here
COOKIE_EXPIRE=7

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_SERVICE=gmail
SMTP_PORT=587
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## 🏃 Running the Server

### Development Mode (with hot reload)
```bash
pnpm dev
```

### Seed Demonstration Accounts
```bash
pnpm seed:demo
```

### Build for Production
```bash
pnpm build
```

### Run Production Build
```bash
pnpm start
```

### Run Tests
```bash
pnpm test
```

### Type Check Only
```bash
pnpm typecheck
```

## 📁 Project Structure

```
server/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── authController.ts
│   │   ├── bookController.ts
│   │   ├── borrowController.ts
│   │   └── userController.ts
│   │
│   ├── middlewares/       # Custom middleware
│   │   ├── authMiddleware.ts
│   │   └── errorMiddleware.ts
│   │
│   ├── models/            # Mongoose models
│   │   ├── userModel.ts
│   │   ├── bookModel.ts
│   │   └── borrowModel.ts
│   │
│   ├── routes/            # API routes
│   │   ├── authRoutes.ts
│   │   ├── bookRoutes.ts
│   │   ├── borrowRoutes.ts
│   │   └── userRoutes.ts
│   │
│   ├── services/          # Background services
│   │   ├── notifyUsers.ts
│   │   └── removeUnverifiedAccounts.ts
│   │
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── utils/             # Utility functions
│   │   ├── sendEmail.ts
│   │   ├── sendToken.ts
│   │   ├── emailTemplates.ts
│   │   └── sendVerificationCode.ts
│   │
│   ├── db.ts              # Database connection
│   └── server.ts          # Main entry point
│
├── dist/                  # Compiled JavaScript (gitignored)
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🛣️ API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /verify-otp` - Verify email with OTP
- `POST /login` - Login user
- `GET /logout` - Logout user
- `GET /me` - Get current user
- `POST /password/forgot` - Request password reset
- `PUT /password/reset/:token` - Reset password
- `PUT /password/update` - Update password (authenticated)

### Books (`/api/books`)
- `GET /all` - Get all books
- `POST /add` - Add new book (admin only)
- `DELETE /delete/:id` - Delete book (admin only)

### Borrowing (`/api/borrow`)
- `GET /my-borrowed-books` - Get user's borrowed books
- `GET /borrowed-books-by-users` - Get all borrow records (admin)
- `POST /record-borrowed-book/:bookId` - Record book borrow (admin)
- `POST /record-returned-book/:bookId` - Record book return (admin)

### Users (`/api/users`)
- `GET /all` - Get all users (admin only)
- `POST /add/admin` - Create new admin (admin only)

## 🔐 Authentication

The API uses JWT tokens stored in HTTP-only cookies for authentication. Protected routes require a valid token.

**Roles:**
- `user` - Regular users (can borrow books, view catalog)
- `admin` - Administrators (full access to manage books and users)

## 📧 Email Features

- Email verification with OTP on registration
- Password reset emails
- Overdue book notifications (automated cron job)

## ⏰ Scheduled Tasks

- **Notify Users** - Runs every 30 minutes, sends emails for overdue books
- **Remove Unverified Accounts** - Runs every 5 minutes, removes accounts that haven't verified within 30 minutes

## 🎯 Type Safety

All code is fully typed with TypeScript:
- Request/Response types
- Database models with Mongoose types
- Custom middleware types
- Error handling types

## 📚 Documentation

- [TypeScript Migration Guide](./TYPESCRIPT_MIGRATION.md) - Details about the TS migration

## 🐛 Error Handling

Centralized error handling middleware catches and formats all errors:
- Mongoose validation errors
- JWT errors
- Cast errors (invalid MongoDB IDs)
- Custom application errors

## 🧪 Development

```bash
# Watch mode with hot reload
pnpm dev

# Type check
pnpm typecheck

# Build
pnpm build
```

## 📝 License

ISC

---

**Built with ❤️ and TypeScript**
