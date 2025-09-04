import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { ArticleCategory } from '@/lib/types'

// GET - جلب جميع تصنيفات المقالات
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    
    const isActive = searchParams.get('active')
    
    // إنشاء filter
    const filter: any = {}
    if (isActive === 'true') filter.isActive = true

    // جلب التصنيفات
    const categories = await db.collection('articleCategories')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    // تحويل ObjectId إلى string
    const formattedCategories = categories.map(category => ({
      ...category,
      _id: category._id.toString()
    }))

    return NextResponse.json({
      data: formattedCategories
    })

  } catch (error) {
    console.error('خطأ في جلب تصنيفات المقالات:', error)
    return NextResponse.json(
      { error: 'فشل في جلب تصنيفات المقالات' },
      { status: 500 }
    )
  }
}

// POST - إنشاء تصنيف جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    // تنظيف وتجهيز البيانات
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // التحقق من عدم وجود slug مكرر
    const existingCategory = await db.collection('articleCategories').findOne({ slug })
    if (existingCategory) {
      return NextResponse.json(
        { error: 'يوجد تصنيف آخر بنفس الرابط المختصر' },
        { status: 400 }
      )
    }

    const now = new Date()
    const newCategory: Omit<ArticleCategory, '_id'> = {
      name: body.name,
      slug,
      description: body.description || '',
      color: body.color || '#3B82F6',
      icon: body.icon || '',
      isActive: body.isActive !== undefined ? body.isActive : true,
      articleCount: 0,
      createdAt: now,
      updatedAt: now
    }

    const result = await db.collection('articleCategories').insertOne(newCategory)

    return NextResponse.json({
      data: {
        ...newCategory,
        _id: result.insertedId.toString()
      },
      message: 'تم إنشاء التصنيف بنجاح'
    })

  } catch (error) {
    console.error('خطأ في إنشاء التصنيف:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء التصنيف' },
      { status: 500 }
    )
  }
}
