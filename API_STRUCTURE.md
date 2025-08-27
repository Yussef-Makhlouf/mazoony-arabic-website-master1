# دليل بنية APIs - مأذوني

## 📋 نظرة عامة

يحتوي المشروع على مجموعة شاملة من APIs للتعامل مع جميع العمليات في النظام، من إدارة المدن والمأذونين إلى التقييمات والرسائل.

---

## 🏗️ بنية APIs

### Base URL
```
http://localhost:3000/api
```

### Authentication
جميع APIs تتطلب مصادقة باستثناء APIs القراءة العامة.

---

## 🏙️ APIs المدن

### جلب جميع المدن
```http
GET /api/cities
```

**Response:**
```json
[
  {
    "_id": "riyadh",
    "name": "الرياض",
    "slug": "al-riyadh",
    "count": 28,
    "region": "منطقة الرياض",
    "population": "7,000,000",
    "description": "عاصمة المملكة العربية السعودية",
    "featured": true,
    "isActive": true,
    "createdAt": "2024-12-20T00:00:00.000Z",
    "updatedAt": "2024-12-20T00:00:00.000Z"
  }
]
```

### جلب مدينة محددة
```http
GET /api/cities/{slug}
```

**Parameters:**
- `slug` (string): معرف المدينة

**Response:**
```json
{
  "_id": "riyadh",
  "name": "الرياض",
  "slug": "al-riyadh",
  "count": 28,
  "region": "منطقة الرياض",
  "population": "7,000,000",
  "description": "عاصمة المملكة العربية السعودية",
  "featured": true,
  "isActive": true,
  "createdAt": "2024-12-20T00:00:00.000Z",
  "updatedAt": "2024-12-20T00:00:00.000Z"
}
```

### إضافة مدينة جديدة
```http
POST /api/cities
```

**Request Body:**
```json
{
  "name": "مدينة جديدة",
  "slug": "new-city",
  "region": "منطقة جديدة",
  "population": "500,000",
  "description": "وصف المدينة",
  "featured": false
}
```

**Response:** `201 Created`
```json
{
  "_id": "new-city-id",
  "name": "مدينة جديدة",
  "slug": "new-city",
  "count": 0,
  "region": "منطقة جديدة",
  "population": "500,000",
  "description": "وصف المدينة",
  "featured": false,
  "isActive": true,
  "createdAt": "2024-12-20T00:00:00.000Z",
  "updatedAt": "2024-12-20T00:00:00.000Z"
}
```

### تحديث مدينة
```http
PUT /api/cities/{slug}
```

**Parameters:**
- `slug` (string): معرف المدينة

**Request Body:**
```json
{
  "name": "اسم محدث",
  "description": "وصف محدث",
  "featured": true
}
```

**Response:** `200 OK`
```json
{
  "_id": "riyadh",
  "name": "اسم محدث",
  "slug": "al-riyadh",
  "description": "وصف محدث",
  "featured": true,
  "updatedAt": "2024-12-20T00:00:00.000Z"
}
```

### حذف مدينة
```http
DELETE /api/cities/{slug}
```

**Parameters:**
- `slug` (string): معرف المدينة

**Response:** `200 OK`
```json
{
  "message": "City deleted successfully"
}
```

---

## 👥 APIs المأذونين

### جلب جميع المأذونين
```http
GET /api/sheikhs
```

**Query Parameters:**
- `city` (string): تصفية حسب المدينة
- `search` (string): البحث في الاسم أو المدينة أو التخصصات

**Response:**
```json
[
  {
    "_id": "sheikh-1",
    "name": "الشيخ عبدالرحمن بن سفر المالكي",
    "slug": "abdulrahman-safer-al-malki",
    "cityId": "makkah",
    "city": "مكة المكرمة",
    "citySlug": "makkah-al-mukarramah",
    "phone": "+966501234567",
    "whatsapp": "+966501234567",
    "rating": 4.8,
    "reviewCount": 127,
    "specialties": ["عقود الزواج", "الاستشارات الشرعية"],
    "experience": "15 سنة خبرة",
    "availability": "متاح",
    "bio": "مأذون شرعي معتمد...",
    "education": "إجازة شرعية - جامعة أم القرى",
    "languages": ["العربية", "الإنجليزية"],
    "ratings": {
      "commitment": 4.9,
      "ease": 4.7,
      "knowledge": 4.8,
      "price": 4.6
    },
    "verified": true,
    "isActive": true,
    "price": "400",
    "image": "/professional-arabic-sheikh-portrait.png",
    "createdAt": "2024-12-20T00:00:00.000Z",
    "updatedAt": "2024-12-20T00:00:00.000Z"
  }
]
```

