# تهيئة قاعدة بيانات MongoDB - موقع مأذوني

## نظرة عامة على قاعدة البيانات

هذا الملف يحتوي على التهيئة الكاملة لقاعدة بيانات MongoDB لموقع مأذوني، وهو نظام إدارة المأذونين الشرعيين في المملكة العربية السعودية.

## 📊 المجموعات (Collections)

### 1. المدن (Cities)

```javascript
{
  _id: ObjectId,
  name: String,           // اسم المدينة بالعربية
  slug: String,           // الرابط المختصر
  region: String,         // المنطقة الإدارية
  population: String,     // عدد السكان
  description: String,    // وصف المدينة
  featured: Boolean,      // هل المدينة مميزة
  count: Number,          // عدد المأذونين في المدينة
  isActive: Boolean,      // حالة المدينة (نشطة/غير نشطة)
  createdAt: Date,        // تاريخ الإنشاء
  updatedAt: Date,        // تاريخ التحديث
  createdBy: ObjectId,    // معرف المستخدم الذي أنشأ المدينة
  updatedBy: ObjectId     // معرف المستخدم الذي حدث المدينة
}
```

**الفهارس (Indexes):**
```javascript
db.cities.createIndex({ "slug": 1 }, { unique: true })
db.cities.createIndex({ "region": 1 })
db.cities.createIndex({ "featured": 1 })
db.cities.createIndex({ "isActive": 1 })
db.cities.createIndex({ "createdAt": -1 })
```

### 2. المأذونين (Sheikhs)

```javascript
{
  _id: ObjectId,
  name: String,           // اسم المأذون
  slug: String,           // الرابط المختصر
  cityId: ObjectId,       // معرف المدينة (مرجع)
  cityName: String,       // اسم المدينة (للعرض السريع)
  citySlug: String,       // رابط المدينة (للعرض السريع)
  phone: String,          // رقم الهاتف
  whatsapp: String,       // رقم الواتساب
  email: String,          // البريد الإلكتروني
  rating: Number,         // التقييم العام (0-5)
  reviewCount: Number,    // عدد التقييمات
  specialties: [String],  // التخصصات
  experience: String,     // سنوات الخبرة
  availability: String,   // حالة التوفر (متاح/مشغول/غير متاح)
  bio: String,            // السيرة الذاتية
  education: String,      // المؤهل العلمي
  languages: [String],    // اللغات المتحدثة
  ratings: {
    commitment: Number,   // التقييم في الالتزام
    ease: Number,         // التقييم في سهولة التعامل
    knowledge: Number,    // التقييم في المعرفة
    price: Number         // التقييم في السعر
  },
  verified: Boolean,      // هل المأذون موثق
  price: String,          // السعر
  image: String,          // صورة المأذون
  documents: [{           // الوثائق المرفقة
    type: String,         // نوع الوثيقة
    url: String,          // رابط الوثيقة
    verified: Boolean,    // هل تم التحقق من الوثيقة
    uploadedAt: Date      // تاريخ رفع الوثيقة
  }],
  isActive: Boolean,      // حالة المأذون (نشط/غير نشط)
  createdAt: Date,        // تاريخ الإنشاء
  updatedAt: Date,        // تاريخ التحديث
  createdBy: ObjectId,    // معرف المستخدم الذي أنشأ المأذون
  updatedBy: ObjectId     // معرف المستخدم الذي حدث المأذون
}
```

**الفهارس (Indexes):**
```javascript
db.sheikhs.createIndex({ "slug": 1 }, { unique: true })
db.sheikhs.createIndex({ "cityId": 1 })
db.sheikhs.createIndex({ "citySlug": 1 })
db.sheikhs.createIndex({ "availability": 1 })
db.sheikhs.createIndex({ "verified": 1 })
db.sheikhs.createIndex({ "rating": -1 })
db.sheikhs.createIndex({ "isActive": 1 })
db.sheikhs.createIndex({ "createdAt": -1 })
db.sheikhs.createIndex({ "specialties": 1 })
db.sheikhs.createIndex({ "languages": 1 })
```

### 3. التقييمات (Reviews)

