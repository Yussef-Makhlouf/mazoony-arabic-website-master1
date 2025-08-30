import { getDatabase } from '../lib/mongodb'
import { SheikhService } from '../lib/database'

async function testSheikhUpdate() {
  try {
    console.log('اختبار تحديث الشيخ...')
    
    const db = await getDatabase()
    
    // البحث عن الشيخ
    const sheikh = await SheikhService.getSheikhBySlug('yussef-makhlouf')
    
    if (!sheikh) {
      console.log('لم يتم العثور على الشيخ')
      return
    }
    
    console.log('تم العثور على الشيخ:')
    console.log('ID:', sheikh._id)
    console.log('Name:', sheikh.name)
    console.log('Slug:', sheikh.slug)
    console.log('isActive:', sheikh.isActive)
    console.log('verified:', sheikh.verified)
    console.log('---')
    
    // اختبار التحديث
    console.log('محاولة تحديث حالة التحقق...')
    const updateData = { verified: !sheikh.verified }
    
    const updatedSheikh = await SheikhService.updateSheikh(sheikh._id!, updateData)
    
    if (updatedSheikh) {
      console.log('تم التحديث بنجاح:')
      console.log('ID:', updatedSheikh._id)
      console.log('Name:', updatedSheikh.name)
      console.log('verified:', updatedSheikh.verified)
      console.log('updatedAt:', updatedSheikh.updatedAt)
    } else {
      console.log('فشل في التحديث')
    }
    
    // التحقق من التحديث في قاعدة البيانات
    const updatedInDb = await db.collection('sheikhs').findOne({ _id: sheikh._id })
    console.log('---')
    console.log('التحديث في قاعدة البيانات:')
    console.log('verified:', updatedInDb?.verified)
    console.log('updatedAt:', updatedInDb?.updatedAt)
    
  } catch (error) {
    console.error('خطأ في اختبار التحديث:', error)
  }
}

// تشغيل السكريبت
testSheikhUpdate()
