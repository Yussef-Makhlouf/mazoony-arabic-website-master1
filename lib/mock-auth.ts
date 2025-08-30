// Mock authentication service للاختبار بدون قاعدة بيانات
export class MockAuthService {
  
  // Mock user data
  private static mockUsers = [
    {
      _id: '1',
      name: 'مدير النظام',
      email: 'admin@mazoony.com',
      password: 'admin123', // في الواقع يجب أن تكون مشفرة
      role: 'admin' as const,
      permissions: ['*'],
      isActive: true
    },
    {
      _id: '2', 
      name: 'يوسف مخلوف',
      email: 'yussef.ali.it@gmail.com',
      password: 'test123',
      role: 'admin' as const,
      permissions: ['*'],
      isActive: true
    }
  ];

  // Mock reset tokens
  private static resetTokens = new Map<string, { userId: string; email: string; expiresAt: Date }>();

  // Get user by email
  static async getUserByEmail(email: string) {
    const user = this.mockUsers.find(u => u.email === email && u.isActive);
    return user || null;
  }

  // Request password reset (mock)
  static async requestPasswordReset(email: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    // Generate mock token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token
    this.resetTokens.set(token, {
      userId: user._id,
      email: user.email,
      expiresAt
    });

    console.log('🔄 Mock: تم إنشاء رمز الاستعادة:', token);
    return token;
  }

  // Verify reset token (mock)
  static async verifyResetToken(token: string) {
    const tokenData = this.resetTokens.get(token);
    
    if (!tokenData) {
      throw new Error('رمز الاستعادة غير صحيح');
    }

    if (tokenData.expiresAt < new Date()) {
      this.resetTokens.delete(token);
      throw new Error('رمز الاستعادة منتهي الصلاحية');
    }

    const user = this.mockUsers.find(u => u._id === tokenData.userId);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    return {
      ...user,
      email: tokenData.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email
    };
  }

  // Reset password (mock)
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenData = this.resetTokens.get(token);
    
    if (!tokenData) {
      throw new Error('رمز الاستعادة غير صحيح');
    }

    if (tokenData.expiresAt < new Date()) {
      this.resetTokens.delete(token);
      throw new Error('رمز الاستعادة منتهي الصلاحية');
    }

    // Update mock user password
    const userIndex = this.mockUsers.findIndex(u => u._id === tokenData.userId);
    if (userIndex >= 0) {
      this.mockUsers[userIndex].password = newPassword;
      console.log('🔄 Mock: تم تحديث كلمة المرور للمستخدم:', tokenData.email);
    }

    // Remove used token
    this.resetTokens.delete(token);
  }

  // Login (mock)
  static async login(email: string, password: string) {
    const user = this.mockUsers.find(u => u.email === email && u.password === password && u.isActive);
    
    if (!user) {
      throw new Error('بيانات تسجيل الدخول غير صحيحة');
    }

    // Generate mock JWT token
    const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15);
    
    return {
      user: { ...user, password: undefined }, // Don't return password
      token
    };
  }
}
