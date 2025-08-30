import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignJWT } from 'jose';
import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';
import { AuthUtils } from './auth-utils';

// Types for authentication
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'editor';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  profile: {
    avatar?: string;
    phone?: string;
    department?: string;
  };
  settings: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    timezone: string;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface PasswordResetToken {
  _id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface LoginAttempt {
  _id?: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  createdAt: Date;
}

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'mazoony-super-secret-key-2024';
const JWT_SECRET_ENCODED = new TextEncoder().encode(JWT_SECRET);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Password reset configuration
const RESET_TOKEN_EXPIRES_IN = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Compare password
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static async generateToken(user: User): Promise<string> {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };
    
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET_ENCODED);
      
    return token;
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Generate reset token
  static generateResetToken(): string {
    return AuthUtils.generateResetToken();
  }

  // Create user
  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'loginAttempts' | 'lastLogin'>): Promise<User> {
    const db = await getDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('المستخدم موجود بالفعل');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    const user: Omit<User, '_id'> = {
      ...userData,
      password: hashedPassword,
      loginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(user as any);
    return { ...user, _id: result.insertedId.toString() };
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ email, isActive: true });
    return user as User | null;
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    const db = await getDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id), isActive: true });
    return user as User | null;
  }

  // Login
  static async login(email: string, password: string, ipAddress: string, userAgent: string): Promise<{ user: User; token: string }> {
    const db = await getDatabase();
    
    try {
      // Get user
      const user = await this.getUserByEmail(email);
      if (!user) {
        await this.logLoginAttempt(email, ipAddress, userAgent, false, 'المستخدم غير موجود');
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        await this.logLoginAttempt(email, ipAddress, userAgent, false, 'الحساب مقفل');
        throw new Error('الحساب مقفل مؤقتاً. يرجى المحاولة لاحقاً');
      }

      // Check password
      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) {
        // Increment login attempts
        const newAttempts = user.loginAttempts + 1;
        const updateData: any = { 
          loginAttempts: newAttempts,
          updatedAt: new Date()
        };

        // Lock account if too many attempts
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          updateData.lockedUntil = new Date(Date.now() + LOCK_TIME);
        }

        await db.collection('users').updateOne(
          { _id: new ObjectId(user._id) },
          { $set: updateData }
        );

        await this.logLoginAttempt(email, ipAddress, userAgent, false, 'كلمة مرور خاطئة');
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }

      // Reset login attempts and update last login
      await db.collection('users').updateOne(
        { _id: new ObjectId(user._id) },
        { 
          $set: { 
            loginAttempts: 0,
            lastLogin: new Date(),
            updatedAt: new Date()
          },
          $unset: { lockedUntil: 1 }
        }
      );

      // Log successful attempt
      await this.logLoginAttempt(email, ipAddress, userAgent, true);

      // Generate token
      const token = await this.generateToken(user);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  // Log login attempt
  static async logLoginAttempt(email: string, ipAddress: string, userAgent: string, success: boolean, failureReason?: string): Promise<void> {
    const db = await getDatabase();
    
    const attempt: Omit<LoginAttempt, '_id'> = {
      email,
      ipAddress,
      userAgent,
      success,
      failureReason,
      createdAt: new Date()
    };

    await db.collection('loginAttempts').insertOne(attempt as any);
  }

  // Request password reset
  static async requestPasswordReset(email: string): Promise<string> {
    const db = await getDatabase();
    
    // Check if user exists
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // Generate reset token
    const token = this.generateResetToken();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_IN);

    // Save reset token
    const resetToken: Omit<PasswordResetToken, '_id'> = {
      userId: user._id!,
      token,
      expiresAt,
      used: false,
      createdAt: new Date()
    };

    await db.collection('passwordResetTokens').insertOne(resetToken as any);

    return token;
  }

  // Verify reset token
  static async verifyResetToken(token: string): Promise<User> {
    const db = await getDatabase();
    
    // Find token
    const resetToken = await db.collection('passwordResetTokens').findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetToken) {
      throw new Error('رمز الاستعادة غير صحيح أو منتهي الصلاحية');
    }

    // Get user
    const user = await this.getUserById(resetToken.userId);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    return user;
  }

  // Reset password
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const db = await getDatabase();
    
    // Verify token and get user
    const user = await this.verifyResetToken(token);

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password
    await db.collection('users').updateOne(
      { _id: new ObjectId(user._id) },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );

    // Mark token as used
    await db.collection('passwordResetTokens').updateOne(
      { token },
      { $set: { used: true } }
    );
  }

  // Update user
  static async updateUser(id: string, updateData: Partial<User>, updatedBy?: string): Promise<User | null> {
    const db = await getDatabase();
    
    const updateDoc: any = {
      ...updateData,
      updatedAt: new Date()
    };

    if (updatedBy) {
      updateDoc.updatedBy = updatedBy;
    }

    // Hash password if provided
    if (updateData.password) {
      updateDoc.password = await this.hashPassword(updateData.password);
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    return result as User | null;
  }

  // Delete user (soft delete)
  static async deleteUser(id: string): Promise<boolean> {
    const db = await getDatabase();
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  }

  // Get all users
  static async getAllUsers(): Promise<User[]> {
    const db = await getDatabase();
    const users = await db.collection('users')
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Remove passwords from response
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }) as User[];
  }

  // Create default admin user
  static async createDefaultAdmin(): Promise<void> {
    const db = await getDatabase();
    
    // Check if admin exists
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@mazoony.com' });
    if (existingAdmin) {
      return;
    }

    // Create default admin
    const adminUser: Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'loginAttempts' | 'lastLogin'> = {
      name: 'مدير النظام',
      email: 'admin@mazoony.com',
      password: 'admin123',
      role: 'admin',
      permissions: [
        'cities:read', 'cities:write',
        'sheikhs:read', 'sheikhs:write',
        'reviews:read', 'reviews:moderate',
        'messages:read', 'messages:reply',
        'users:read', 'users:write',
        'settings:read', 'settings:write',
        'analytics:read'
      ],
      isActive: true,
      profile: {
        department: 'الإدارة'
      },
      settings: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        language: 'ar',
        timezone: 'Asia/Riyadh'
      }
    };

    await this.createUser(adminUser);
  }

  // Validate permissions
  static hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission) || userPermissions.includes('*');
  }

  // Get role permissions
  static getRolePermissions(role: 'admin' | 'manager' | 'editor'): string[] {
    const permissions = {
      admin: ['*'], // All permissions
      manager: [
        'cities:read', 'cities:write',
        'sheikhs:read', 'sheikhs:write',
        'reviews:read', 'reviews:moderate',
        'messages:read', 'messages:reply',
        'users:read',
        'analytics:read'
      ],
      editor: [
        'cities:read',
        'sheikhs:read', 'sheikhs:write',
        'reviews:read',
        'messages:read'
      ]
    };

    return permissions[role] || [];
  }
}
