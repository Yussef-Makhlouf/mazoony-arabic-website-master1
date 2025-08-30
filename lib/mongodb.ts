import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://myAtlasDBUser:yussefali2134@myatlasclusteredu.lh95gxv.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU';
const client = new MongoClient(uri);

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    await client.connect();
    const db = client.db();
    
    cachedClient = client;
    cachedDb = db;
    
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    return { client, db };
  } catch (error) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

// وظيفة لتهيئة قاعدة البيانات
export async function initializeDatabase(): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    
    console.log('🚀 بدء تهيئة قاعدة البيانات...');
    
    // إنشاء المجموعات
    await createCollections(db);
    
    // إنشاء الفهارس
    await createIndexes(db);
    
    // إدخال البيانات الأولية
    await seedInitialData(db);
    
    console.log('✅ تم تهيئة قاعدة البيانات بنجاح');
  } catch (error) {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
    throw error;
  }
}

async function createCollections(db: Db): Promise<void> {
  const collections = [
    'cities',
    'sheikhs', 
    'reviews',
    'messages',
    'sheikhRequests',
    'users',
    'settings',
    'activityLogs',
    'statistics'
  ];

  for (const collectionName of collections) {
    try {
      await db.createCollection(collectionName);
      console.log(`✅ تم إنشاء مجموعة: ${collectionName}`);
    } catch (error: any) {
      if (error.code === 48) { // Collection already exists
        console.log(`ℹ️ المجموعة موجودة بالفعل: ${collectionName}`);
      } else {
        console.error(`❌ خطأ في إنشاء مجموعة ${collectionName}:`, error);
      }
    }
  }
}

async function createIndexes(db: Db): Promise<void> {
  try {
    // فهارس المدن
    await db.collection('cities').createIndex({ "slug": 1 }, { unique: true });
    await db.collection('cities').createIndex({ "region": 1 });
    await db.collection('cities').createIndex({ "featured": 1 });
    await db.collection('cities').createIndex({ "isActive": 1 });
    await db.collection('cities').createIndex({ "createdAt": -1 });

    // فهارس المأذونين
    await db.collection('sheikhs').createIndex({ "slug": 1 }, { unique: true });
    await db.collection('sheikhs').createIndex({ "cityId": 1 });
    await db.collection('sheikhs').createIndex({ "citySlug": 1 });
    await db.collection('sheikhs').createIndex({ "availability": 1 });
    await db.collection('sheikhs').createIndex({ "verified": 1 });
    await db.collection('sheikhs').createIndex({ "rating": -1 });
    await db.collection('sheikhs').createIndex({ "isActive": 1 });
    await db.collection('sheikhs').createIndex({ "createdAt": -1 });
    await db.collection('sheikhs').createIndex({ "specialties": 1 });
    await db.collection('sheikhs').createIndex({ "languages": 1 });

    // فهارس التقييمات
    await db.collection('reviews').createIndex({ "sheikhId": 1 });
    await db.collection('reviews').createIndex({ "status": 1 });
    await db.collection('reviews').createIndex({ "rating": -1 });
    await db.collection('reviews').createIndex({ "createdAt": -1 });
    await db.collection('reviews').createIndex({ "isVerified": 1 });
    await db.collection('reviews').createIndex({ "reported": 1 });
    await db.collection('reviews').createIndex({ "phone": 1 });
    await db.collection('reviews').createIndex({ "email": 1 });

    // فهارس الرسائل
    await db.collection('messages').createIndex({ "status": 1 });
    await db.collection('messages').createIndex({ "priority": 1 });
    await db.collection('messages').createIndex({ "type": 1 });
    await db.collection('messages').createIndex({ "createdAt": -1 });
    await db.collection('messages').createIndex({ "email": 1 });
    await db.collection('messages').createIndex({ "phone": 1 });
    await db.collection('messages').createIndex({ "sheikhId": 1 });
    await db.collection('messages').createIndex({ "tags": 1 });

    // فهارس المستخدمين
    await db.collection('users').createIndex({ "email": 1 }, { unique: true });
    await db.collection('users').createIndex({ "role": 1 });
    await db.collection('users').createIndex({ "isActive": 1 });
    await db.collection('users').createIndex({ "createdAt": -1 });
    await db.collection('users').createIndex({ "lastLogin": -1 });

    // فهارس الإعدادات
    await db.collection('settings').createIndex({ "key": 1 }, { unique: true });
    await db.collection('settings').createIndex({ "category": 1 });
    await db.collection('settings').createIndex({ "isPublic": 1 });

    // فهارس سجل النشاط
    await db.collection('activityLogs').createIndex({ "userId": 1 });
    await db.collection('activityLogs').createIndex({ "action": 1 });
    await db.collection('activityLogs').createIndex({ "resource": 1 });
    await db.collection('activityLogs').createIndex({ "createdAt": -1 });
    await db.collection('activityLogs').createIndex({ "ipAddress": 1 });

    // فهارس الإحصائيات
    await db.collection('statistics').createIndex({ "date": 1 });
    await db.collection('statistics').createIndex({ "type": 1 });
    await db.collection('statistics').createIndex({ "createdAt": -1 });

    console.log('✅ تم إنشاء جميع الفهارس بنجاح');
  } catch (error) {
    console.error('❌ خطأ في إنشاء الفهارس:', error);
    throw error;
  }
}

