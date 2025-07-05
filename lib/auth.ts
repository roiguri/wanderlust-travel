import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from './database';

export interface User {
  id: string;
  email: string;
  username: string;
  profile_picture_url?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  refreshToken: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(userId: string, type: 'access' | 'refresh' = 'access'): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  const expiresIn = type === 'access' 
    ? process.env.JWT_EXPIRES_IN || '7d'
    : '30d'; // Refresh tokens last longer

  return jwt.sign(
    { userId, type },
    secret,
    { expiresIn }
  );
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; type: string } {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  try {
    const decoded = jwt.verify(token, secret) as any;
    return { userId: decoded.userId, type: decoded.type };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Create new user
export async function createUser(userData: CreateUserData): Promise<User> {
  const { email, username, password } = userData;

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [email, username]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('User with this email or username already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const result = await query(
    `INSERT INTO users (email, username, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, username, profile_picture_url, preferences, created_at, updated_at`,
    [email, username, passwordHash]
  );

  return result.rows[0];
}

// Authenticate user
export async function authenticateUser(loginData: LoginData): Promise<User> {
  const { email, password } = loginData;

  // Find user by email
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Remove password hash from returned user
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  const result = await query(
    'SELECT id, email, username, profile_picture_url, preferences, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

// Update user's updated_at timestamp
export async function updateUserTimestamp(userId: string): Promise<void> {
  await query(
    'UPDATE users SET updated_at = NOW() WHERE id = $1',
    [userId]
  );
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}

// Validate username
export function isValidUsername(username: string): { valid: boolean; message?: string } {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 30) {
    return { valid: false, message: 'Username must be no more than 30 characters long' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  
  return { valid: true };
}