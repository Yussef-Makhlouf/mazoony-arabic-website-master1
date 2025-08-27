# دليل إعداد قاعدة البيانات - مأذوني

## 📊 نظرة عامة على قاعدة البيانات

يستخدم المشروع MongoDB كقاعدة بيانات رئيسية، مع بنية منظمة ومحسنة للأداء.

### المجموعات (Collections)

1. **cities** - المدن والمناطق
2. **sheikhs** - المأذونين الشرعيين
3. **reviews** - التقييمات والمراجعات
4. **messages** - الرسائل والاستفسارات
5. **users** - مستخدمي لوحة التحكم
6. **settings** - إعدادات النظام
7. **activityLogs** - سجل النشاط
8. **statistics** - الإحصائيات

---

## 🚀 إعداد MongoDB

### الخيار 1: MongoDB Atlas (موصى به للإنتاج)

#### 1. إنشاء حساب Atlas
1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com)
2. أنشئ حساب جديد أو سجل دخول
3. اختر "Build a Database"

#### 2. إنشاء Cluster
1. اختر "FREE" tier (M0)
2. اختر Provider (AWS, Google Cloud, Azure)
3. اختر Region (الأقرب لموقعك)
4. اضغط "Create"

#### 3. إعداد الأمان
1. أنشئ Database User:
   - Username: `mazoony_user`
   - Password: `secure_password_123`
   - Role: `Read and write to any database`

2. أضف IP Address:
   - للتنمية: `0.0.0.0/0` (جميع IPs)
   - للإنتاج: IP محدد

#### 4. الحصول على Connection String
1. اضغط "Connect"
2. اختر "Connect your application"
3. انسخ Connection String
4. استبدل `<password>` بكلمة المرور

### الخيار 2: MongoDB محلي

#### Windows
```bash
# تحميل MongoDB Community Server
# من: https://www.mongodb.com/try/download/community

# تشغيل MongoDB
net start MongoDB

# أو كخدمة
sc config MongoDB start= auto
```

#### macOS
```bash
# تثبيت MongoDB
brew tap mongodb/brew
brew install mongodb-community

# تشغيل MongoDB
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
# تثبيت MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# تشغيل MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Docker
```bash
# تشغيل MongoDB في Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# أو مع Docker Compose
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

## ⚙️ إعداد متغيرات البيئة

### ملف .env.local
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mazoony_db?retryWrites=true&w=majority

# Next.js
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@mazoony.com
ADMIN_PASSWORD=secure-password-123
```

### متغيرات اختيارية
```env
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS Service
SMS_API_KEY=your-sms-api-key
SMS_API_SECRET=your-sms-api-secret

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🗄️ هيكل قاعدة البيانات

### مجموعة المدن (cities)
```javascript
{
  _id: "riyadh",
  name: "الرياض",
  slug: "al-riyadh",
  count: 28,
  region: "منطقة الرياض",
  population: "7,000,000",
  description: "عاصمة المملكة العربية السعودية",
  featured: true,
  isActive: true,
  createdAt: ISODate("2024-12-20T00:00:00.000Z"),
  updatedAt: ISODate("2024-12-20T00:00:00.000Z")
}
```

### مجموعة المأذونين (sheikhs)
```javascript
{
  _id: "sheikh-1",
  name: "الشيخ عبدالرحمن بن سفر المالكي",
  slug: "abdulrahman-safer-al-malki",
  cityId: "makkah",
  city: "مكة المكرمة",
  citySlug: "makkah-al-mukarramah",
  phone: "+966501234567",
  whatsapp: "+966501234567",
  rating: 4.8,
  reviewCount: 127,
  specialties: ["عقود الزواج", "الاستشارات الشرعية"],
  experience: "15 سنة خبرة",
  availability: "متاح",
  bio: "مأذون شرعي معتمد...",
  education: "إجازة شرعية - جامعة أم القرى",
  languages: ["العربية", "الإنجليزية"],
  ratings: {
    commitment: 4.9,
    ease: 4.7,
    knowledge: 4.8,
    price: 4.6
  },
  verified: true,
  isActive: true,
  price: "400",
  image: "/professional-arabic-sheikh-portrait.png",
  createdAt: ISODate("2024-12-20T00:00:00.000Z"),
  updatedAt: ISODate("2024-12-20T00:00:00.000Z")
}
```

