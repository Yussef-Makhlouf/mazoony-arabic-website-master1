# Next.js 15 Update Guide

## التحديثات المطبقة

### 1. تحديث API Routes
في Next.js 15، الـ API routes تستخدم `Promise<{ slug: string }>` بدلاً من `{ slug: string }` مباشرة.

#### قبل التحديث:
```typescript
interface RouteParams {
  params: { slug: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = params // ❌ خطأ
  // ...
}
```

#### بعد التحديث:
```typescript
import { RouteContext } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { slug } = await params // ✅ صحيح
  // ...
}
```

### 2. تحديث Page Components
نفس التحديث يطبق على page.tsx components.

#### قبل التحديث:
```typescript
interface PageProps {
  params: { slug: string }
}

export default async function Page({ params }: PageProps) {
  const { slug } = params // ❌ خطأ
  // ...
}
```

#### بعد التحديث:
```typescript
import { PageProps } from '@/lib/types'

export default async function Page({ params }: PageProps) {
  const { slug } = await params // ✅ صحيح
  // ...
}
```

### 3. Client Components
الـ Client Components لا تحتاج `await` لأنها تتلقى البيانات مباشرة من الـ parent component.

```typescript
import { ClientPageProps } from '@/lib/types'

export default function ClientComponent({ params }: ClientPageProps) {
  const { slug } = params // ✅ صحيح
  // ...
}
```

## الملفات المحدثة

### API Routes
- `app/api/sheikhs/[slug]/route.ts`
- `app/api/cities/[slug]/route.ts`
- `app/api/cities/[slug]/sheikhs/route.ts`

### Page Components
- `app/city/[slug]/page.tsx`
- `app/sheikh/[slug]/page.tsx`

### Client Components
- `app/city/[slug]/CityClientPage.tsx`
- `app/sheikh/[slug]/SheikhProfileClient.tsx`

### Types
- `lib/types.ts` (جديد)

## الأنواع المشتركة

تم إنشاء ملف `lib/types.ts` يحتوي على جميع الأنواع المشتركة:

```typescript
// Route Context for API Routes
export type RouteContext = {
  params: Promise<{ slug: string }>
}

// Page Props for Server Components
export type PageProps = {
  params: Promise<{ slug: string }>
}

// Client Component Props
export type ClientPageProps = {
  params: { slug: string }
}
```

## فوائد التحديث

1. **توافق مع Next.js 15**: جميع الملفات متوافقة مع أحدث إصدار
2. **أمان TypeScript**: تعريفات واضحة وآمنة للأنواع
3. **توحيد الكود**: استخدام أنواع مشتركة في جميع أنحاء التطبيق
4. **صيانة أسهل**: تغيير نوع واحد يؤثر على جميع الملفات

## ملاحظات مهمة

1. **Server Components**: تحتاج `await params`
2. **Client Components**: لا تحتاج `await`
3. **API Routes**: تحتاج `await params`
4. **Static Generation**: `generateStaticParams` لا تتأثر بالتحديث

## اختبار التحديثات

```bash
# فحص TypeScript
npm run type-check

# تشغيل التطبيق
npm run dev

# بناء التطبيق
npm run build
```
