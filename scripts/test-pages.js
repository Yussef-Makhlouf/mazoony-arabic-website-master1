#!/usr/bin/env node

/**
 * Script لاختبار الصفحات
 * تشغيل: node scripts/test-pages.js
 */

const BASE_URL = 'http://localhost:3000'

async function testPages() {
  console.log('🌐 بدء اختبار الصفحات...\n')

  const pages = [
    {
      name: 'الصفحة الرئيسية',
      path: '/',
      expectedStatus: 200
    },
    {
      name: 'صفحة المدن',
      path: '/cities',
      expectedStatus: 200
    },
    {
      name: 'صفحة المأذون',
      path: '/sheikhs',
      expectedStatus: 200
    },
    {
      name: 'صفحة مدينة الرياض',
      path: '/city/al-riyadh',
      expectedStatus: 200
    },
    {
      name: 'صفحة مأذون محدد',
      path: '/sheikh/abdulrahman-safer-al-malki',
      expectedStatus: 200
    },
    {
      name: 'صفحة التواصل',
      path: '/contact',
      expectedStatus: 200
    },
    {
      name: 'صفحة من نحن',
      path: '/about',
      expectedStatus: 200
    }
  ]

  let passed = 0
  let failed = 0

  for (const page of pages) {
    try {
      console.log(`📄 اختبار: ${page.name}`)
      console.log(`   المسار: ${page.path}`)
      
      const response = await fetch(`${BASE_URL}${page.path}`)
      
      if (response.status === page.expectedStatus) {
        console.log(`   ✅ نجح: ${response.status}`)
        passed++
      } else {
        console.log(`   ❌ فشل: ${response.status} (متوقع: ${page.expectedStatus})`)
        failed++
      }
      
      // التحقق من نوع المحتوى
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('text/html')) {
        console.log(`   📄 نوع المحتوى: HTML`)
      } else {
        console.log(`   ⚠️  نوع المحتوى: ${contentType}`)
      }
      
    } catch (error) {
      console.log(`   ❌ خطأ: ${error.message}`)
      failed++
    }
    console.log('')
  }

  console.log('📊 ملخص النتائج:')
  console.log(`   ✅ نجح: ${passed}`)
  console.log(`   ❌ فشل: ${failed}`)
  console.log(`   📈 النسبة: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)
  
  return { passed, failed }
}

// اختبار صفحات الخطأ
async function testErrorPages() {
  console.log('🚨 اختبار صفحات الخطأ...\n')

  const errorPages = [
    {
      name: 'صفحة غير موجودة',
      path: '/non-existent-page',
      expectedStatus: 404
    },
    {
      name: 'مدينة غير موجودة',
      path: '/city/non-existent-city',
      expectedStatus: 404
    },
    {
      name: 'مأذون غير موجود',
      path: '/sheikh/non-existent-sheikh',
      expectedStatus: 404
    }
  ]

  for (const page of errorPages) {
    try {
      console.log(`📄 اختبار: ${page.name}`)
      console.log(`   المسار: ${page.path}`)
      
      const response = await fetch(`${BASE_URL}${page.path}`)
      
      if (response.status === page.expectedStatus) {
        console.log(`   ✅ نجح: ${response.status}`)
      } else {
        console.log(`   ❌ فشل: ${response.status} (متوقع: ${page.expectedStatus})`)
      }
      
    } catch (error) {
      console.log(`   ❌ خطأ: ${error.message}`)
    }
    console.log('')
  }
}

// اختبار الأداء
async function testPerformance() {
  console.log('⚡ اختبار الأداء...\n')

  const testUrls = [
    '/',
    '/cities',
    '/sheikhs',
    '/city/al-riyadh',
    '/sheikh/abdulrahman-safer-al-malki'
  ]

  for (const url of testUrls) {
    try {
      console.log(`📊 اختبار الأداء: ${url}`)
      
      const startTime = Date.now()
      const response = await fetch(`${BASE_URL}${url}`)
      const endTime = Date.now()
      
      const loadTime = endTime - startTime
      
      if (response.ok) {
        console.log(`   ⏱️  وقت التحميل: ${loadTime}ms`)
        
        if (loadTime < 1000) {
          console.log(`   ✅ سريع (< 1 ثانية)`)
        } else if (loadTime < 3000) {
          console.log(`   ⚠️  متوسط (1-3 ثانية)`)
        } else {
          console.log(`   ❌ بطيء (> 3 ثانية)`)
        }
      } else {
        console.log(`   ❌ فشل: ${response.status}`)
      }
      
    } catch (error) {
      console.log(`   ❌ خطأ: ${error.message}`)
    }
    console.log('')
  }
}

// تشغيل جميع الاختبارات
async function runAllTests() {
  console.log('🚀 بدء اختبار الصفحات\n')
  
  const results = await testPages()
  await testErrorPages()
  await testPerformance()
  
  console.log('✨ انتهى اختبار الصفحات')
  console.log(`📊 النتيجة النهائية: ${results.passed}/${results.passed + results.failed} نجح`)
}

// تشغيل إذا كان الملف مستدعى مباشرة
if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = { testPages, testErrorPages, testPerformance, runAllTests }
