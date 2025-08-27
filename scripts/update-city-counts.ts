import { CityService } from '../lib/database'

async function updateCityCounts() {
  try {
    console.log('بدء تحديث عدد المأذونين في المدن...')
    
    await CityService.updateCityCounts()
    
    console.log('تم تحديث عدد المأذونين بنجاح!')
    
    // عرض المدن مع الأعداد المحدثة
    const cities = await CityService.getCitiesWithActualCounts()
    
    console.log('\nعدد المأذونين في كل مدينة:')
    cities.forEach(city => {
      console.log(`${city.name}: ${city.count} مأذون`)
    })
    
  } catch (error) {
    console.error('خطأ في تحديث عدد المأذونين:', error)
  }
}

// تشغيل السكريبت
updateCityCounts()
