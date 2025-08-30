#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 إعداد المشروع للنشر على Vercel...\n');

// التحقق من الملفات المطلوبة
const requiredFiles = [
  'vercel.json',
  'next.config.mjs',
  'package.json',
  'vercel.env.example'
];

console.log('📋 فحص الملفات المطلوبة:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - مفقود`);
  }
});

// فحص متغيرات البيئة في المثال
console.log('\n📋 فحص متغيرات البيئة:');
if (fs.existsSync('vercel.env.example')) {
  const envContent = fs.readFileSync('vercel.env.example', 'utf8');
  const requiredVars = [
    'MONGODB_URI',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
  ];
  
  requiredVars.forEach(variable => {
    if (envContent.includes(variable)) {
      console.log(`✅ ${variable}`);
    } else {
      console.log(`❌ ${variable} - مفقود`);
    }
  });
} else {
  console.log('❌ ملف vercel.env.example مفقود');
}

// فحص APIs
console.log('\n📋 فحص ملفات API:');
const apiDir = 'app/api';
if (fs.existsSync(apiDir)) {
  const apiRoutes = [
    'cities/route.ts',
    'sheikhs/route.ts',
    'reviews/route.ts',
    'messages/route.ts',
    'test-db/route.ts'
  ];
  
  apiRoutes.forEach(route => {
    const routePath = path.join(apiDir, route);
    if (fs.existsSync(routePath)) {
      console.log(`✅ /api/${route.replace('/route.ts', '')}`);
    } else {
      console.log(`❌ /api/${route.replace('/route.ts', '')} - مفقود`);
    }
  });
} else {
  console.log('❌ مجلد app/api مفقود');
}

console.log('\n📝 الخطوات التالية:');
console.log('1. تأكد من رفع الكود إلى GitHub');
console.log('2. أنشئ حساب في MongoDB Atlas وخذ Connection String');
console.log('3. أنشئ مشروع في Vercel وربطه بـ GitHub');
console.log('4. أضف متغيرات البيئة في إعدادات Vercel');
console.log('5. انشر المشروع');

console.log('\n🔗 روابط مفيدة:');
console.log('- MongoDB Atlas: https://www.mongodb.com/atlas');
console.log('- Vercel: https://vercel.com');
console.log('- دليل النشر: اقرأ ملف DEPLOYMENT_GUIDE.md');

console.log('\n✨ جاهز للنشر!');
