import { getDatabase } from '../lib/mongodb'

async function checkCityData() {
  try {
    console.log('التحقق من بيانات المدن...')
    
    const db = await getDatabase()
    const cities = await db.collection('cities').find({}).toArray()
    
    console.log(`تم العثور على ${cities.length} مدينة:`)
    
    cities.forEach((city, index) => {
      console.log(`${index + 1}. ${city.name}`)
      console.log(`   ID: ${city._id} (type: ${typeof city._id})`)
      console.log(`   Slug: ${city.slug}`)
      console.log(`   Count: ${city.count}`)
      console.log('---')
    })
    
  } catch (error) {
    console.error('خطأ في التحقق من بيانات المدن:', error)
  }
}

// تشغيل السكريبت
checkCityData()
