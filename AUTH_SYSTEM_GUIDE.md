# دليل نظام المصادقة الشامل - موقع مأذوني

## 🔐 نظرة عامة

تم تطوير نظام مصادقة متكامل من A إلى Z لموقع مأذوني يشمل:

- **تسجيل الدخول الآمن** مع تشفير كلمات المرور
- **استعادة كلمة المرور** بالرمز المؤقت
- **إدارة المستخدمين** الكاملة
- **تغيير كلمة المرور** من لوحة التحكم
- **حماية الصفحات** بـ Middleware
- **إدارة الجلسات** بـ JWT
- **تسجيل محاولات الدخول** للأمان

---

## 🚀 التهيئة والتشغيل

### 1. تثبيت المكتبات المطلوبة

```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

### 2. إعداد متغيرات البيئة

أنشئ ملف `.env.local` واضبط المتغيرات التالية:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mazoony_db

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Next.js Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-change-in-production
```

### 3. تهيئة قاعدة البيانات

```bash
# تهيئة نظام المصادقة
npm run auth:init

# تهيئة قاعدة البيانات العامة
npm run db:init
```

### 4. تشغيل الخادم

```bash
npm run dev
```

---

## 📱 الواجهات المطورة

### صفحات المصادقة

1. **تسجيل الدخول**: `/admin/login`
   - تسجيل دخول آمن مع JWT
   - إظهار/إخفاء كلمة المرور
   - رابط نسيان كلمة المرور

2. **نسيان كلمة المرور**: `/admin/forgot-password`
   - إرسال رمز الاستعادة للبريد الإلكتروني
   - في وضع التطوير: عرض الرمز في وحدة التحكم

3. **إعادة تعيين كلمة المرور**: `/admin/reset-password`
   - التحقق من صحة الرمز
   - تعيين كلمة مرور جديدة آمنة
   - مؤشر قوة كلمة المرور

4. **تغيير كلمة المرور**: `/admin/change-password`
   - تغيير كلمة المرور من لوحة التحكم
   - التحقق من كلمة المرور الحالية
   - مؤشر قوة كلمة المرور

### إدارة المستخدمين

5. **إدارة المستخدمين**: `/admin/users`
   - عرض جميع المستخدمين
   - إضافة مستخدمين جدد
   - تعديل بيانات المستخدمين
   - إعادة تعيين كلمات المرور
   - تفعيل/إلغاء تفعيل المستخدمين
   - البحث والتصفية

---

## 🔧 APIs المطورة

### Authentication APIs

```typescript
// تسجيل الدخول
POST /api/auth/login
{
  "email": "admin@mazoony.com",
  "password": "admin123"
}

// تسجيل الخروج
POST /api/auth/logout

// الحصول على بيانات المستخدم الحالي
GET /api/auth/me

// طلب استعادة كلمة المرور
POST /api/auth/forgot-password
{
  "email": "admin@mazoony.com"
}

// التحقق من رمز الاستعادة
POST /api/auth/verify-reset-token
{
  "token": "reset-token-here"
}

// إعادة تعيين كلمة المرور
POST /api/auth/reset-password
{
  "token": "reset-token-here",
  "password": "new-password",
  "confirmPassword": "new-password"
}

// تغيير كلمة المرور
POST /api/auth/change-password
{
  "currentPassword": "current-password",
  "newPassword": "new-password",
  "confirmPassword": "new-password"
}

// إنشاء مستخدم جديد (يتطلب صلاحيات)
POST /api/auth/register
{
  "name": "اسم المستخدم",
  "email": "user@mazoony.com",
  "password": "password123",
  "role": "editor",
  "department": "القسم"
}
```

### User Management APIs

```typescript
// جلب جميع المستخدمين
GET /api/users

// جلب مستخدم محدد
GET /api/users/[id]

// تحديث مستخدم
PUT /api/users/[id]
{
  "name": "اسم جديد",
  "email": "email@new.com",
  "role": "manager",
  "isActive": true,
  "profile": {
    "department": "قسم جديد"
  }
}

// حذف مستخدم (إلغاء تفعيل)
DELETE /api/users/[id]

// إعادة تعيين كلمة مرور المستخدم
PATCH /api/users/[id]
{
  "newPassword": "new-password-123"
}
```

---

## 🛡️ الحماية والأمان

### Middleware Protection

يحمي الـ Middleware الصفحات والـ APIs التالية:

- `/admin/*` - جميع صفحات لوحة التحكم
- `/api/admin/*` - APIs الإدارة
- `/api/users/*` - إدارة المستخدمين
- `/api/auth/register` - إنشاء مستخدمين
- `/api/auth/change-password` - تغيير كلمة المرور

### الأدوار والصلاحيات

