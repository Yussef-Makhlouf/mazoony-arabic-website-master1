import { getDatabase } from '../lib/mongodb';
import { AuthService } from '../lib/auth';

async function initializeAuth() {
  try {
    console.log('🔄 تهيئة نظام المصادقة...');
    
    const db = await getDatabase();
    
    // Create collections if they don't exist
    const collections = [
      'users',
      'passwordResetTokens',
      'loginAttempts'
    ];
    
    for (const collection of collections) {
      try {
        await db.createCollection(collection);
        console.log(`✅ تم إنشاء مجموعة ${collection}`);
      } catch (error: any) {
        if (error.code === 48) {
          console.log(`ℹ️  مجموعة ${collection} موجودة بالفعل`);
        } else {
          throw error;
        }
      }
    }
    
    // Create indexes for users collection
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ تم إنشاء فهرس البريد الإلكتروني للمستخدمين');
    
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ isActive: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    await db.collection('users').createIndex({ lastLogin: -1 });
    console.log('✅ تم إنشاء فهارس المستخدمين');
    
    // Create indexes for password reset tokens
    await db.collection('passwordResetTokens').createIndex({ token: 1 }, { unique: true });
    await db.collection('passwordResetTokens').createIndex({ userId: 1 });
    await db.collection('passwordResetTokens').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    console.log('✅ تم إنشاء فهارس رموز استعادة كلمة المرور');
    
    // Create indexes for login attempts
    await db.collection('loginAttempts').createIndex({ email: 1 });
    await db.collection('loginAttempts').createIndex({ ipAddress: 1 });
    await db.collection('loginAttempts').createIndex({ createdAt: -1 });
    // Auto-delete login attempts after 30 days
    await db.collection('loginAttempts').createIndex({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
    console.log('✅ تم إنشاء فهارس محاولات تسجيل الدخول');
    
    // Create default admin user
    await AuthService.createDefaultAdmin();
    console.log('✅ تم إنشاء المستخدم الافتراضي للإدارة');
    
    console.log('🎉 تم تهيئة نظام المصادقة بنجاح!');
    console.log('');
    console.log('📧 البريد الإلكتروني للمدير: admin@mazoony.com');
    console.log('🔐 كلمة المرور: admin123');
    console.log('');
    console.log('⚠️  يرجى تغيير كلمة المرور الافتراضية بعد تسجيل الدخول');
    
  } catch (error) {
    console.error('❌ خطأ في تهيئة نظام المصادقة:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run initialization
initializeAuth();
