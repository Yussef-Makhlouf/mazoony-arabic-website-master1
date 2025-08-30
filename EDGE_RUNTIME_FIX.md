# إصلاح مشكلة Edge Runtime

## 🚨 المشكلة الأصلية

```
Error: The edge runtime does not support Node.js 'crypto' module.
```

كانت المشكلة أن الـ middleware يحاول استخدام مكتبات Node.js (مثل `crypto` و `mongodb`) في Edge Runtime، والذي لا يدعم هذه المكتبات.

## ✅ الحلول المطبقة

### 1. فصل الكود المتوافق مع Edge Runtime

- **ملف جديد**: `lib/auth-edge.ts` - يحتوي على وظائف المصادقة المتوافقة مع Edge Runtime فقط
- **ملف جديد**: `lib/auth-utils.ts` - يحتوي على الوظائف التي تحتاج Node.js (مثل crypto)

### 2. استبدال jsonwebtoken بـ jose

**المشكلة**: `jsonwebtoken` غير متوافق مع Edge Runtime
**الحل**: استخدام مكتبة `jose` المتوافقة مع Edge Runtime

```typescript
// قبل الإصلاح
import jwt from 'jsonwebtoken';
jwt.verify(token, secret);

// بعد الإصلاح
import { jwtVerify } from 'jose';
await jwtVerify(token, encodedSecret);
```

### 3. تحديث إنتاج JWT Tokens

```typescript
// lib/auth.ts - للاستخدام في API Routes
import { SignJWT } from 'jose';

static async generateToken(user: User): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET_ENCODED);
  return token;
}
```

### 4. تحديث الـ Middleware

```typescript
// middleware.ts
import { AuthEdgeService } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
  // ...
  const payload = await AuthEdgeService.verifyToken(token);
  // ...
}
```

## 📦 المكتبات الجديدة

```bash
npm install jose
```

## 🏗️ البنية الجديدة

```
lib/
├── auth.ts           # الوظائف الكاملة للمصادقة (Node.js)
├── auth-edge.ts      # وظائف متوافقة مع Edge Runtime
├── auth-utils.ts     # مساعدات Node.js (crypto)
└── mongodb.ts        # اتصال قاعدة البيانات
```

## ✨ النتيجة

- ✅ الـ middleware يعمل بدون أخطاء
- ✅ حماية الصفحات تعمل بشكل صحيح
- ✅ التحقق من الـ JWT tokens في Edge Runtime
- ✅ جميع وظائف المصادقة تعمل في API Routes

## 🔍 اختبار الإصلاح

1. تشغيل الخادم: `npm run dev`
2. زيارة صفحة محمية: `/admin`
3. يجب إعادة التوجيه لصفحة تسجيل الدخول
4. تسجيل الدخول بنجاح
5. الوصول للوحة التحكم

## 📚 المراجع

- [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [jose JWT Library](https://github.com/panva/jose)
- [Edge Runtime Compatibility](https://edge-runtime.vercel.app/packages)