### جلب مأذون محدد
```http
GET /api/sheikhs/{slug}
```

**Parameters:**
- `slug` (string): معرف المأذون

**Response:**
```json
{
  "_id": "sheikh-1",
  "name": "الشيخ عبدالرحمن بن سفر المالكي",
  "slug": "abdulrahman-safer-al-malki",
  "cityId": "makkah",
  "city": "مكة المكرمة",
  "citySlug": "makkah-al-mukarramah",
  "phone": "+966501234567",
  "whatsapp": "+966501234567",
  "rating": 4.8,
  "reviewCount": 127,
  "specialties": ["عقود الزواج", "الاستشارات الشرعية"],
  "experience": "15 سنة خبرة",
  "availability": "متاح",
  "bio": "مأذون شرعي معتمد...",
  "education": "إجازة شرعية - جامعة أم القرى",
  "languages": ["العربية", "الإنجليزية"],
  "ratings": {
    "commitment": 4.9,
    "ease": 4.7,
    "knowledge": 4.8,
    "price": 4.6
  },
  "verified": true,
  "isActive": true,
  "price": "400",
  "image": "/professional-arabic-sheikh-portrait.png",
  "createdAt": "2024-12-20T00:00:00.000Z",
  "updatedAt": "2024-12-20T00:00:00.000Z"
}
```

### إضافة مأذون جديد
```http
POST /api/sheikhs
```

**Request Body:**
```json
{
  "name": "الشيخ الجديد",
  "slug": "new-sheikh",
  "cityId": "riyadh",
  "city": "الرياض",
  "citySlug": "al-riyadh",
  "phone": "+966501234567",
  "whatsapp": "+966501234567",
  "specialties": ["عقود الزواج"],
  "experience": "10 سنوات",
  "availability": "متاح",
  "bio": "مأذون شرعي معتمد...",
  "education": "إجازة شرعية",
  "languages": ["العربية"],
  "price": "300",
  "verified": false
}
```

**Response:** `201 Created`
```json
{
  "_id": "new-sheikh-id",
  "name": "الشيخ الجديد",
  "slug": "new-sheikh",
  "cityId": "riyadh",
  "city": "الرياض",
  "citySlug": "al-riyadh",
  "phone": "+966501234567",
  "whatsapp": "+966501234567",
  "rating": 0,
  "reviewCount": 0,
  "specialties": ["عقود الزواج"],
  "experience": "10 سنوات",
  "availability": "متاح",
  "bio": "مأذون شرعي معتمد...",
  "education": "إجازة شرعية",
  "languages": ["العربية"],
  "ratings": {
    "commitment": 0,
    "ease": 0,
    "knowledge": 0,
    "price": 0
  },
  "verified": false,
  "isActive": true,
  "price": "300",
  "image": "",
  "createdAt": "2024-12-20T00:00:00.000Z",
  "updatedAt": "2024-12-20T00:00:00.000Z"
}
```

### تحديث مأذون
```http
PUT /api/sheikhs/{slug}
```

**Parameters:**
- `slug` (string): معرف المأذون

**Request Body:**
```json
{
  "name": "اسم محدث",
  "availability": "مشغول",
  "price": "450"
}
```

**Response:** `200 OK`
```json
{
  "_id": "sheikh-1",
  "name": "اسم محدث",
  "availability": "مشغول",
  "price": "450",
  "updatedAt": "2024-12-20T00:00:00.000Z"
}
```

### حذف مأذون
```http
DELETE /api/sheikhs/{slug}
```

**Parameters:**
- `slug` (string): معرف المأذون

**Response:** `200 OK`
```json
{
  "message": "Sheikh deleted successfully"
}
```

---