### مجموعة التقييمات (reviews)
```javascript
{
  _id: ObjectId("..."),
  sheikhId: "sheikh-1",
  name: "أحمد محمد العتيبي",
  phone: "+966501111111",
  email: "ahmed@example.com",
  rating: 5,
  comment: "خدمة ممتازة والشيخ متعاون جداً",
  status: "approved",
  isVerified: true,
  reported: false,
  createdAt: ISODate("2024-12-20T00:00:00.000Z"),
  updatedAt: ISODate("2024-12-20T00:00:00.000Z")
}
```

### مجموعة الرسائل (messages)
```javascript
{
  _id: ObjectId("..."),
  name: "محمد أحمد",
  email: "mohammed@example.com",
  phone: "+966502222222",
  subject: "استفسار عن خدمات المأذون",
  message: "أريد معلومات عن خدمات المأذون...",
  sheikhId: "sheikh-1",
  status: "new",
  priority: "medium",
  type: "inquiry",
  tags: ["استفسار", "خدمات"],
  createdAt: ISODate("2024-12-20T00:00:00.000Z"),
  updatedAt: ISODate("2024-12-20T00:00:00.000Z")
}
```

---

## 🔍 الفهارس (Indexes)

### فهارس المدن
```javascript
// فهرس فريد للـ slug
db.cities.createIndex({ "slug": 1 }, { unique: true })

// فهرس للمنطقة
db.cities.createIndex({ "region": 1 })

// فهرس للمدن المميزة
db.cities.createIndex({ "featured": 1 })

// فهرس للمدن النشطة
db.cities.createIndex({ "isActive": 1 })

// فهرس للتاريخ
db.cities.createIndex({ "createdAt": -1 })
```

### فهارس المأذونين
```javascript
// فهرس فريد للـ slug
db.sheikhs.createIndex({ "slug": 1 }, { unique: true })

// فهرس للمدينة
db.sheikhs.createIndex({ "cityId": 1 })
db.sheikhs.createIndex({ "citySlug": 1 })

// فهرس للحالة
db.sheikhs.createIndex({ "availability": 1 })
db.sheikhs.createIndex({ "verified": 1 })
db.sheikhs.createIndex({ "isActive": 1 })

// فهرس للتقييم
db.sheikhs.createIndex({ "rating": -1 })

// فهرس للتاريخ
db.sheikhs.createIndex({ "createdAt": -1 })

// فهرس للتخصصات واللغات
db.sheikhs.createIndex({ "specialties": 1 })
db.sheikhs.createIndex({ "languages": 1 })
```

### فهارس التقييمات
```javascript
// فهرس للمأذون
db.reviews.createIndex({ "sheikhId": 1 })

// فهرس للحالة
db.reviews.createIndex({ "status": 1 })

// فهرس للتقييم
db.reviews.createIndex({ "rating": -1 })

// فهرس للتاريخ
db.reviews.createIndex({ "createdAt": -1 })

// فهارس إضافية
db.reviews.createIndex({ "isVerified": 1 })
db.reviews.createIndex({ "reported": 1 })
db.reviews.createIndex({ "phone": 1 })
db.reviews.createIndex({ "email": 1 })
```

---

## 🛠️ أوامر MongoDB مفيدة

### الاتصال بقاعدة البيانات
```bash
# MongoDB Shell
mongosh "mongodb+srv://username:password@cluster.mongodb.net/mazoony_db"

# أو محلي
mongosh "mongodb://localhost:27017/mazoony_db"
```

