# Wanderlust Travel App

A comprehensive trip planning and recording application built with Expo and React Native.

## Authentication Backend

This project includes a complete authentication system with:

### Features
- User registration with email/username/password
- Secure login with JWT tokens
- Password hashing with bcrypt
- Token refresh mechanism
- Input validation and error handling
- PostgreSQL database integration

### API Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email/password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

#### Users
- `GET /users/profile` - Get current user profile (authenticated)
- `PUT /users/profile` - Update user profile (authenticated)

### Environment Variables

Create a `.env` file with the following variables:

```env
EXPO_PUBLIC_API_URL=http://localhost:8081
DATABASE_URL=postgresql://username:password@localhost:5432/wanderlust_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### Database Setup

The application automatically creates the necessary database tables on first run. Make sure you have PostgreSQL running and the database created.

### Security Features

- Passwords are hashed using bcrypt with configurable salt rounds
- JWT tokens for secure authentication
- Input validation for email, username, and password strength
- SQL injection protection through parameterized queries
- Proper error handling without exposing sensitive information

### Development

1. Install dependencies: `npm install`
2. Set up your environment variables in `.env`
3. Ensure PostgreSQL is running
4. Start the development server: `npm run dev`

The authentication system is now ready to use with your frontend application.