## ⭐ APIs التقييمات

### جلب تقييمات مأذون
```http
GET /api/reviews?sheikhId={sheikhId}
```

**Query Parameters:**
- `sheikhId` (string): معرف المأذون

**Response:**
```json
[
  {
    "_id": "review-1",
    "sheikhId": "sheikh-1",
    "name": "أحمد محمد العتيبي",
    "phone": "+966501111111",
    "email": "ahmed@example.com",
    "rating": 5,
    "comment": "خدمة ممتازة والشيخ متعاون جداً",
    "status": "approved",
    "isVerified": true,
    "reported": false,
    "createdAt": "2024-12-20T00:00:00.000Z",
    "updatedAt": "2024-12-20T00:00:00.000Z"
  }
]
```

### جلب التقييمات المعلقة
```http
GET /api/reviews?status=pending
```

**Response:**
```json
[
  {
    "_id": "review-2",
    "sheikhId": "sheikh-1",
    "name": "محمد أحمد",
    "phone": "+966502222222",
    "rating": 4,
    "comment": "تقييم جديد ينتظر الموافقة",
    "status": "pending",
    "isVerified": false,
    "reported": false,
    "createdAt": "2024-12-20T00:00:00.000Z",
    "updatedAt": "2024-12-20T00:00:00.000Z"
  }
]
```

### إضافة تقييم جديد
```http
POST /api/reviews
```

**Request Body:**
```json
{
  "sheikhId": "sheikh-1",
  "name": "أحمد محمد",
  "phone": "+966501111111",
  "email": "ahmed@example.com",
  "rating": 5,
  "comment": "خدمة ممتازة"
}
```

**Response:** `201 Created`
```json
{
  "_id": "new-review-id",
  "sheikhId": "sheikh-1",
  "name": "أحمد محمد",
  "phone": "+966501111111",
  "email": "ahmed@example.com",
  "rating": 5,
  "comment": "خدمة ممتازة",
  "status": "pending",
  "isVerified": false,
  "reported": false,
  "createdAt": "2024-12-20T00:00:00.000Z",
  "updatedAt": "2024-12-20T00:00:00.000Z"
}
```

---

## 💬 APIs الرسائل

### جلب جميع الرسائل
```http
GET /api/messages
```

**Query Parameters:**
- `status` (string): تصفية حسب الحالة (new, read, replied, closed)

**Response:**
```json
[
  {
    "_id": "message-1",
    "name": "محمد أحمد",
    "email": "mohammed@example.com",
    "phone": "+966502222222",
    "subject": "استفسار عن خدمات المأذون",
    "message": "أريد معلومات عن خدمات المأذون...",
    "sheikhId": "sheikh-1",
    "status": "new",
    "priority": "medium",
    "type": "inquiry",
    "tags": ["استفسار", "خدمات"],
    "createdAt": "2024-12-20T00:00:00.000Z",
    "updatedAt": "2024-12-20T00:00:00.000Z"
  }
]
```

### جلب الرسائل الجديدة
```http
GET /api/messages?status=new
```

**Response:**
```json
[
  {
    "_id": "message-2",
    "name": "أحمد علي",
    "email": "ahmed@example.com",
    "phone": "+966503333333",
    "subject": "رسالة جديدة",
    "message": "محتوى الرسالة...",
    "status": "new",
    "priority": "high",
    "type": "general",
    "tags": [],
    "createdAt": "2024-12-20T00:00:00.000Z",
    "updatedAt": "2024-12-20T00:00:00.000Z"
  }
]
```

### إرسال رسالة جديدة
```http
POST /api/messages
```

**Request Body:**
```json
{
  "name": "محمد أحمد",
  "email": "mohammed@example.com",
  "phone": "+966502222222",
  "subject": "استفسار",
  "message": "محتوى الرسالة",
  "sheikhId": "sheikh-1",
  "priority": "medium",
  "type": "inquiry",
  "tags": ["استفسار"]
}
```

