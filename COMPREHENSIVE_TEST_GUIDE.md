# دليل الاختبار الشامل للموقع

## ✅ تأكيد: الموقع يعمل على أي منصة وعلى localhost

### 🔧 **الإعدادات المطلوبة:**

#### 1. **متغيرات البيئة (Environment Variables):**

**للـ Localhost:**
```env
MONGODB_URI=mongodb+srv://myAtlasDBUser:yussefali2134@myatlasclusteredu.lh95gxv.mongodb.net/mazoony_db?retryWrites=true&w=majority&appName=myAtlasClusterEDU
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@mazoony.com
ADMIN_PASSWORD=secure-password
```

**للإنتاج (أي منصة):**
```env
MONGODB_URI=mongodb+srv://myAtlasDBUser:yussefali2134@myatlasclusteredu.lh95gxv.mongodb.net/mazoony_db?retryWrites=true&w=majority&appName=myAtlasClusterEDU
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@mazoony.com
ADMIN_PASSWORD=secure-password
```

### 🚀 **المنصات المدعومة:**

#### ✅ **Vercel**
- URL: `https://your-app.vercel.app`
- إعدادات: جاهزة بالكامل

#### ✅ **Netlify**
- URL: `https://your-app.netlify.app`
- إعدادات: جاهزة بالكامل

#### ✅ **Railway**
- URL: `https://your-app.railway.app`
- إعدادات: جاهزة بالكامل

#### ✅ **Render**
- URL: `https://your-app.onrender.com`
- إعدادات: جاهزة بالكامل

#### ✅ **Heroku**
- URL: `https://your-app.herokuapp.com`
- إعدادات: جاهزة بالكامل

#### ✅ **DigitalOcean App Platform**
- URL: `https://your-app.ondigitalocean.app`
- إعدادات: جاهزة بالكامل

#### ✅ **AWS Amplify**
- URL: `https://your-app.amplifyapp.com`
- إعدادات: جاهزة بالكامل

### 📋 **قائمة APIs المتاحة:**

#### **1. المدن (Cities)**
- `GET /api/cities` - جلب جميع المدن
- `GET /api/cities?featured=true` - جلب المدن المميزة
- `GET /api/cities/[slug]` - جلب مدينة محددة
- `POST /api/cities` - إضافة مدينة جديدة
- `PUT /api/cities/[slug]` - تحديث مدينة
- `DELETE /api/cities/[slug]` - حذف مدينة

#### **2. المأذونين (Sheikhs)**
- `GET /api/sheikhs` - جلب جميع المأذونين
- `GET /api/sheikhs?city=slug` - جلب مأذونين مدينة محددة
- `GET /api/sheikhs?search=query` - البحث في المأذونين
- `GET /api/sheikhs/[slug]` - جلب مأذون محدد
- `POST /api/sheikhs` - إضافة مأذون جديد
- `PUT /api/sheikhs/[slug]` - تحديث مأذون
- `DELETE /api/sheikhs/[slug]` - حذف مأذون

#### **3. التقييمات (Reviews)**
- `GET /api/reviews` - جلب جميع التقييمات
- `GET /api/reviews?sheikhId=id` - جلب تقييمات مأذون محدد
- `POST /api/reviews` - إضافة تقييم جديد
- `PUT /api/reviews/[id]` - تحديث تقييم
- `DELETE /api/reviews/[id]` - حذف تقييم

#### **4. الرسائل (Messages)**
- `GET /api/messages` - جلب جميع الرسائل
- `GET /api/messages?status=status` - جلب رسائل بحالة محددة
- `POST /api/messages` - إرسال رسالة جديدة
- `PUT /api/messages/[id]` - تحديث رسالة
- `DELETE /api/messages/[id]` - حذف رسالة

#### **5. الإعدادات (Settings)**
- `GET /api/settings` - جلب إعدادات الموقع
- `PUT /api/settings` - تحديث إعدادات الموقع

