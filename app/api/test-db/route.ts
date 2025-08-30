import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 اختبار الاتصال بقاعدة البيانات...');
    
    // التحقق من متغيرات البيئة
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MONGODB_URI غير محدد في متغيرات البيئة',
          env: process.env.NODE_ENV
        },
        { status: 500 }
      );
    }

    // محاولة الاتصال
    const { db } = await connectToDatabase();
    
    // اختبار قراءة بسيطة
    const collections = await db.listCollections().toArray();
    
    // إحصائيات سريعة
    const stats = {
      cities: await db.collection('cities').countDocuments(),
      sheikhs: await db.collection('sheikhs').countDocuments(),
      reviews: await db.collection('reviews').countDocuments(),
      messages: await db.collection('messages').countDocuments(),
    };

    return NextResponse.json({
      success: true,
      message: '✅ تم الاتصال بقاعدة البيانات بنجاح',
      environment: process.env.NODE_ENV,
      database: {
        connected: true,
        collections: collections.length,
        stats: stats
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'فشل الاتصال بقاعدة البيانات',
        details: error.message,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
