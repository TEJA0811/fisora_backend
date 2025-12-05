# NOTE: This repository is a fork of a private/internal project that I originally contributed to extensively.
 I created this fork only for the purpose of showcasing my work publicly during interviews (Almedia).

 ✔ I was the main contributor to the original project.
✔ All code, features, and documentation in this fork represent my own work.
✔ Sensitive or proprietary parts have been removed/refactored to make the project shareable.

If you have any questions about specific modules or design decisions, I’ll be happy to explain them during the interview.


# 🐟 Fishora - Fish Order Management System

A complete backend API for managing fish sales, orders, and admin operations with role-based authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Authentication](#authentication)
- [Contributing](#contributing)

---

## ✨ Features

### User Features
- 🔐 User registration and login with JWT authentication
- 🔄 Refresh token rotation for secure session management
- 📱 Phone and email-based authentication
- 🔒 Password hashing with bcrypt
- 👤 User profile management

### Admin Features
- 👨‍💼 Role-based access control (Admin/User)
- 🐟 Fish item management (CRUD operations)
- 📦 Order management and status updates
- 🔑 Secure admin authentication
- 🔐 Password change endpoint
- 📊 View all orders with user and item details

### Order Features
- 🛒 Order placement with fish items
- 📈 Order status tracking (pending → accepted → onaway → delivered)
- 📅 Automatic timestamps for orders
- 🚚 Delivery tracking

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma 5.x
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** Custom middleware validators
- **Environment:** dotenv

---

## 📁 Project Structure

```
fishora_backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema definition
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── admin.controller.ts
│   │   └── home.controller.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   └── admin.service.ts
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── admin.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation/
│   │       ├── auth.validation.ts
│   │       └── admin.validation.ts
│   ├── routes/              # API routes
│   │   ├── auth.route.ts
│   │   ├── admin.route.ts
│   │   └── home.route.ts
│   ├── db/                  # Database layer
│   │   ├── prisma.client.ts
│   │   └── prisma.db.ts
│   └── type/                # TypeScript types
├── index.ts                 # Application entry point
├── package.json
├── tsconfig.json
├── .env.example             # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fishora_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/fishora_db
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=3000
   ADMIN_PHONE=9999999999
   ADMIN_PASSWORD=Admin@123
   ADMIN_EMAIL=admin@fishora.com
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   npx prisma migrate dev
   
   # Generate Prisma Client
   npx prisma generate
   ```

5. **Create admin user (optional - if you have a seed script)**
   ```bash
   npm run seed
   ```

6. **Build the project**
   ```bash
   npm run build
   ```

7. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development (with hot reload)
   npm run dev
   ```

The server will start on `http://localhost:3000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Routes

#### Register User
```http
POST /signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "SecurePass@123"
}
```

#### User Login
```http
POST /login
Content-Type: application/json

{
  "phone": "1234567890",
  "password": "SecurePass@123"
}
```

#### Refresh Token
```http
POST /refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```http
POST /logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Admin Routes

#### Admin Login
```http
POST /admin/login
Content-Type: application/json

{
  "phone": "9999999999",
  "password": "Admin@123"
}
```

#### Get All Fish Items (Admin)
```http
GET /admin/fish
Authorization: Bearer <admin-token>
```

#### Add Fish Item (Admin)
```http
POST /admin/fish
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Salmon",
  "price": 25.99,
  "minimum": 1,
  "unit": "kg",
  "description": "Fresh Atlantic Salmon",
  "uses": "Grilling, Baking",
  "offer": "10% off"
}
```

#### Update Fish Item (Admin)
```http
PUT /admin/fish/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 22.99,
  "offer": "15% off"
}
```

#### Delete Fish Item (Admin)
```http
DELETE /admin/fish/:id
Authorization: Bearer <admin-token>
```

#### Get All Orders (Admin)
```http
GET /admin/orders
Authorization: Bearer <admin-token>
```

#### Update Order Status (Admin)
```http
PATCH /admin/orders/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "accepted"
}
```
**Valid statuses:** `pending`, `accepted`, `declined`, `onaway`, `delivered`

#### Change Admin Password
```http
POST /admin/change-password
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "currentPassword": "Admin@123",
  "newPassword": "NewSecure@2025"
}
```

For detailed API documentation, see [ADMIN_API.md](./ADMIN_API.md)

---

## 🗄️ Database Schema

### Models

#### User
- `id` (String, Primary Key)
- `name` (String)
- `phone` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `joined` (DateTime, Default: now)
- `status` (UserStatus: created | verified)
- `role` (UserRole: user | admin, Default: user)

#### FishItem
- `id` (String, Primary Key)
- `name` (String)
- `price` (Float)
- `minimum` (Int)
- `unit` (String)
- `description` (String)
- `uses` (String)
- `offer` (String)

#### Order
- `id` (String, Primary Key)
- `userId` (String, Foreign Key → User)
- `itemId` (String, Foreign Key → FishItem)
- `quantity` (Int)
- `price` (String)
- `orderAt` (DateTime, Default: now)
- `status` (OrderStatus: pending | accepted | declined | onaway | delivered)
- `deliverdAt` (DateTime, Nullable)

#### RefreshToken
- `id` (String, Primary Key)
- `userId` (String, Foreign Key → User)
- `token` (String, Unique)
- `expires` (DateTime, Nullable)
- `revoked` (Boolean, Default: false)
- `createdAt` (DateTime, Default: now)

### Relationships
- User → Orders (One to Many)
- User → RefreshTokens (One to Many)
- FishItem → Orders (One to Many)

### View Schema
```bash
npx prisma studio
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fishora_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Admin Credentials (for seeding)
ADMIN_PHONE=9999999999
ADMIN_PASSWORD=Admin@123
ADMIN_EMAIL=admin@fishora.com
```

⚠️ **Security Notes:**
- Never commit `.env` to version control
- Use strong, random JWT_SECRET in production
- Change default admin credentials after first login

---

## 📜 Scripts

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start production server
npm start

# Start development server (with hot reload)
npm run dev

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database (⚠️ Deletes all data)
npx prisma migrate reset
```

---

## 🔑 Authentication

### JWT Tokens

The API uses **two-token authentication**:

1. **Access Token** (Short-lived: 15 minutes)
   - Used for API requests
   - Stored in client memory
   - Sent in `Authorization: Bearer <token>` header

2. **Refresh Token** (Long-lived: 7 days)
   - Used to get new access tokens
   - Stored in database
   - Supports token rotation for security

### Token Rotation Flow

```
1. User logs in → Receives access token + refresh token
2. Access token expires → Client sends refresh token
3. Server validates refresh token → Issues new access + refresh token
4. Old refresh token is revoked
5. Repeat from step 2
```

### Role-Based Access Control

- **User Role**: Can access user-specific routes
- **Admin Role**: Can access all admin routes + user routes

**Middleware:**
- `isLogged` - Validates user JWT token
- `isAdmin` - Validates admin JWT token + checks role

---

## 🧪 Testing

### Using REST Client (VS Code Extension)

The project includes test files:
- `admin.rest` - Admin API tests
- `api.rest` - User API tests

Install the **REST Client** extension and click "Send Request" above each endpoint.

### Using cURL

**Example: Test Admin Login**
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9999999999","password":"Admin@123"}'
```

### Using Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:3000`
3. Add Authorization header for protected routes

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection
npx prisma db pull
```

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Rebuild project
npm run build
```

### TypeScript Errors
```bash
# Clear dist folder and rebuild
rm -rf dist
npm run build
```

---

## 📦 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Set up proper CORS
- [ ] Use connection pooling for database
- [ ] Enable rate limiting
- [ ] Set up logging (Winston, Morgan)
- [ ] Configure environment-specific configs
- [ ] Run database migrations
- [ ] Change default admin credentials

### Environment Setup

```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production npm start
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Fishora Backend Team
Tejas(tejstmk0811@gmail.com)
Sanjay

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review API documentation in `ADMIN_API.md`

---

## 🎉 Acknowledgments

- Express.js for the web framework
- Prisma for the amazing ORM
- PostgreSQL for reliable data storage
- TypeScript for type safety

---

**Built with ❤️ for fresh fish delivery management**
