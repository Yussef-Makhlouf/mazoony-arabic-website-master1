import { getDatabase } from '../lib/mongodb'

async function checkSheikhData() {
  try {
    console.log('التحقق من بيانات الشيخ...')
    
    const db = await getDatabase()
    
    // البحث بالاسم
    const sheikhByName = await db.collection('sheikhs').findOne({ 
      name: { $regex: 'yussef', $options: 'i' } 
    })
    
    if (sheikhByName) {
      console.log('تم العثور على الشيخ بالاسم:')
      console.log('ID:', sheikhByName._id)
      console.log('Name:', sheikhByName.name)
      console.log('Slug:', sheikhByName.slug)
      console.log('isActive:', sheikhByName.isActive)
      console.log('verified:', sheikhByName.verified)
      console.log('---')
    }
    
    // البحث بالslug
    const sheikhBySlug = await db.collection('sheikhs').findOne({ 
      slug: 'yussef-makhlouf' 
    })
    
    if (sheikhBySlug) {
      console.log('تم العثور على الشيخ بالslug:')
      console.log('ID:', sheikhBySlug._id)
      console.log('Name:', sheikhBySlug.name)
      console.log('Slug:', sheikhBySlug.slug)
      console.log('isActive:', sheikhBySlug.isActive)
      console.log('verified:', sheikhBySlug.verified)
      console.log('---')
    }
    
    // البحث بدون فلتر isActive
    const sheikhBySlugNoFilter = await db.collection('sheikhs').findOne({ 
      slug: 'yussef-makhlouf' 
    }, { projection: { isActive: 0 } })
    
    if (sheikhBySlugNoFilter) {
      console.log('تم العثور على الشيخ بدون فلتر isActive:')
      console.log('ID:', sheikhBySlugNoFilter._id)
      console.log('Name:', sheikhBySlugNoFilter.name)
      console.log('Slug:', sheikhBySlugNoFilter.slug)
      console.log('verified:', sheikhBySlugNoFilter.verified)
      console.log('---')
    }
    
    // عرض جميع الشيوخ
    const allSheikhs = await db.collection('sheikhs').find({}).toArray()
    console.log(`إجمالي الشيوخ في قاعدة البيانات: ${allSheikhs.length}`)
    
    allSheikhs.forEach((sheikh, index) => {
      console.log(`${index + 1}. ${sheikh.name} (${sheikh.slug}) - Active: ${sheikh.isActive}`)
    })
    
  } catch (error) {
    console.error('خطأ في التحقق من بيانات الشيخ:', error)
  }
}

// تشغيل السكريبت
checkSheikhData()