```javascript
{
  _id: ObjectId,
  sheikhId: ObjectId,     // معرف المأذون (مرجع)
  sheikhName: String,     // اسم المأذون (للعرض السريع)
  sheikhSlug: String,     // رابط المأذون (للعرض السريع)
  name: String,           // اسم مقدم التقييم
  phone: String,          // رقم هاتف مقدم التقييم
  email: String,          // البريد الإلكتروني (اختياري)
  rating: Number,         // التقييم (1-5)
  comment: String,        // التعليق
  ratings: {              // التقييمات التفصيلية
    commitment: Number,   // الالتزام
    ease: Number,         // سهولة التعامل
    knowledge: Number,    // المعرفة
    price: Number         // السعر
  },
  status: String,         // حالة التقييم (pending/approved/rejected)
  isVerified: Boolean,    // هل تم التحقق من التقييم
  reported: Boolean,      // هل تم الإبلاغ عن التقييم
  reportReason: String,   // سبب الإبلاغ
  createdAt: Date,        // تاريخ إنشاء التقييم
  updatedAt: Date,        // تاريخ تحديث التقييم
  approvedAt: Date,       // تاريخ الموافقة
  approvedBy: ObjectId,   // معرف المستخدم الذي وافق على التقييم
  ipAddress: String,      // عنوان IP مقدم التقييم
  userAgent: String       // متصفح مقدم التقييم
}
```

**الفهارس (Indexes):**
```javascript
db.reviews.createIndex({ "sheikhId": 1 })
db.reviews.createIndex({ "status": 1 })
db.reviews.createIndex({ "rating": -1 })
db.reviews.createIndex({ "createdAt": -1 })
db.reviews.createIndex({ "isVerified": 1 })
db.reviews.createIndex({ "reported": 1 })
db.reviews.createIndex({ "phone": 1 })
db.reviews.createIndex({ "email": 1 })
```

### 4. الرسائل (Messages)

```javascript
{
  _id: ObjectId,
  name: String,           // اسم المرسل
  email: String,          // البريد الإلكتروني
  phone: String,          // رقم الهاتف
  subject: String,        // موضوع الرسالة
  message: String,        // محتوى الرسالة
  type: String,           // نوع الرسالة (contact/complaint/inquiry)
  priority: String,       // الأولوية (low/medium/high)
  status: String,         // حالة الرسالة (new/read/replied/closed)
  sheikhId: ObjectId,     // معرف المأذون (إذا كانت الرسالة متعلقة بمأذون)
  sheikhName: String,     // اسم المأذون (للعرض السريع)
  replies: [{             // الردود على الرسالة
    message: String,      // محتوى الرد
    repliedBy: ObjectId,  // معرف المستخدم الذي رد
    repliedAt: Date       // تاريخ الرد
  }],
  tags: [String],         // علامات للتصنيف
  createdAt: Date,        // تاريخ إنشاء الرسالة
  updatedAt: Date,        // تاريخ تحديث الرسالة
  readAt: Date,           // تاريخ قراءة الرسالة
  readBy: ObjectId,       // معرف المستخدم الذي قرأ الرسالة
  ipAddress: String,      // عنوان IP المرسل
  userAgent: String       // متصفح المرسل
}
```

**الفهارس (Indexes):**
```javascript
db.messages.createIndex({ "status": 1 })
db.messages.createIndex({ "priority": 1 })
db.messages.createIndex({ "type": 1 })
db.messages.createIndex({ "createdAt": -1 })
db.messages.createIndex({ "email": 1 })
db.messages.createIndex({ "phone": 1 })
db.messages.createIndex({ "sheikhId": 1 })
db.messages.createIndex({ "tags": 1 })
```

### 5. المستخدمين (Users)

```javascript
{
  _id: ObjectId,
  name: String,           // اسم المستخدم
  email: String,          // البريد الإلكتروني
  password: String,       // كلمة المرور (مشفرة)
  role: String,           // الدور (admin/manager/editor)
  permissions: [String],  // الصلاحيات
  isActive: Boolean,      // حالة المستخدم
  lastLogin: Date,        // آخر تسجيل دخول
  loginAttempts: Number,  // عدد محاولات تسجيل الدخول
  lockedUntil: Date,      // تاريخ إلغاء القفل
  profile: {
    avatar: String,       // الصورة الشخصية
    phone: String,        // رقم الهاتف
    department: String    // القسم
  },
  settings: {             // إعدادات المستخدم
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    language: String,     // اللغة المفضلة
    timezone: String      // المنطقة الزمنية
  },
  createdAt: Date,        // تاريخ الإنشاء
  updatedAt: Date,        // تاريخ التحديث
  createdBy: ObjectId,    // معرف المستخدم الذي أنشأ الحساب
  updatedBy: ObjectId     // معرف المستخدم الذي حدث الحساب
}
```