```typescript
// الأدوار المتاحة
type Role = 'admin' | 'manager' | 'editor'

// صلاحيات كل دور
const permissions = {
  admin: ['*'], // جميع الصلاحيات
  manager: [
    'cities:read', 'cities:write',
    'sheikhs:read', 'sheikhs:write',
    'reviews:read', 'reviews:moderate',
    'messages:read', 'messages:reply',
    'users:read',
    'analytics:read'
  ],
  editor: [
    'cities:read',
    'sheikhs:read', 'sheikhs:write',
    'reviews:read',
    'messages:read'
  ]
}
```

### أمان كلمات المرور

- تشفير بـ `bcryptjs` مع 12 جولة
- قوة كلمة المرور (8+ أحرف، أرقام، رموز)
- محاولات تسجيل دخول محدودة (5 محاولات)
- قفل الحساب لمدة ساعتين بعد المحاولات الفاشلة

### رموز الاستعادة

- صالحة لمدة 15 دقيقة فقط
- استخدام واحد فقط
- تشفير آمن بـ `crypto.randomBytes`

---

## 🗄️ قاعدة البيانات

### مجموعات جديدة

```javascript
// المستخدمين
db.users = {
  _id: ObjectId,
  name: String,
  email: String, // فريد
  password: String, // مشفرة
  role: 'admin' | 'manager' | 'editor',
  permissions: [String],
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockedUntil: Date,
  profile: {
    avatar: String,
    phone: String,
    department: String
  },
  settings: {
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    language: String,
    timezone: String
  },
  createdAt: Date,
  updatedAt: Date
}

// رموز استعادة كلمة المرور
db.passwordResetTokens = {
  _id: ObjectId,
  userId: String,
  token: String, // فريد
  expiresAt: Date,
  used: Boolean,
  createdAt: Date
}

// محاولات تسجيل الدخول
db.loginAttempts = {
  _id: ObjectId,
  email: String,
  ipAddress: String,
  userAgent: String,
  success: Boolean,
  failureReason: String,
  createdAt: Date
}
```

---

## 👤 المستخدم الافتراضي

بعد تشغيل `npm run auth:init`:

- **البريد الإلكتروني**: `admin@mazoony.com`
- **كلمة المرور**: `admin123`
- **الدور**: `admin`
- **الصلاحيات**: جميع الصلاحيات

> ⚠️ **مهم**: يرجى تغيير كلمة المرور الافتراضية بعد أول تسجيل دخول!

---

## 🔄 تدفق العمل

### 1. تسجيل الدخول

```mermaid
graph TD
    A[إدخال البريد وكلمة المرور] --> B[التحقق من صحة البيانات]
    B --> C{هل المستخدم موجود؟}
    C -->|لا| D[خطأ: بيانات غير صحيحة]
    C -->|نعم| E{هل الحساب مقفل؟}
    E -->|نعم| F[خطأ: الحساب مقفل]
    E -->|لا| G{هل كلمة المرور صحيحة؟}
    G -->|لا| H[زيادة محاولات فاشلة]
    H --> I{هل تجاوز الحد المسموح؟}
    I -->|نعم| J[قفل الحساب]
    I -->|لا| D
    G -->|نعم| K[إنشاء JWT Token]
    K --> L[تسجيل دخول ناجح]
```

### 2. استعادة كلمة المرور

```mermaid
graph TD
    A[إدخال البريد الإلكتروني] --> B[التحقق من وجود المستخدم]
    B --> C[إنشاء رمز استعادة]
    C --> D[حفظ الرمز في قاعدة البيانات]
    D --> E[إرسال الرمز للبريد الإلكتروني]
    E --> F[المستخدم يدخل الرمز]
    F --> G{هل الرمز صحيح؟}
    G -->|لا| H[خطأ: رمز غير صحيح]
    G -->|نعم| I[تعيين كلمة مرور جديدة]
    I --> J[تحديث كلمة المرور]
    J --> K[إلغاء صلاحية الرمز]
```

---

## 🧪 الاختبار

### اختبار APIs

```bash
# اختبار تسجيل الدخول
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mazoony.com","password":"admin123"}'

# اختبار جلب بيانات المستخدم
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: auth-token=YOUR_JWT_TOKEN"

# اختبار طلب استعادة كلمة المرور
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mazoony.com"}'
```

### اختبار الواجهات

1. اذهب إلى `/admin/login`
2. سجل دخول بالبيانات الافتراضية
3. جرب تغيير كلمة المرور من `/admin/change-password`
4. اختبر إدارة المستخدمين من `/admin/users`
5. جرب نسيان كلمة المرور من `/admin/forgot-password`

---

## 🔧 التخصيص والتطوير

### إضافة صلاحيات جديدة

