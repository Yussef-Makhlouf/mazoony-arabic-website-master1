# إصلاح مشكلة النشر على Vercel

## المشكلة
كان الموقع يحاول الاتصال بـ `localhost:3000` أثناء عملية البناء على Vercel، مما يسبب فشل في البناء.

## الحلول المطبقة

### 1. إصلاح API Base URL
- تم تحديث `lib/api.ts` لاستخدام URL صحيح للإنتاج
- إضافة منطق للتحقق من البيئة (development vs production)

### 2. إزالة البيانات الثابتة
- تم إزالة جميع البيانات الثابتة من الموقع
- الموقع يعتمد بالكامل على API calls
- في حالة فشل API، يتم عرض صفحات فارغة

### 3. إزالة إعدادات CORS
- تم إزالة إعدادات CORS من `next.config.mjs`
- تبسيط إعدادات النشر

## خطوات النشر على Vercel

### 1. إعداد متغيرات البيئة
في لوحة تحكم Vercel، أضف المتغيرات التالية:

```
MONGODB_URI=mongodb+srv://myAtlasDBUser:yussefali2134@myatlasclusteredu.lh95gxv.mongodb.net/mazoony_db?retryWrites=true&w=majority&appName=myAtlasClusterEDU

NEXTAUTH_SECRET=your-production-super-secret-key-here-change-this-immediately
NEXTAUTH_URL=https://mazoony-arabic-website-master1.vercel.app/

ADMIN_EMAIL=admin@mazoony.com
ADMIN_PASSWORD=secure-production-password-123

NEXT_PUBLIC_SITE_URL=https://mazoony-arabic-website-master1.vercel.app/
NEXT_PUBLIC_API_URL=https://mazoony-arabic-website-master1.vercel.app/api

EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

VERCEL=1
NODE_ENV=production
```

### 2. إعداد قاعدة البيانات
تأكد من أن:
- MongoDB Atlas متاح ومتصل
- المستخدم لديه صلاحيات القراءة والكتابة
- الشبكة مسموح لها بالوصول (0.0.0.0/0)

### 3. النشر
1. ادفع التغييرات إلى GitHub
2. Vercel سيقوم بالبناء تلقائياً
3. تأكد من أن البناء نجح

## التحقق من النشر
بعد النشر، تحقق من:
1. الصفحة الرئيسية تعمل
2. صفحة المدن تعمل
3. صفحة المأذونين تعمل
4. API endpoints تعمل
5. قاعدة البيانات متصلة

## ملاحظات مهمة
- الموقع لا يحتوي على أي بيانات ثابتة
- جميع البيانات تأتي من قاعدة البيانات عبر API
- في حالة فشل الاتصال بقاعدة البيانات، ستظهر صفحات فارغة
- تأكد من تحديث كلمات المرور في الإنتاج
- تأكد من أن قاعدة البيانات متاحة ومتصل بها

