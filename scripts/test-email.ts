import { EmailService } from '../lib/email';

async function testEmailService() {
  console.log('🧪 اختبار خدمة البريد الإلكتروني...');
  
  try {
    // اختبار الاتصال
    console.log('🔄 اختبار الاتصال بخادم SMTP...');
    const connectionTest = await EmailService.testConnection();
    
    if (connectionTest) {
      console.log('✅ تم الاتصال بخادم SMTP بنجاح');
      
      // اختبار إرسال بريد إلكتروني
      console.log('🔄 اختبار إرسال بريد إلكتروني...');
      
      const testEmail = process.env.EMAIL_USER || 'test@example.com';
      const testToken = 'test-token-12345';
      
      await EmailService.sendPasswordResetEmail(testEmail, testToken, 'مستخدم تجريبي');
      console.log('✅ تم إرسال بريد استعادة كلمة المرور بنجاح');
      
      // اختبار بريد الترحيب
      await EmailService.sendWelcomeEmail(testEmail, 'مستخدم جديد', 'password123');
      console.log('✅ تم إرسال بريد الترحيب بنجاح');
      
      console.log('🎉 جميع اختبارات البريد الإلكتروني نجحت!');
      
    } else {
      console.log('❌ فشل في الاتصال بخادم SMTP');
      console.log('يرجى التحقق من إعدادات البريد الإلكتروني في .env.local:');
      console.log('- EMAIL_USER');
      console.log('- EMAIL_APP_PASSWORD');
    }
    
  } catch (error) {
    console.error('❌ خطأ في اختبار البريد الإلكتروني:', error);
    console.log('\n💡 نصائح لحل المشكلة:');
    console.log('1. تأكد من صحة كلمة مرور التطبيق (App Password)');
    console.log('2. تأكد من تفعيل التحقق بخطوتين في حساب Gmail');
    console.log('3. تحقق من إعدادات البريد الإلكتروني في .env.local');
    console.log('4. تأكد من الاتصال بالإنترنت');
  } finally {
    process.exit(0);
  }
}

// تشغيل الاختبار
testEmailService();
