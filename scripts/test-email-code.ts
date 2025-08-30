#!/usr/bin/env ts-node

// Script لاختبار إرسال رمز استعادة كلمة المرور الجديد
import { EmailService } from '../lib/email';

async function testPasswordResetEmail() {
  console.log('🧪 اختبار إرسال رمز استعادة كلمة المرور الجديد...\n');

  // إنشاء رمز تجريبي
  const testCode = 'ABC123';
  const testEmail = 'test@example.com';
  const testUserName = 'المستخدم التجريبي';

  try {
    console.log('📧 إرسال البريد الإلكتروني...');
    console.log(`   البريد: ${testEmail}`);
    console.log(`   الرمز: ${testCode}`);
    console.log(`   المستخدم: ${testUserName}\n`);

    // اختبار إرسال البريد
    const result = await EmailService.sendPasswordResetEmail(testEmail, testCode, testUserName);
    
    if (result.success) {
      console.log('✅ تم إرسال البريد الإلكتروني بنجاح!');
      console.log(`   ID الرسالة: ${result.messageId}`);
    } else {
      console.log('❌ فشل في إرسال البريد الإلكتروني');
    }

  } catch (error: any) {
    console.error('❌ خطأ في إرسال البريد الإلكتروني:', error.message);
    
    // اختبار الاتصال
    console.log('\n🔍 اختبار إعدادات SMTP...');
    try {
      const connectionTest = await EmailService.testConnection();
      if (connectionTest) {
        console.log('✅ إعدادات SMTP صحيحة');
      } else {
        console.log('❌ مشكلة في إعدادات SMTP');
      }
    } catch (connError: any) {
      console.error('❌ خطأ في الاتصال:', connError.message);
    }
  }

  console.log('\n📝 مثال على محتوى البريد الإلكتروني:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`
موضوع البريد: رمز استعادة كلمة المرور - موقع مأذوني

مرحباً ${testUserName},

تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في موقع مأذوني.

رمز استعادة كلمة المرور هو: ${testCode}

يرجى استخدام هذا الرمز في صفحة استعادة كلمة المرور في الموقع.

هذا الرمز صالح لمدة 15 دقيقة فقط.

إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.

موقع مأذوني
  `);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// تشغيل الاختبار
testPasswordResetEmail().catch(console.error);