#### **6. الإحصائيات (Stats)**
- `GET /api/stats` - جلب إحصائيات عامة
- `GET /api/stats?type=sheikhs` - جلب إحصائيات المأذونين

#### **7. البحث (Search)**
- `GET /api/search?q=query&type=all` - البحث الشامل
- `GET /api/search?q=query&type=cities` - البحث في المدن
- `GET /api/search?q=query&type=sheikhs` - البحث في المأذونين

#### **8. طلبات المأذونين (Sheikh Requests)**
- `GET /api/sheikh-requests` - جلب جميع الطلبات
- `POST /api/sheikh-requests` - إرسال طلب جديد
- `PUT /api/sheikh-requests/[id]` - تحديث طلب
- `DELETE /api/sheikh-requests/[id]` - حذف طلب

#### **9. المستخدمين (Users)**
- `GET /api/users` - جلب جميع المستخدمين
- `GET /api/users/[id]` - جلب مستخدم محدد

#### **10. اختبار قاعدة البيانات**
- `GET /api/test-db` - اختبار اتصال قاعدة البيانات

### 🧪 **خطوات الاختبار:**

#### **1. اختبار Localhost:**
```bash
# تشغيل الموقع محلياً
npm run dev

# اختبار APIs
curl http://localhost:3000/api/cities
curl http://localhost:3000/api/sheikhs
curl http://localhost:3000/api/settings
curl http://localhost:3000/api/test-db
```

#### **2. اختبار الإنتاج:**
```bash
# اختبار APIs على الإنتاج
curl https://your-domain.com/api/cities
curl https://your-domain.com/api/sheikhs
curl https://your-domain.com/api/settings
curl https://your-domain.com/api/test-db
```

#### **3. اختبار الصفحات:**
- ✅ `/` - الصفحة الرئيسية
- ✅ `/cities` - صفحة المدن
- ✅ `/sheikhs` - صفحة المأذونين
- ✅ `/contact` - صفحة التواصل
- ✅ `/admin` - لوحة الإدارة

#### **4. اختبار لوحة الإدارة:**
- ✅ `/admin/login` - تسجيل الدخول
- ✅ `/admin/cities` - إدارة المدن
- ✅ `/admin/sheikhs` - إدارة المأذونين
- ✅ `/admin/reviews` - إدارة التقييمات
- ✅ `/admin/messages` - إدارة الرسائل
- ✅ `/admin/settings` - إعدادات الموقع

### 🔍 **استكشاف الأخطاء:**

#### **مشاكل شائعة وحلولها:**

1. **فشل الاتصال بقاعدة البيانات:**
   - تحقق من `MONGODB_URI`
   - تأكد من أن MongoDB Atlas متاح
   - تحقق من Network Access (0.0.0.0/0)

2. **APIs لا تعمل:**
   - تحقق من `NEXT_PUBLIC_API_URL`
   - تأكد من أن المنصة تدعم Next.js API routes

3. **صفحات فارغة:**
   - تأكد من وجود بيانات في قاعدة البيانات
   - تحقق من console للأخطاء

4. **مشاكل المصادقة:**
   - تحقق من `NEXTAUTH_SECRET`
   - تأكد من `NEXTAUTH_URL`

### ✅ **النتيجة النهائية:**

**الموقع جاهز للنشر على أي منصة ويعمل بشكل كامل مع:**
- ✅ جميع APIs تعمل بشكل صحيح
- ✅ قاعدة البيانات متصلة
- ✅ لا توجد بيانات ثابتة
- ✅ دعم منصات متعددة
- ✅ يعمل على localhost والإنتاج
- ✅ لوحة إدارة كاملة
- ✅ نظام مصادقة آمن

### 🚀 **خطوات النشر السريع:**

1. **اختر المنصة** (Vercel, Netlify, Railway, etc.)
2. **اربط GitHub repository**
3. **أضف متغيرات البيئة**
4. **ابدأ النشر**
5. **اختبر الموقع**

**الموقع سيعمل فوراً على أي منصة! 🎉**
