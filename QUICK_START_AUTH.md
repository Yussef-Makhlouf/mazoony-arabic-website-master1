# بدء التشغيل السريع - نظام المصادقة

## 🚀 التشغيل السريع

### 1. إنشاء ملف البيئة

أنشئ ملف `.env.local` في المجلد الرئيسي:

```bash
# MongoDB Connection (استخدم قاعدة بيانات حقيقية)
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/mazoony_db

# JWT Authentication
JWT_SECRET=mazoony-super-secret-jwt-key-for-development-testing-2024
JWT_EXPIRES_IN=7d

# Next.js Configuration
NEXTAUTH_SECRET=mazoony-nextauth-secret-for-development-2024
NEXTAUTH_URL=http://localhost:3000
```

### 2. تهيئة قاعدة البيانات

```bash
npm run auth:init
```

### 3. تشغيل الخادم

```bash
npm run dev
```

## 🔧 إصلاح مشكلة 307 Redirect

إذا واجهت مشكلة إعادة التوجيه 307، اتبع هذه الخطوات:

### الخطوة 1: إيقاف جميع عمليات Node.js

```powershell
taskkill /F /IM node.exe
```

### الخطوة 2: حذف مجلد البناء

```powershell
Remove-Item -Recurse -Force .next
```

### الخطوة 3: تشغيل مع متغيرات البيئة

```powershell
$env:JWT_SECRET="mazoony-super-secret-jwt-key-for-development-testing-2024"
$env:MONGODB_URI="mongodb://localhost:27017/mazoony_test"  # أو قاعدة البيانات الحقيقية
npm run dev
```

## 📱 اختبار النظام

1. **زيارة الصفحة الرئيسية**: http://localhost:3000
2. **محاولة الوصول للوحة التحكم**: http://localhost:3000/admin
   - يجب إعادة التوجيه لصفحة تسجيل الدخول
3. **تسجيل الدخول**: http://localhost:3000/admin/login
   - البريد: `admin@mazoony.com`
   - كلمة المرور: `admin123`

## 🐛 استكشاف الأخطاء

### مشكلة Edge Runtime

إذا ظهر خطأ:
```
Error: The edge runtime does not support Node.js 'crypto' module
```

**الحل**: تم إصلاح هذا في الكود باستخدام مكتبة `jose` بدلاً من `jsonwebtoken` في الـ middleware.

### مشكلة 307 Redirect Loop

إذا كانت صفحة `/admin/login` تعيد التوجيه إلى نفسها:

1. تأكد من أن الـ middleware يستثني صفحات تسجيل الدخول
2. تحقق من وجود ملف `.env.local` مع `JWT_SECRET`
3. أعد بناء المشروع بحذف مجلد `.next`

### مشكلة قاعدة البيانات

إذا لم تعمل قاعدة البيانات:

1. تحقق من `MONGODB_URI` في `.env.local`
2. شغل `npm run auth:init` لتهيئة المجموعات
3. تأكد من وجود اتصال إنترنت (إذا كنت تستخدم MongoDB Atlas)

## 🎯 النتيجة المتوقعة

بعد التشغيل الصحيح:

- ✅ http://localhost:3000/admin/login - صفحة تسجيل الدخول
- ✅ تسجيل الدخول ينقلك لـ `/admin` 
- ✅ الوصول للصفحات المحمية يتطلب تسجيل الدخول
- ✅ تسجيل الخروج يعمل بشكل صحيح
- ✅ استعادة كلمة المرور تعمل
- ✅ إدارة المستخدمين تعمل

## 📞 الدعم

إذا واجهت مشاكل أخرى، تحقق من:

1. `AUTH_SYSTEM_GUIDE.md` - الدليل الشامل
2. `EDGE_RUNTIME_FIX.md` - إصلاحات Edge Runtime
3. ملفات التوثيق الأخرى في المشروع
