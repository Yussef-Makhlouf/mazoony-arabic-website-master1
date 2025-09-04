import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Article } from '@/lib/types'

interface RouteParams {
  id: string
}

// GET - جلب مقال واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const incrementViews = searchParams.get('incrementViews') === 'true'

    let filter: any
    
    // التحقق من نوع المعرف (ObjectId أم slug)
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) }
    } else {
      filter = { slug: id }
    }

    const article = await db.collection('articles').findOne(filter)

    if (!article) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // زيادة عدد المشاهدات إذا طُلب ذلك
    if (incrementViews) {
      await db.collection('articles').updateOne(
        filter,
        { $inc: { views: 1 } }
      )
      article.views = (article.views || 0) + 1
    }

    // تحويل ObjectId إلى string
    const formattedArticle = {
      ...article,
      _id: article._id.toString()
    }

    return NextResponse.json({ data: formattedArticle })

  } catch (error) {
    console.error('خطأ في جلب المقال:', error)
    return NextResponse.json(
      { error: 'فشل في جلب المقال' },
      { status: 500 }
    )
  }
}

// PUT - تحديث مقال
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'معرف المقال غير صحيح' },
        { status: 400 }
      )
    }

    // التحقق من وجود المقال
    const existingArticle = await db.collection('articles').findOne({
      _id: new ObjectId(id)
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من عدم تكرار الـ slug
    if (body.slug && body.slug !== existingArticle.slug) {
      const slugExists = await db.collection('articles').findOne({
        slug: body.slug,
        _id: { $ne: new ObjectId(id) }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'يوجد مقال آخر بنفس الرابط المختصر' },
          { status: 400 }
        )
      }
    }

    // حساب وقت القراءة إذا تم تحديث المحتوى
    let readingTime = existingArticle.readingTime
    if (body.content && body.content !== existingArticle.content) {
      const wordCount = body.content.split(/\s+/).length
      readingTime = Math.ceil(wordCount / 200)
    }

    const now = new Date()
    const updateData: Partial<Article> = {
      ...body,
      readingTime,
      updatedAt: now,
      updatedBy: body.updatedBy || 'admin'
    }

    // إضافة تاريخ النشر إذا تم تغيير الحالة إلى منشور
    if (body.status === 'published' && existingArticle.status !== 'published') {
      updateData.publishedAt = now
    }

    // إزالة الحقول التي لا يجب تحديثها
    delete updateData._id
    delete updateData.createdAt
    delete updateData.createdBy
    delete updateData.views

    const result = await db.collection('articles').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // تحديث عداد المقالات في التصنيفات
    if (body.category && body.category !== existingArticle.category) {
      // تقليل العداد من التصنيف القديم
      if (existingArticle.category) {
        await db.collection('articleCategories').updateOne(
          { slug: existingArticle.category },
          { $inc: { articleCount: -1 } }
        )
      }
      
      // زيادة العداد في التصنيف الجديد
      await db.collection('articleCategories').updateOne(
        { slug: body.category },
        { $inc: { articleCount: 1 } }
      )
    }

    // جلب المقال المحدث
    const updatedArticle = await db.collection('articles').findOne({
      _id: new ObjectId(id)
    })

    return NextResponse.json({
      data: {
        ...updatedArticle,
        _id: updatedArticle!._id.toString()
      },
      message: 'تم تحديث المقال بنجاح'
    })

  } catch (error) {
    console.error('خطأ في تحديث المقال:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث المقال' },
      { status: 500 }
    )
  }
}

// DELETE - حذف مقال
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'معرف المقال غير صحيح' },
        { status: 400 }
      )
    }

    // جلب المقال قبل الحذف لتحديث عداد التصنيف
    const article = await db.collection('articles').findOne({
      _id: new ObjectId(id)
    })

    if (!article) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    const result = await db.collection('articles').deleteOne({
      _id: new ObjectId(id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // تحديث عداد المقالات في التصنيف
    if (article.category) {
      await db.collection('articleCategories').updateOne(
        { slug: article.category },
        { $inc: { articleCount: -1 } }
      )
    }

    return NextResponse.json({
      message: 'تم حذف المقال بنجاح'
    })

  } catch (error) {
    console.error('خطأ في حذف المقال:', error)
    return NextResponse.json(
      { error: 'فشل في حذف المقال' },
      { status: 500 }
    )
  }
}
