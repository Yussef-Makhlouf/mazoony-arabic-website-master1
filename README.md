# مأذوني - منصة إدارة المأذونين الشرعيين

منصة شاملة لإدارة المأذونين الشرعيين في المملكة العربية السعودية، مع لوحة تحكم متقدمة وقاعدة بيانات MongoDB.

## المميزات

### للمستخدمين
- 🔍 البحث عن المأذونين حسب المدينة
- ⭐ نظام تقييمات ومراجعات
- 📞 معلومات التواصل المباشرة
- 📱 واجهة متجاوبة مع جميع الأجهزة
- 🌐 دعم كامل للغة العربية

### للمديرين
- 📊 لوحة تحكم شاملة مع إحصائيات حية
- 👥 إدارة المدن والمأذونين
- 📝 إدارة التقييمات والمراجعات
- 💬 نظام إدارة الرسائل
- 🔐 نظام مصادقة آمن

## التقنيات المستخدمة

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **UI**: Tailwind CSS, Radix UI
- **Authentication**: Custom Auth System
- **Deployment**: Vercel Ready

## متطلبات النظام

- Node.js 18+ 
- MongoDB (محلي أو Atlas)
- npm أو pnpm

## التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd mazoony-arabic-website
```

### 2. تثبيت التبعيات

```bash
npm install
# أو
pnpm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في المجلد الجذر:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mazoony_db?retryWrites=true&w=majority

# Next.js
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials (تغيير في الإنتاج)
ADMIN_EMAIL=admin@mazoony.com
ADMIN_PASSWORD=secure-password
```

### 4. تهيئة قاعدة البيانات

```bash
# تهيئة قاعدة البيانات مع البيانات الأولية
npm run db:init

# أو إعادة تعيين قاعدة البيانات
npm run db:reset
```

### 5. تشغيل المشروع

```bash
# وضع التطوير
npm run dev

# أو بناء وتشغيل الإنتاج
npm run build
npm start
```

## هيكل المشروع

```
├── app/                    # Next.js App Router
│   ├── admin/             # لوحة التحكم
│   ├── api/               # API Routes
│   ├── city/              # صفحات المدن
│   ├── sheikh/            # صفحات المأذونين
│   └── globals.css        # الأنماط العامة
├── components/            # مكونات React
│   ├── admin/            # مكونات لوحة التحكم
│   └── ui/               # مكونات UI الأساسية
├── lib/                  # المكتبات والخدمات
│   ├── database.ts       # خدمات قاعدة البيانات
│   ├── mongodb.ts        # إعداد MongoDB
│   └── utils.ts          # أدوات مساعدة
├── scripts/              # سكريبتات مساعدة
└── public/               # الملفات العامة
```

## APIs المتاحة

### المدن
- `GET /api/cities` - جلب جميع المدن
- `POST /api/cities` - إضافة مدينة جديدة
- `GET /api/cities/[slug]` - جلب مدينة محددة
- `PUT /api/cities/[slug]` - تحديث مدينة
- `DELETE /api/cities/[slug]` - حذف مدينة

### المأذونين
- `GET /api/sheikhs` - جلب جميع المأذونين
- `POST /api/sheikhs` - إضافة مأذون جديد
- `GET /api/sheikhs/[slug]` - جلب مأذون محدد
- `PUT /api/sheikhs/[slug]` - تحديث مأذون
- `DELETE /api/sheikhs/[slug]` - حذف مأذون

### التقييمات
- `GET /api/reviews?sheikhId=id` - جلب تقييمات مأذون
- `POST /api/reviews` - إضافة تقييم جديد
- `GET /api/reviews?status=pending` - جلب التقييمات المعلقة

### الرسائل
- `GET /api/messages` - جلب جميع الرسائل
- `POST /api/messages` - إرسال رسالة جديدة
- `GET /api/messages?status=new` - جلب الرسائل الجديدة

### الإحصائيات
- `GET /api/stats` - إحصائيات لوحة التحكم
- `GET /api/stats?type=sheikhs` - إحصائيات المأذونين

## لوحة التحكم

يمكن الوصول إلى لوحة التحكم على:
- **التطوير**: http://localhost:3000/admin
- **الإنتاج**: https://your-domain.com/admin

### الميزات المتاحة في لوحة التحكم:
- 📊 إحصائيات شاملة
- 🏙️ إدارة المدن
- 👥 إدارة المأذونين
- ⭐ إدارة التقييمات
- 💬 إدارة الرسائل
- ⚙️ إعدادات النظام

## قاعدة البيانات

### المجموعات (Collections)

#### المدن (cities)
```typescript
{
  _id: string
  name: string
  slug: string
  count: number
  region: string
  population: string
  description: string
  featured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### المأذونين (sheikhs)
```typescript
{
  _id: string
  name: string
  slug: string
  cityId: string
  city: string
  citySlug: string
  phone: string
  whatsapp: string
  rating: number
  reviewCount: number
  specialties: string[]
  experience: string
  availability: "متاح" | "مشغول" | "غير متاح"
  bio: string
  education: string
  languages: string[]
  ratings: {
    commitment: number
    ease: number
    knowledge: number
    price: number
  }
  verified: boolean
  isActive: boolean
  price: string
  image?: string
  createdAt: Date
  updatedAt: Date
}
```

#### التقييمات (reviews)
```typescript
{
  _id: string
  sheikhId: string
  name: string
  phone: string
  email?: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  isVerified: boolean
  reported: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### الرسائل (messages)
```typescript
{
  _id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  sheikhId?: string
  status: "new" | "read" | "replied" | "closed"
  priority: "low" | "medium" | "high"
  type: "general" | "inquiry" | "complaint" | "suggestion"
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

## الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل خادم التطوير
npm run build            # بناء المشروع
npm run start            # تشغيل خادم الإنتاج
npm run lint             # فحص الكود

# قاعدة البيانات
npm run db:init          # تهيئة قاعدة البيانات
npm run db:reset         # إعادة تعيين قاعدة البيانات

# الاختبار
npm run test:api         # اختبار APIs
npm run test:pages       # اختبار الصفحات

# الأدوات
npm run type-check       # فحص الأنواع
npm run format           # تنسيق الكود
npm run format:check     # فحص التنسيق
```

## النشر

### Vercel (موصى به)

1. اربط مشروعك بـ Vercel
2. أضف متغيرات البيئة في إعدادات Vercel
3. انشر المشروع

### خوادم أخرى

```bash
# بناء المشروع
npm run build

# تشغيل الخادم
npm start
```

## الأمان

- ✅ حماية من CSRF
- ✅ التحقق من المدخلات
- ✅ تشفير كلمات المرور
- ✅ حماية من SQL Injection
- ✅ Rate Limiting (يمكن إضافته)

## الدعم

للدعم التقني أو الإبلاغ عن مشاكل:
- 📧 البريد الإلكتروني: support@mazoony.com
- 📱 الهاتف: +966501234567

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

---

**ملاحظة**: تأكد من تغيير كلمات المرور الافتراضية وإعدادات الأمان قبل النشر في الإنتاج.
