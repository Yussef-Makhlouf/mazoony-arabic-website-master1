# حل مشكلة ObjectId في نظام إعادة تعيين كلمة المرور

## 🚨 المشكلة
```
{error: "input must be a 24 character hex string, 12 byte Uint8Array, or an integer"}
```

## 🔍 السبب
المشكلة تحدث عندما نحاول استخدام `new ObjectId(id)` مع قيمة `id` ليست بالتنسيق الصحيح لـ ObjectId.

في نظام إعادة تعيين كلمة المرور:
1. `resetToken.userId` قد يكون مخزون كـ ObjectId في قاعدة البيانات
2. عندما نسترجعه ونحاول تمريره إلى `getUserById(id)` 
3. الدالة تحاول `new ObjectId(id)` مرة أخرى مما يسبب الخطأ

## ✅ الحل المطبق

### 1. تحديث `getUserById` لمعالجة كلا النوعين
```typescript
static async getUserById(id: string | ObjectId): Promise<User | null> {
  const db = await getDatabase();
  let objectId: ObjectId;
  
  try {
    // Handle both string and ObjectId inputs
    if (typeof id === 'string') {
      objectId = new ObjectId(id);
    } else {
      objectId = id;
    }
  } catch (error) {
    console.error('Invalid ObjectId format:', id);
    return null;
  }
  
  const user = await db.collection('users').findOne({ _id: objectId, isActive: true });
  if (user) {
    // Ensure _id is always a string in the returned object
    user._id = user._id.toString();
  }
  return user as User | null;
}
```

### 2. تحديث `PasswordResetToken` interface
```typescript
export interface PasswordResetToken {
  _id?: string;
  userId: string | ObjectId;  // 👈 كان string فقط
  token: string;
  code?: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}
```

### 3. تحسين `requestPasswordReset`
```typescript
const resetToken: Omit<PasswordResetToken, '_id'> = {
  userId: typeof user._id === 'string' ? new ObjectId(user._id) : user._id!,
  // ... rest of properties
};
```

### 4. تحسين `resetPassword`
```typescript
let userObjectId: ObjectId;
try {
  userObjectId = typeof user._id === 'string' ? new ObjectId(user._id) : user._id as ObjectId;
} catch (error) {
  throw new Error('معرف المستخدم غير صحيح');
}

await db.collection('users').updateOne(
  { _id: userObjectId },
  { $set: { password: hashedPassword, updatedAt: new Date() } }
);
```

### 5. ضمان إرجاع _id كـ string دائماً
```typescript
// في getUserByEmail
if (user) {
  user._id = user._id.toString();
}
return user as User | null;
```

## 🧪 كيفية الاختبار

1. **اختبار عبر الواجهة:**
   ```
   1. اذهب إلى /forgot-password
   2. أدخل البريد: admin@mazoony.com
   3. تحقق من عدم ظهور خطأ ObjectId
   4. أكمل عملية إعادة التعيين
   ```

2. **اختبار عبر API:**
   ```bash
   # طلب إعادة تعيين
   curl -X POST http://localhost:3000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@mazoony.com"}'
   
   # التحقق من الرمز
   curl -X POST http://localhost:3000/api/auth/verify-reset-code \
     -H "Content-Type: application/json" \
     -d '{"code":"123456","email":"admin@mazoony.com"}'
   ```

## 📊 النتيجة المتوقعة
- ✅ لا مزيد من أخطاء ObjectId
- ✅ نظام إعادة تعيين كلمة المرور يعمل بسلاسة
- ✅ معالجة صحيحة لكل من string و ObjectId
- ✅ حماية من القيم غير الصحيحة

## 🔐 الأمان
- التحقق من صحة ObjectId قبل الاستخدام
- إرجاع null بدلاً من رمي خطأ للقيم غير الصحيحة
- ضمان ثبات نوع البيانات المرجعة
