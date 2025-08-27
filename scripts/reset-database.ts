#!/usr/bin/env tsx

import { connectToDatabase, closeConnection } from '../lib/mongodb';

async function resetDatabase() {
  try {
    console.log('⚠️  تحذير: سيتم حذف جميع البيانات من قاعدة البيانات!');
    console.log('هل أنت متأكد من المتابعة؟ (y/N)');
    
    // في بيئة تفاعلية، يمكن إضافة تأكيد المستخدم هنا
    // للتبسيط، سنقوم بالمتابعة مباشرة
    
    const { db } = await connectToDatabase();
    
    console.log('🗑️  بدء حذف جميع المجموعات...');
    
    const collections = [
      'cities',
      'sheikhs', 
      'reviews',
      'messages',
      'users',
      'settings',
      'activityLogs',
      'statistics'
    ];

    for (const collectionName of collections) {
      try {
        await db.collection(collectionName).drop();
        console.log(`✅ تم حذف مجموعة: ${collectionName}`);
      } catch (error: any) {
        if (error.code === 26) { // Collection doesn't exist
          console.log(`ℹ️ المجموعة غير موجودة: ${collectionName}`);
        } else {
          console.error(`❌ خطأ في حذف مجموعة ${collectionName}:`, error);
        }
      }
    }
    
    console.log('✅ تم حذف جميع البيانات بنجاح');
    console.log('');
    console.log('💡 لتشغيل قاعدة البيانات مرة أخرى، استخدم:');
    console.log('   npm run db:init');
    
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين قاعدة البيانات:', error);
    process.exit(1);
  } finally {
    await closeConnection();
  }
}

// تشغيل السكريبت
if (require.main === module) {
  resetDatabase();
}