**الفهارس (Indexes):**
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "isActive": 1 })
db.users.createIndex({ "createdAt": -1 })
db.users.createIndex({ "lastLogin": -1 })
```

### 6. الإعدادات (Settings)

```javascript
{
  _id: ObjectId,
  key: String,            // مفتاح الإعداد
  value: Mixed,           // قيمة الإعداد
  type: String,           // نوع القيمة (string/number/boolean/object)
  category: String,       // فئة الإعداد
  description: String,    // وصف الإعداد
  isPublic: Boolean,      // هل الإعداد عام
  updatedAt: Date,        // تاريخ التحديث
  updatedBy: ObjectId     // معرف المستخدم الذي حدث الإعداد
}
```

**الفهارس (Indexes):**
```javascript
db.settings.createIndex({ "key": 1 }, { unique: true })
db.settings.createIndex({ "category": 1 })
db.settings.createIndex({ "isPublic": 1 })
```

### 7. سجل النشاط (Activity Logs)

```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // معرف المستخدم
  userName: String,       // اسم المستخدم (للعرض السريع)
  action: String,         // نوع العملية
  resource: String,       // نوع المورد
  resourceId: ObjectId,   // معرف المورد
  details: Object,        // تفاصيل العملية
  ipAddress: String,      // عنوان IP
  userAgent: String,      // متصفح المستخدم
  createdAt: Date         // تاريخ العملية
}
```

**الفهارس (Indexes):**
```javascript
db.activityLogs.createIndex({ "userId": 1 })
db.activityLogs.createIndex({ "action": 1 })
db.activityLogs.createIndex({ "resource": 1 })
db.activityLogs.createIndex({ "createdAt": -1 })
db.activityLogs.createIndex({ "ipAddress": 1 })
```

### 8. الإحصائيات (Statistics)

```javascript
{
  _id: ObjectId,
  date: Date,             // التاريخ
  type: String,           // نوع الإحصائية
  metrics: {              // المقاييس
    totalCities: Number,
    totalSheikhs: Number,
    totalReviews: Number,
    totalMessages: Number,
    activeSheikhs: Number,
    verifiedSheikhs: Number,
    averageRating: Number,
    newRegistrations: Number,
    pageViews: Number,
    uniqueVisitors: Number
  },
  breakdown: {            // التفصيل حسب المدينة
    cities: [{
      cityId: ObjectId,
      cityName: String,
      sheikhCount: Number,
      reviewCount: Number,
      averageRating: Number
    }]
  },
  createdAt: Date         // تاريخ إنشاء الإحصائية
}
```

**الفهارس (Indexes):**
```javascript
db.statistics.createIndex({ "date": 1 })
db.statistics.createIndex({ "type": 1 })
db.statistics.createIndex({ "createdAt": -1 })
```

## 🔧 سكريبت إنشاء قاعدة البيانات

```javascript
// إنشاء قاعدة البيانات
use mazoony_db

// إنشاء المجموعات
db.createCollection("cities")
db.createCollection("sheikhs")
db.createCollection("reviews")
db.createCollection("messages")
db.createCollection("users")
db.createCollection("settings")
db.createCollection("activityLogs")
db.createCollection("statistics")

// إنشاء الفهارس للمدن
db.cities.createIndex({ "slug": 1 }, { unique: true })
db.cities.createIndex({ "region": 1 })
db.cities.createIndex({ "featured": 1 })
db.cities.createIndex({ "isActive": 1 })
db.cities.createIndex({ "createdAt": -1 })