**Response:** `201 Created`
```json
{
  "_id": "new-message-id",
  "name": "محمد أحمد",
  "email": "mohammed@example.com",
  "phone": "+966502222222",
  "subject": "استفسار",
  "message": "محتوى الرسالة",
  "sheikhId": "sheikh-1",
  "status": "new",
  "priority": "medium",
  "type": "inquiry",
  "tags": ["استفسار"],
  "createdAt": "2024-12-20T00:00:00.000Z",
  "updatedAt": "2024-12-20T00:00:00.000Z"
}
```

---

## 📊 APIs الإحصائيات

### إحصائيات لوحة التحكم
```http
GET /api/stats
```

**Response:**
```json
{
  "totalCities": 12,
  "totalSheikhs": 6,
  "totalReviews": 25,
  "totalMessages": 15,
  "newMessages": 3,
  "pendingReviews": 2
}
```

### إحصائيات المأذونين
```http
GET /api/stats?type=sheikhs
```

**Response:**
```json
{
  "totalSheikhs": 6,
  "avgRating": 4.7,
  "totalReviews": 25,
  "verifiedCount": 5,
  "availableCount": 4
}
```

---

## 🔍 APIs البحث

### البحث في المدن والمأذونين
```http
GET /api/search?q={query}&type={type}&limit={limit}
```

**Query Parameters:**
- `q` (string): نص البحث
- `type` (string): نوع البحث (cities, sheikhs, all)
- `limit` (number): عدد النتائج (افتراضي: 10)

**Response:**
```json
{
  "cities": [
    {
      "_id": "riyadh",
      "name": "الرياض",
      "slug": "al-riyadh",
      "count": 28
    }
  ],
  "sheikhs": [
    {
      "_id": "sheikh-1",
      "name": "الشيخ عبدالرحمن",
      "city": "مكة المكرمة",
      "rating": 4.8
    }
  ]
}
```

---

## 🚨 رموز الحالة (Status Codes)

### نجح
- `200 OK`: الطلب نجح
- `201 Created`: تم إنشاء المورد بنجاح
- `204 No Content`: الطلب نجح بدون محتوى

### خطأ في العميل
- `400 Bad Request`: بيانات غير صحيحة
- `401 Unauthorized`: غير مصرح
- `403 Forbidden`: محظور
- `404 Not Found`: المورد غير موجود
- `409 Conflict`: تضارب في البيانات

### خطأ في الخادم
- `500 Internal Server Error`: خطأ داخلي في الخادم
- `502 Bad Gateway`: خطأ في البوابة
- `503 Service Unavailable`: الخدمة غير متاحة

---

## 📝 أمثلة الاستخدام

### JavaScript (Fetch)
```javascript
// جلب جميع المدن
const response = await fetch('/api/cities');
const cities = await response.json();

// إضافة مأذون جديد
const newSheikh = await fetch('/api/sheikhs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'الشيخ الجديد',
    slug: 'new-sheikh',
    cityId: 'riyadh',
    phone: '+966501234567'
  })
});

// البحث
const searchResults = await fetch('/api/search?q=الرياض&type=all&limit=5');
const results = await searchResults.json();
```

### cURL
```bash
# جلب جميع المدن
curl -X GET http://localhost:3000/api/cities

# إضافة مدينة جديدة
curl -X POST http://localhost:3000/api/cities \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مدينة جديدة",
    "slug": "new-city",
    "region": "منطقة جديدة"
  }'

# البحث
curl -X GET "http://localhost:3000/api/search?q=الرياض&type=all&limit=5"
```

---

## 🔒 الأمان

### Authentication
جميع APIs تتطلب مصادقة باستثناء:
- `GET /api/cities`
- `GET /api/sheikhs`
- `GET /api/search`
- `POST /api/reviews`
- `POST /api/messages`

### Rate Limiting
- حد أقصى 100 طلب في الدقيقة لكل IP
- حد أقصى 1000 طلب في الساعة لكل مستخدم

### Validation
- التحقق من صحة البيانات المدخلة
- حماية من SQL Injection
- حماية من XSS

---

## 📞 الدعم

للمساعدة في استخدام APIs:
- 📧 البريد الإلكتروني: support@mazoony.com
- 📱 الهاتف: +966501234567
- 📚 التوثيق: [API Documentation](https://docs.mazoony.com/api)

---

**ملاحظة**: جميع التواريخ في التنسيق ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