### استعلامات مفيدة
```javascript
// جلب جميع المدن
db.cities.find({ isActive: true }).sort({ name: 1 })

// جلب المأذونين في مدينة معينة
db.sheikhs.find({ citySlug: "al-riyadh", isActive: true })

// جلب التقييمات المعلقة
db.reviews.find({ status: "pending" }).sort({ createdAt: -1 })

// إحصائيات المأذونين
db.sheikhs.aggregate([
  { $match: { isActive: true } },
  { $group: {
    _id: null,
    totalSheikhs: { $sum: 1 },
    avgRating: { $avg: "$rating" },
    verifiedCount: { $sum: { $cond: ["$verified", 1, 0] } }
  }}
])
```

### صيانة قاعدة البيانات
```javascript
// حذف البيانات المحذوفة (soft delete)
db.cities.updateMany(
  { isActive: false },
  { $set: { deletedAt: new Date() } }
)

// إعادة بناء الفهارس
db.cities.reIndex()
db.sheikhs.reIndex()
db.reviews.reIndex()

// تحليل الأداء
db.cities.find().explain("executionStats")
```

---

## 🔒 الأمان

### أفضل الممارسات
1. **تشفير كلمات المرور**: استخدام bcrypt
2. **التحقق من المدخلات**: validation شامل
3. **حماية من SQL Injection**: استخدام prepared statements
4. **Rate Limiting**: تحديد عدد الطلبات
5. **Backup منتظم**: نسخ احتياطية دورية

### إعدادات الأمان في MongoDB
```javascript
// إنشاء مستخدم مع صلاحيات محدودة
db.createUser({
  user: "mazoony_app",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "mazoony_db" }
  ]
})

// تفعيل Authentication
security:
  authorization: enabled

// تقييد الوصول للشبكة
net:
  bindIp: 127.0.0.1
  port: 27017
```

---

## 📊 المراقبة والأداء

### أدوات المراقبة
1. **MongoDB Compass**: واجهة رسومية
2. **MongoDB Atlas**: مراقبة سحابية
3. **MongoDB Ops Manager**: مراقبة متقدمة

### مؤشرات الأداء
```javascript
// مراقبة الاستعلامات البطيئة
db.setProfilingLevel(1, { slowms: 100 })

// عرض الإحصائيات
db.stats()

// مراقبة الفهارس
db.cities.getIndexes()
```

---

## 🔄 النسخ الاحتياطي والاستعادة

### النسخ الاحتياطي
```bash
# نسخ احتياطي كامل
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/mazoony_db" --out=backup/

# نسخ احتياطي لمجموعة معينة
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/mazoony_db" --collection=cities --out=backup/
```

### الاستعادة
```bash
# استعادة كاملة
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/mazoony_db" backup/

# استعادة مجموعة معينة
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/mazoony_db" --collection=cities backup/mazoony_db/cities.bson
```

---

## 🚨 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### خطأ في الاتصال
```bash
# تحقق من Connection String
echo $MONGODB_URI

# اختبر الاتصال
mongosh "mongodb+srv://username:password@cluster.mongodb.net/mazoony_db"
```

#### خطأ في الفهارس
```javascript
// إعادة إنشاء الفهارس
db.cities.dropIndexes()
db.cities.createIndex({ "slug": 1 }, { unique: true })
```

#### خطأ في الصلاحيات
```javascript
// منح صلاحيات إضافية
db.grantRolesToUser("mazoony_app", [
  { role: "readWrite", db: "mazoony_db" }
])
```

---

## 📞 الدعم

للمساعدة في إعداد قاعدة البيانات:
- 📧 البريد الإلكتروني: support@mazoony.com
- 📱 الهاتف: +966501234567
- 📚 التوثيق: [MongoDB Documentation](https://docs.mongodb.com)

---

**ملاحظة**: تأكد من تغيير كلمات المرور الافتراضية وإعدادات الأمان قبل النشر في الإنتاج.
