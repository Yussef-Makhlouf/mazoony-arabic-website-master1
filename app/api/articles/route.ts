import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Article } from '@/lib/types'

// GET - جلب جميع المقالات
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    
    // إنشاء filter
    const filter: any = {}
    
    if (category) filter.category = category
    if (status) filter.status = status
    if (featured === 'true') filter.featured = true
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // جلب المقالات
    const articles = await db.collection('articles')
      .find(filter)
      .sort({ createdAt: -1, publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // عدد المقالات الإجمالي
    const total = await db.collection('articles').countDocuments(filter)

    // تحويل ObjectId إلى string
    const formattedArticles = articles.map(article => ({
      ...article,
      _id: article._id.toString()
    }))

    return NextResponse.json({
      data: formattedArticles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('خطأ في جلب المقالات:', error)
    return NextResponse.json(
      { error: 'فشل في جلب المقالات' },
      { status: 500 }
    )
  }
}

// POST - إنشاء مقال جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    // تنظيف وتجهيز البيانات
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // التحقق من عدم وجود slug مكرر
    const existingArticle = await db.collection('articles').findOne({ slug })
    if (existingArticle) {
      return NextResponse.json(
        { error: 'يوجد مقال آخر بنفس الرابط المختصر' },
        { status: 400 }
      )
    }

    // حساب وقت القراءة (متوسط 200 كلمة في الدقيقة)
    const wordCount = body.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    const now = new Date()
    const newArticle: Omit<Article, '_id'> = {
      title: body.title,
      slug,
      excerpt: body.excerpt || '',
      content: body.content,
      image: body.image || '',
      author: {
        name: body.author?.name || 'مدير النظام',
        email: body.author?.email || 'admin@mazoony.com',
        avatar: body.author?.avatar || ''
      },
      category: body.category || 'عام',
      tags: body.tags || [],
      status: body.status || 'draft',
      featured: body.featured || false,
      views: 0,
      readingTime,
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.excerpt,
      seoKeywords: body.seoKeywords || [],
      publishedAt: body.status === 'published' ? now : undefined,
      createdAt: now,
      updatedAt: now,
      createdBy: body.createdBy || 'admin',
      updatedBy: body.updatedBy || 'admin'
    }

    const result = await db.collection('articles').insertOne(newArticle)
    
    // تحديث عداد المقالات في التصنيف
    if (body.category) {
      await db.collection('articleCategories').updateOne(
        { slug: body.category },
        { $inc: { articleCount: 1 } }
      )
    }

    return NextResponse.json({
      data: {
        ...newArticle,
        _id: result.insertedId.toString()
      },
      message: 'تم إنشاء المقال بنجاح'
    })

  } catch (error) {
    console.error('خطأ في إنشاء المقال:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء المقال' },
      { status: 500 }
    )
  }
}
