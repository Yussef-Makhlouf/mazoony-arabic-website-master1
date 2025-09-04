# دليل النشر على منصات متعددة

## ✅ الموقع الآن يدعم النشر على أي منصة

### المنصات المدعومة:
- **Vercel** (الأساسية)
- **Netlify**
- **Railway**
- **Render**
- **Heroku**
- **DigitalOcean App Platform**
- **AWS Amplify**
- **أي منصة تدعم Next.js**

## إعدادات متغيرات البيئة لكل منصة

### 1. Vercel
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

### 2. Netlify
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
NEXT_PUBLIC_API_URL=https://your-app.netlify.app/api
NEXTAUTH_URL=https://your-app.netlify.app
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

### 3. Railway
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NEXT_PUBLIC_SITE_URL=https://your-app.railway.app
NEXT_PUBLIC_API_URL=https://your-app.railway.app/api
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

### 4. Render
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NEXT_PUBLIC_SITE_URL=https://your-app.onrender.com
NEXT_PUBLIC_API_URL=https://your-app.onrender.com/api
NEXTAUTH_URL=https://your-app.onrender.com
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

### 5. Heroku
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NEXT_PUBLIC_SITE_URL=https://your-app.herokuapp.com
NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com/api
NEXTAUTH_URL=https://your-app.herokuapp.com
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

## خطوات النشر على أي منصة

### 1. إعداد قاعدة البيانات
- استخدم MongoDB Atlas (مجاني)
- أو أي خدمة MongoDB أخرى
- تأكد من إعداد Network Access للسماح بالوصول من أي IP (0.0.0.0/0)

### 2. إعداد متغيرات البيئة
- أضف جميع المتغيرات المطلوبة في لوحة تحكم المنصة
- تأكد من استخدام URL الصحيح للمنصة

### 3. رفع الكود
- ادفع الكود إلى GitHub
- اربط المستودع بالمنصة
- ابدأ عملية النشر

### 4. التحقق من النشر
- تحقق من أن الموقع يعمل
- اختبر API endpoints
- تأكد من اتصال قاعدة البيانات

## ملاحظات مهمة

### ✅ المميزات:
- **لا توجد بيانات ثابتة** - جميع البيانات من قاعدة البيانات
- **API endpoints مرنة** - تعمل مع أي منصة
- **إعدادات قابلة للتخصيص** - عبر متغيرات البيئة
- **دعم MongoDB Atlas** - قاعدة بيانات سحابية موثوقة

### ⚠️ متطلبات:
- **MongoDB Atlas** أو قاعدة بيانات MongoDB أخرى
- **متغيرات البيئة** مُعدة بشكل صحيح
- **شبكة قاعدة البيانات** مفتوحة للوصول العام

### 🔧 استكشاف الأخطاء:
1. **فشل الاتصال بقاعدة البيانات**: تحقق من MONGODB_URI
2. **API لا يعمل**: تحقق من NEXT_PUBLIC_API_URL
3. **صفحات فارغة**: تأكد من وجود بيانات في قاعدة البيانات
4. **مشاكل المصادقة**: تحقق من NEXTAUTH_SECRET

## اختبار الموقع بعد النشر

### 1. الصفحات الأساسية:
- `/` - الصفحة الرئيسية
- `/cities` - صفحة المدن
- `/sheikhs` - صفحة المأذونين
- `/contact` - صفحة التواصل

### 2. API Endpoints:
- `/api/cities` - قائمة المدن
- `/api/sheikhs` - قائمة المأذونين
- `/api/settings` - إعدادات الموقع
- `/api/stats` - إحصائيات

### 3. لوحة الإدارة:
- `/admin` - لوحة التحكم
- `/admin/login` - تسجيل الدخول
- `/admin/cities` - إدارة المدن
- `/admin/sheikhs` - إدارة المأذونين