// إنشاء الفهارس للمأذونين
db.sheikhs.createIndex({ "slug": 1 }, { unique: true })
db.sheikhs.createIndex({ "cityId": 1 })
db.sheikhs.createIndex({ "citySlug": 1 })
db.sheikhs.createIndex({ "availability": 1 })
db.sheikhs.createIndex({ "verified": 1 })
db.sheikhs.createIndex({ "rating": -1 })
db.sheikhs.createIndex({ "isActive": 1 })
db.sheikhs.createIndex({ "createdAt": -1 })
db.sheikhs.createIndex({ "specialties": 1 })
db.sheikhs.createIndex({ "languages": 1 })

// إنشاء الفهارس للتقييمات
db.reviews.createIndex({ "sheikhId": 1 })
db.reviews.createIndex({ "status": 1 })
db.reviews.createIndex({ "rating": -1 })
db.reviews.createIndex({ "createdAt": -1 })
db.reviews.createIndex({ "isVerified": 1 })
db.reviews.createIndex({ "reported": 1 })
db.reviews.createIndex({ "phone": 1 })
db.reviews.createIndex({ "email": 1 })

// إنشاء الفهارس للرسائل
db.messages.createIndex({ "status": 1 })
db.messages.createIndex({ "priority": 1 })
db.messages.createIndex({ "type": 1 })
db.messages.createIndex({ "createdAt": -1 })
db.messages.createIndex({ "email": 1 })
db.messages.createIndex({ "phone": 1 })
db.messages.createIndex({ "sheikhId": 1 })
db.messages.createIndex({ "tags": 1 })

// إنشاء الفهارس للمستخدمين
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "isActive": 1 })
db.users.createIndex({ "createdAt": -1 })
db.users.createIndex({ "lastLogin": -1 })

// إنشاء الفهارس للإعدادات
db.settings.createIndex({ "key": 1 }, { unique: true })
db.settings.createIndex({ "category": 1 })
db.settings.createIndex({ "isPublic": 1 })

// إنشاء الفهارس لسجل النشاط
db.activityLogs.createIndex({ "userId": 1 })
db.activityLogs.createIndex({ "action": 1 })
db.activityLogs.createIndex({ "resource": 1 })
db.activityLogs.createIndex({ "createdAt": -1 })
db.activityLogs.createIndex({ "ipAddress": 1 })

// إنشاء الفهارس للإحصائيات
db.statistics.createIndex({ "date": 1 })
db.statistics.createIndex({ "type": 1 })
db.statistics.createIndex({ "createdAt": -1 })

// إنشاء مستخدم مدير افتراضي
db.users.insertOne({
  name: "مدير النظام",
  email: "admin@mazoony.com",
  password: "$2b$10$hashed_password_here", // يجب تشفير كلمة المرور
  role: "admin",
  permissions: ["all"],
  isActive: true,
  profile: {
    avatar: "",
    phone: "",
    department: "الإدارة العامة"
  },
  settings: {
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    language: "ar",
    timezone: "Asia/Riyadh"
  },
  createdAt: new Date(),
  updatedAt: new Date()
})

// إنشاء الإعدادات الافتراضية
const defaultSettings = [
  {
    key: "site_name",
    value: "مأذوني",
    type: "string",
    category: "general",
    description: "اسم الموقع",
    isPublic: true,
    updatedAt: new Date()
  },
  {
    key: "site_description",
    value: "الموقع الأول للمأذونين الشرعيين في المملكة العربية السعودية",
    type: "string",
    category: "general",
    description: "وصف الموقع",
    isPublic: true,
    updatedAt: new Date()
  },
  {
    key: "contact_email",
    value: "info@mazoony.com",
    type: "string",
    category: "contact",
    description: "البريد الإلكتروني للتواصل",
    isPublic: true,
    updatedAt: new Date()
  },
  {
    key: "contact_phone",
    value: "+966501234567",
    type: "string",
    category: "contact",
    description: "رقم الهاتف للتواصل",
    isPublic: true,
    updatedAt: new Date()
  },
  {
    key: "require_verification",
    value: true,
    type: "boolean",
    category: "security",
    description: "التحقق من المأذونين",
    isPublic: false,
    updatedAt: new Date()
  },
  {
    key: "auto_approve_reviews",
    value: false,
    type: "boolean",
    category: "reviews",
    description: "الموافقة التلقائية على التقييمات",
    isPublic: false,
    updatedAt: new Date()
  },
  {
    key: "max_login_attempts",
    value: 5,
    type: "number",
    category: "security",
    description: "الحد الأقصى لمحاولات تسجيل الدخول",
    isPublic: false,
    updatedAt: new Date()
  }
]

