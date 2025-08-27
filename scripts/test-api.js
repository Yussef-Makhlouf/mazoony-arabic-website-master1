#!/usr/bin/env node

/**
 * Script لاختبار API routes الجديدة
 * تشغيل: node scripts/test-api.js
 */

const BASE_URL = 'http://localhost:3000/api'

async function testAPI() {
  console.log('🧪 بدء اختبار API routes...\n')

  const tests = [
    {
      name: 'اختبار المدن',
      endpoint: '/cities',
      method: 'GET'
    },
    {
      name: 'اختبار مدينة محددة',
      endpoint: '/cities/al-riyadh',
      method: 'GET'
    },
    {
      name: 'اختبار مأذون مدينة',
      endpoint: '/cities/al-riyadh/sheikhs',
      method: 'GET'
    },
    {
      name: 'اختبار المأذون',
      endpoint: '/sheikhs',
      method: 'GET'
    },
    {
      name: 'اختبار مأذون محدد',
      endpoint: '/sheikhs/abdulrahman-safer-al-malki',
      method: 'GET'
    },
    {
      name: 'اختبار البحث',
      endpoint: '/search?q=الرياض&type=all&limit=5',
      method: 'GET'
    },
    {
      name: 'اختبار الإحصائيات',
      endpoint: '/stats',
      method: 'GET'
    }
  ]

  for (const test of tests) {
    try {
      console.log(`📡 ${test.name}...`)
      const response = await fetch(`${BASE_URL}${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ نجح: ${test.name}`)
        console.log(`   النتائج: ${Array.isArray(data) ? data.length : Object.keys(data).length} عنصر`)
      } else {
        console.log(`❌ فشل: ${test.name} - ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ خطأ: ${test.name} - ${error.message}`)
    }
    console.log('')
  }

  console.log('🏁 انتهى اختبار API routes')
}

// اختبار إضافي للصفحات
async function testPages() {
  console.log('🌐 اختبار الصفحات...\n')

  const pages = [
    '/cities',
    '/city/al-riyadh',
    '/sheikhs',
    '/sheikh/abdulrahman-safer-al-malki'
  ]

  for (const page of pages) {
    try {
      console.log(`📄 اختبار صفحة: ${page}`)
      const response = await fetch(`http://localhost:3000${page}`)
      
      if (response.ok) {
        console.log(`✅ نجح: ${page}`)
      } else {
        console.log(`❌ فشل: ${page} - ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ خطأ: ${page} - ${error.message}`)
    }
  }

  console.log('')
}

// تشغيل الاختبارات
async function runTests() {
  console.log('🚀 بدء اختبار البنية الجديدة\n')
  
  await testAPI()
  await testPages()
  
  console.log('✨ انتهى جميع الاختبارات')
}

// تشغيل إذا كان الملف مستدعى مباشرة
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testAPI, testPages, runTests }