async function seedInitialData(db: Db): Promise<void> {
  try {
    // التحقق من وجود مستخدم مدير فقط
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('📝 إنشاء مستخدم مدير...');
      await createAdminUser(db);
    }

    // التحقق من وجود الإعدادات الأساسية فقط
    const settingsCount = await db.collection('settings').countDocuments();
    if (settingsCount === 0) {
      console.log('📝 إدخال الإعدادات الأساسية...');
      await seedBasicSettings(db);
    }

    console.log('✅ تم إدخال البيانات الأساسية بنجاح');
  } catch (error) {
    console.error('❌ خطأ في إدخال البيانات الأساسية:', error);
    throw error;
  }
}

// تم حذف البيانات الثابتة للمدن
async function seedCities(db: Db): Promise<void> {
  console.log('ℹ️ لا توجد بيانات ثابتة للمدن - يجب إدخالها يدوياً من لوحة التحكم');
}

// تم حذف البيانات الثابتة للمأذونين
async function seedSheikhs(db: Db): Promise<void> {
  console.log('ℹ️ لا توجد بيانات ثابتة للمأذونين - يجب إدخالها يدوياً من لوحة التحكم');
}

async function createAdminUser(db: Db): Promise<void> {
  const adminUser = {
    _id: "admin-1",
    name: "مدير النظام",
    email: "admin@mazoony.com",
    password: "$2b$10$hashed_password_here", // يجب تغييرها في الإنتاج
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
    updatedAt: new Date(),
    lastLogin: null
  };

  await db.collection('users').insertOne(adminUser);
  console.log('✅ تم إنشاء مستخدم مدير');
}

async function seedBasicSettings(db: Db): Promise<void> {
  const settings = [
    {
      key: "require_verification",
      value: true,
      type: "boolean",
      category: "security",
      description: "التحقق من المأذونين",
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: "max_login_attempts",
      value: 5,
      type: "number",
      category: "security",
      description: "الحد الأقصى لمحاولات تسجيل الدخول",
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: "site_name",
      value: "مأذوني",
      type: "string",
      category: "general",
      description: "اسم الموقع",
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: "site_description",
      value: "منصة إدارة المأذونين الشرعيين في المملكة العربية السعودية",
      type: "string",
      category: "general",
      description: "وصف الموقع",
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: "contact_email",
      value: "info@mazoony.com",
      type: "string",
      category: "contact",
      description: "البريد الإلكتروني للتواصل",
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      key: "contact_phone",
      value: "+966501234567",
      type: "string",
      category: "contact",
      description: "رقم الهاتف للتواصل",
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('settings').insertMany(settings);
  console.log(`✅ تم إدخال ${settings.length} إعداد`);
}