```typescript
// في lib/auth.ts
const permissions = {
  admin: ['*'],
  manager: [
    // ... الصلاحيات الحالية
    'new-feature:read',
    'new-feature:write'
  ],
  editor: [
    // ... الصلاحيات الحالية
    'new-feature:read'
  ]
}
```

### إضافة حقول للمستخدم

```typescript
// في lib/auth.ts - واجهة User
export interface User {
  // ... الحقول الحالية
  customField?: string;
  metadata?: {
    lastPasswordChange?: Date;
    securityQuestions?: string[];
  };
}
```

### تخصيص رسائل الخطأ

```typescript
// في أي API route
if (!user) {
  return NextResponse.json(
    { error: 'رسالة خطأ مخصصة' },
    { status: 404 }
  );
}
```

---

## 📧 إعداد البريد الإلكتروني (اختياري)

لتفعيل إرسال رموز الاستعادة بالبريد الإلكتروني:

### 1. تثبيت مكتبة البريد

```bash
npm install nodemailer @types/nodemailer
```

### 2. إعداد متغيرات البيئة

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. إنشاء خدمة البريد

```typescript
// lib/email.ts
import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`;
    
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'استعادة كلمة المرور - موقع مأذوني',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>استعادة كلمة المرور</h2>
          <p>اضغط على الرابط التالي لإعادة تعيين كلمة المرور:</p>
          <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
          <p>هذا الرابط صالح لمدة 15 دقيقة فقط.</p>
        </div>
      `,
    });
  }
}
```

---

## 🚀 النشر في الإنتاج

### 1. متغيرات البيئة المطلوبة

```bash
# Production MongoDB
MONGODB_URI=mongodb+srv://prod-user:strong-password@cluster.mongodb.net/mazoony_prod

# Strong JWT Secret (32+ characters)
JWT_SECRET=your-production-jwt-secret-key-at-least-32-characters-long

# Production URLs
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 2. إعداد الأمان

- استخدم كلمات مرور قوية للقاعدة
- فعل HTTPS في الإنتاج
- استخدم أسرار JWT قوية ومعقدة
- فعل CORS بشكل صحيح
- راقب محاولات تسجيل الدخول

### 3. النشر على Vercel

```bash
# تعيين متغيرات البيئة
vercel env add JWT_SECRET
vercel env add MONGODB_URI

# النشر
vercel --prod
```

---

## 🆘 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### 1. خطأ اتصال قاعدة البيانات
```bash
Error: MongoError: connection refused
```
**الحل**: تأكد من صحة `MONGODB_URI` في `.env.local`

#### 2. خطأ JWT
```bash
Error: JsonWebTokenError: invalid token
```
**الحل**: تأكد من وجود `JWT_SECRET` وأنه 32 حرف على الأقل

#### 3. خطأ في الـ Middleware
```bash
Error: Cannot read property 'value' of undefined
```
**الحل**: تأكد من أن الـ cookies محفوظة بشكل صحيح

#### 4. مشكلة في رموز الاستعادة
```bash
Error: Reset token not found
```
**الحل**: تأكد من أن مجموعة `passwordResetTokens` موجودة

### تسجيل الأخطاء

```typescript
// إضافة تسجيل مفصل في APIs
try {
  // كود API
} catch (error) {
  console.error('Detailed error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userId: payload?.userId,
    endpoint: request.url
  });
}
```

---

## 📈 التحسينات المستقبلية

### ميزات يمكن إضافتها

1. **التحقق بخطوتين (2FA)**
   - رموز TOTP
   - رسائل SMS

2. **OAuth Integration**
   - تسجيل دخول بـ Google
   - تسجيل دخول بـ Microsoft

3. **جلسات متعددة**
   - إدارة الأجهزة المسجلة
   - إنهاء جلسات بعيدة

4. **تدقيق الأمان**
   - سجل مفصل للأنشطة
   - تنبيهات الأمان

5. **إعدادات الأمان المتقدمة**
   - أسئلة الأمان
   - تقييد عناوين IP

---

## 🎯 الخلاصة

تم تطوير نظام مصادقة متكامل وآمن يشمل:

✅ **تسجيل دخول آمن** مع JWT وتشفير كلمات المرور
✅ **استعادة كلمة المرور** بالرمز المؤقت
✅ **إدارة المستخدمين** الكاملة مع الأدوار والصلاحيات
✅ **حماية الصفحات** بـ Middleware شامل
✅ **واجهات مستخدم** عربية متكاملة
✅ **APIs شاملة** لجميع العمليات
✅ **أمان عالي** مع أفضل الممارسات
✅ **قابلية التطوير** والتخصيص

النظام جاهز للاستخدام في الإنتاج ويمكن توسيعه بسهولة! 🚀
