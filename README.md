# Library Management System - MERN Stack

A full-stack library management application built with MongoDB, Express.js, React, and Node.js. **Gotham City Public Library** offers book catalogs, holds, borrowing, ratings, and admin management.

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

   Create a `.env` file in the project root (or in `server/`):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:3000
   
   # Email configuration (for nodemailer - verification, password reset, overdue reminders)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_app_password
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

The client runs at `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

## 📦 Server (Backend)

The backend API is built with:
- **Express.js** – Web framework
- **MongoDB** & **Mongoose** – Database and ODM
- **JWT** – Authentication (HTTP-only cookies)
- **Bcrypt** – Password hashing
- **Nodemailer** – Email (verification, password reset, overdue reminders)
- **Node-cron** – Scheduled tasks

### Server Features

- User authentication with email verification (OTP)
- Password reset via email link
- Role-based access control (Admin/User)
- Book management (add, delete, bulk upload)
- Holds system (place, approve, reject, release)
- Borrowing (admin records checkout/return by user email)
- Book ratings (1–5 stars, one per user per book)
- Automated overdue email reminders
- Scheduled cleanup of unverified accounts

### Server Scripts

```bash
cd server
pnpm dev        # Development with hot reload (tsx)
pnpm build      # Build TypeScript to JavaScript
pnpm start      # Production
pnpm typecheck  # Type checking
```

## 🎨 Client (Frontend)

The frontend is built with **React + TypeScript + Tailwind CSS + Zustand**. See [client/README.md](client/README.md) for details.

### Frontend Stack

- **React 18.3** with TypeScript 5.7
- **Vite 6.0** for build and dev server
- **Tailwind CSS 3.4** for styling
- **Zustand** for state management
- **Axios** for API calls (with credentials for cookies)
- **React Router DOM 7** for navigation

### Routes

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Home with featured books gallery |
| `/books` | Public | Book catalog with search & filters |
| `/books/:id` | Public | Book detail, hold, rate |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/forgot-password` | Public | Request password reset |
| `/verify-otp` | Public | Verify email OTP |
| `/reset-password/:token` | Public | Set new password |
| `/privacy` | Public | Privacy statement |
| `/terms` | Public | Terms of use |
| `/accessibility` | Public | Accessibility statement |
| `/dashboard` | User | User dashboard |
| `/my-books` | User | Borrowed books & holds |
| `/profile` | User | Profile & change password |
| `/admin` | Admin | Admin dashboard |
| `/admin/books` | Admin | Manage books |
| `/admin/books/bulk` | Admin | Bulk upload books |
| `/admin/users` | Admin | Manage users |
| `/admin/borrowing` | Admin | Borrowing records, checkout/return |
| `/admin/holds` | Admin | Manage holds |
| `/admin/create-admin` | Admin | Create new admin |

## 📚 API Endpoints

All API routes are prefixed with `/api/v1`. Auth uses HTTP-only cookies.

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/verify-otp` | No | Verify email with OTP |
| POST | `/login` | No | Login user |
| GET | `/logout` | Yes | Logout user |
| GET | `/me` | Yes | Get current user |
| POST | `/password/forgot` | No | Send password reset email |
| PUT | `/password/reset/:token` | No | Reset password with token |
| PUT | `/password/update` | Yes | Update password (current + new) |

### Books (`/api/v1/book`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/all` | No | Get all books (includes averageRating, ratingCount) |
| GET | `/:id` | Optional | Get book by ID (includes userRating when logged in) |
| POST | `/add` | Admin | Create book |
| DELETE | `/delete/:id` | Admin | Delete book |
| POST | `/bulk` | Admin | Bulk upload books |

### Borrowing (`/api/v1/borrow`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/my-borrowed-books` | User | Get current user's borrowed books |
| GET | `/borrowed-books-by-users` | Admin | Get all borrow records |
| POST | `/record-borrowed-book/:bookId` | Admin | Record checkout (body: `{ email }`) |
| POST | `/record-returned-book/:bookId` | Admin | Record return (body: `{ email }`) |

### Holds (`/api/v1/hold`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:bookId` | User | Place hold on book |
| GET | `/my-holds` | User | Get current user's holds |
| GET | `/` | Admin | Get all holds |
| PATCH | `/:holdId/approve` | Admin | Approve hold |
| PATCH | `/:holdId/reject` | Admin | Reject hold |
| PATCH | `/:holdId/release` | Admin | Release hold |

### Ratings (`/api/v1/rating`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/:bookId` | User | Submit/update rating (body: `{ rating: 1-5 }`) |
| GET | `/:bookId` | Optional | Get current user's rating for book |

### Users (`/api/v1/user`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/all` | Admin | Get all verified users |
| POST | `/add/admin` | Admin | Register new admin |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

## 🔧 Technology Stack

### Backend

- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT (cookie-based)
- Bcrypt
- Nodemailer
- Node-cron

### Frontend

- React 18 with TypeScript
- Vite
- Tailwind CSS
- Zustand
- Axios
- React Router DOM

## 📖 User Flows

1. **Borrow a book**: User places hold → Admin approves → User picks up → Admin records checkout.
2. **Return a book**: Admin records return (user email + book).
3. **Rate a book**: Logged-in users rate 1–5 stars on the book detail page.
4. **Password reset**: Forgot password → Email with link → Reset with token.

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

**Note**: Never commit sensitive information like API keys or passwords to version control. Use `.env` for configuration.