db.settings.insertMany(defaultSettings)
```

## 📈 العلاقات بين المجموعات

### العلاقات الرئيسية:
1. **المأذونين ↔ المدن**: كل مأذون ينتمي لمدينة واحدة
2. **التقييمات ↔ المأذونين**: كل تقييم يخص مأذون واحد
3. **الرسائل ↔ المأذونين**: الرسائل قد تكون متعلقة بمأذون معين
4. **سجل النشاط ↔ المستخدمين**: كل نشاط يخص مستخدم معين

### الاستعلامات الشائعة:

```javascript
// جلب جميع المأذونين في مدينة معينة مع عدد التقييمات
db.sheikhs.aggregate([
  { $match: { citySlug: "al-riyadh", isActive: true } },
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "sheikhId",
      as: "reviews"
    }
  },
  {
    $addFields: {
      reviewCount: { $size: "$reviews" },
      averageRating: {
        $avg: "$reviews.rating"
      }
    }
  },
  { $sort: { rating: -1 } }
])

// جلب أفضل المأذونين حسب التقييم
db.sheikhs.aggregate([
  { $match: { isActive: true, verified: true } },
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "sheikhId",
      as: "reviews"
    }
  },
  {
    $addFields: {
      reviewCount: { $size: "$reviews" },
      averageRating: {
        $avg: "$reviews.rating"
      }
    }
  },
  { $match: { reviewCount: { $gte: 5 } } },
  { $sort: { averageRating: -1 } },
  { $limit: 10 }
])

// جلب إحصائيات المدن
db.cities.aggregate([
  { $match: { isActive: true } },
  {
    $lookup: {
      from: "sheikhs",
      localField: "_id",
      foreignField: "cityId",
      as: "sheikhs"
    }
  },
  {
    $addFields: {
      sheikhCount: { $size: "$sheikhs" },
      activeSheikhs: {
        $size: {
          $filter: {
            input: "$sheikhs",
            cond: { $eq: ["$$this.availability", "متاح"] }
          }
        }
      }
    }
  },
  { $sort: { sheikhCount: -1 } }
])
```

## 🔒 الأمان والصلاحيات

### أدوار المستخدمين:
1. **admin**: صلاحيات كاملة
2. **manager**: إدارة المحتوى والمستخدمين
3. **editor**: تحرير المحتوى فقط

### الصلاحيات:
- `cities:read` - قراءة المدن
- `cities:write` - كتابة المدن
- `sheikhs:read` - قراءة المأذونين
- `sheikhs:write` - كتابة المأذونين
- `reviews:read` - قراءة التقييمات
- `reviews:moderate` - إدارة التقييمات
- `messages:read` - قراءة الرسائل
- `messages:reply` - الرد على الرسائل
- `users:read` - قراءة المستخدمين
- `users:write` - كتابة المستخدمين
- `settings:read` - قراءة الإعدادات
- `settings:write` - كتابة الإعدادات
- `analytics:read` - قراءة الإحصائيات

## 📊 النسخ الاحتياطي والاستعادة

```bash
# نسخ احتياطي
mongodump --db mazoony_db --out ./backup

# استعادة
mongorestore --db mazoony_db ./backup/mazoony_db
```

## 🔧 التحديثات والصيانة

### تحديث الإحصائيات اليومية:
```javascript
// تحديث عدد المأذونين في كل مدينة
db.cities.find().forEach(function(city) {
  var count = db.sheikhs.countDocuments({ 
    cityId: city._id, 
    isActive: true 
  });
  db.cities.updateOne(
    { _id: city._id },
    { $set: { count: count } }
  );
});
```

### تنظيف البيانات القديمة:
```javascript
// حذف سجل النشاط الأقدم من 90 يوم
db.activityLogs.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
});

// حذف الرسائل المغلقة الأقدم من 30 يوم
db.messages.deleteMany({
  status: "closed",
  updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
});
```

هذا التصميم يوفر قاعدة بيانات قوية وقابلة للتوسع لموقع مأذوني، مع دعم كامل لجميع الميزات المطلوبة وإمكانية النمو المستقبلي.
