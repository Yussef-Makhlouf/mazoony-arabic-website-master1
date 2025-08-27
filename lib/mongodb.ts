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
    // التحقق من وجود بيانات المدن
    const citiesCount = await db.collection('cities').countDocuments();
    if (citiesCount === 0) {
      console.log('📝 إدخال بيانات المدن...');
      await seedCities(db);
    }

    // التحقق من وجود بيانات المأذونين
    const sheikhsCount = await db.collection('sheikhs').countDocuments();
    if (sheikhsCount === 0) {
      console.log('📝 إدخال بيانات المأذونين...');
      await seedSheikhs(db);
    }

    // التحقق من وجود مستخدم مدير
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('📝 إنشاء مستخدم مدير...');
      await createAdminUser(db);
    }

    // التحقق من وجود الإعدادات
    const settingsCount = await db.collection('settings').countDocuments();
    if (settingsCount === 0) {
      console.log('📝 إدخال الإعدادات الافتراضية...');
      await seedSettings(db);
    }

    console.log('✅ تم إدخال البيانات الأولية بنجاح');
  } catch (error) {
    console.error('❌ خطأ في إدخال البيانات الأولية:', error);
    throw error;
  }
}

async function seedCities(db: Db): Promise<void> {
  const cities = [
    { 
      _id: "riyadh", 
      name: "الرياض", 
      slug: "al-riyadh", 
      count: 28,
      region: "منطقة الرياض",
      population: "7,000,000",
      description: "عاصمة المملكة العربية السعودية ومركزها السياسي والإداري",
      featured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "jeddah", 
      name: "جدة", 
      slug: "jeddah", 
      count: 22,
      region: "منطقة مكة المكرمة",
      population: "4,700,000",
      description: "العاصمة التجارية للمملكة ومدينة الحجاج",
      featured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "makkah", 
      name: "مكة المكرمة", 
      slug: "makkah-al-mukarramah", 
      count: 15,
      region: "منطقة مكة المكرمة",
      population: "2,400,000",
      description: "أقدس مدن الإسلام وموطن الكعبة المشرفة",
      featured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "madinah", 
      name: "المدينة المنورة", 
      slug: "al-madinah-al-munawwarah", 
      count: 18,
      region: "منطقة المدينة المنورة",
      population: "1,500,000",
      description: "مدينة النبي صلى الله عليه وسلم وموطن المسجد النبوي",
      featured: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "dammam", 
      name: "الدمام", 
      slug: "dammam", 
      count: 16,
      region: "المنطقة الشرقية",
      population: "1,300,000",
      description: "عاصمة المنطقة الشرقية ومركز النفط في المملكة",
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "taif", 
      name: "الطائف", 
      slug: "al-taif", 
      count: 12,
      region: "منطقة مكة المكرمة",
      population: "688,000",
      description: "مدينة الورود والمناخ المعتدل في المملكة",
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "tabuk", 
      name: "تبوك", 
      slug: "tabuk", 
      count: 10,
      region: "منطقة تبوك",
      population: "594,000",
      description: "بوابة الشمال ومدينة التاريخ والتراث",
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "abha", 
      name: "أبها", 
      slug: "abha", 
      count: 9,
      region: "منطقة عسير",
      population: "1,200,000",
      description: "عاصمة منطقة عسير ومدينة الضباب والجمال",
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "hail", 
      name: "حائل", 
      slug: "hail", 
      count: 7,
      region: "منطقة حائل",
      population: "700,000",
      description: "مدينة التاريخ والأدب في شمال المملكة",
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "qassim", 
      name: "القصيم", 
      slug: "al-qassim", 
      count: 11,
      region: "منطقة القصيم",
      population: "1,400,000",
      description: "سلة غذاء المملكة ومركز الزراعة",
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "yanbu", 
      name: "ينبع", 
      slug: "yanbu", 
      count: 8,
      region: "منطقة المدينة المنورة",
      population: "300,000",
      description: "مدينة الصناعة والتصدير على البحر الأحمر",
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      _id: "khobar", 
      name: "الخبر", 
      slug: "al-khobar", 
      count: 14,
      region: "المنطقة الشرقية",
      population: "1,100,000",
      description: "مدينة الخليج والجمال في المنطقة الشرقية",
      featured: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('cities').insertMany(cities);
  console.log(`✅ تم إدخال ${cities.length} مدينة`);
}

async function seedSheikhs(db: Db): Promise<void> {
  const sheikhs = [
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
      bio: "مأذون شرعي معتمد بخبرة 15 عاماً في توثيق عقود الزواج والاستشارات الشرعية. حاصل على إجازة شرعية من جامعة أم القرى ومعتمد من وزارة العدل.",
      education: "إجازة شرعية - جامعة أم القرى",
      languages: ["العربية", "الإنجليزية"],
      ratings: {
        commitment: 4.9,
        ease: 4.7,
        knowledge: 4.8,
        price: 4.6,
      },
      verified: true,
      isActive: true,
      price: "400",
      image: "/professional-arabic-sheikh-portrait.png",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "sheikh-2",
      name: "الشيخ محمد بن عناد الشربط",
      slug: "mohammed-enaad-al-sharbat",
      cityId: "makkah",
      city: "مكة المكرمة",
      citySlug: "makkah-al-mukarramah",
      phone: "+966502345678",
      whatsapp: "+966502345678",
      rating: 4.9,
      reviewCount: 89,
      specialties: ["توثيق العقود", "الإرشاد الأسري"],
      experience: "12 سنة خبرة",
      availability: "متاح",
      bio: "مأذون شرعي متخصص في توثيق العقود والإرشاد الأسري. يتميز بالدقة في العمل والالتزام بالمواعيد.",
      education: "ماجستير في الشريعة الإسلامية",
      languages: ["العربية"],
      ratings: {
        commitment: 5.0,
        ease: 4.8,
        knowledge: 4.9,
        price: 4.7,
      },
      verified: true,
      isActive: true,
      price: "350",
      image: "/professional-arabic-sheikh-portrait.png",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "sheikh-3",
      name: "الشيخ أحمد بن علي الحارثي",
      slug: "ahmed-ali-al-harthi",
      cityId: "makkah",
      city: "مكة المكرمة",
      citySlug: "makkah-al-mukarramah",
      phone: "+966503456789",
      whatsapp: "+966503456789",
      rating: 4.7,
      reviewCount: 156,
      specialties: ["عقود الزواج", "التوثيق الشرعي"],
      experience: "20 سنة خبرة",
      availability: "مشغول",
      bio: "مأذون شرعي معتمد بخبرة 20 عاماً في توثيق عقود الزواج والتوثيق الشرعي. يتميز بالخبرة الواسعة والدقة في العمل.",
      education: "دكتوراه في الفقه الإسلامي - جامعة أم القرى",
      languages: ["العربية", "الإنجليزية", "الأردية"],
      ratings: {
        commitment: 4.8,
        ease: 4.6,
        knowledge: 4.9,
        price: 4.5,
      },
      verified: true,
      isActive: true,
      price: "500",
      image: "/professional-arabic-sheikh-portrait.png",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "sheikh-4",
      name: "الشيخ خالد بن سعد العتيبي",
      slug: "khalid-saad-al-otaibi",
      cityId: "riyadh",
      city: "الرياض",
      citySlug: "al-riyadh",
      phone: "+966504567890",
      whatsapp: "+966504567890",
      rating: 4.9,
      reviewCount: 203,
      specialties: ["عقود الزواج", "الاستشارات الشرعية"],
      experience: "18 سنة خبرة",
      availability: "متاح",
      bio: "مأذون شرعي معتمد في الرياض بخبرة تزيد عن 18 عاماً. متخصص في عقود الزواج والاستشارات الشرعية.",
      education: "دكتوراه في الفقه الإسلامي",
      languages: ["العربية", "الإنجليزية", "الأردية"],
      ratings: {
        commitment: 4.8,
        ease: 4.9,
        knowledge: 5.0,
        price: 4.7,
      },
      verified: true,
      isActive: true,
      price: "450",
      image: "/professional-arabic-sheikh-portrait.png",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "sheikh-5",
      name: "الشيخ عبدالله بن محمد الدوسري",
      slug: "abdullah-mohammed-al-dosari",
      cityId: "riyadh",
      city: "الرياض",
      citySlug: "al-riyadh",
      phone: "+966505678901",
      whatsapp: "+966505678901",
      rating: 4.8,
      reviewCount: 174,
      specialties: ["توثيق العقود", "الإرشاد الأسري"],
      experience: "14 سنة خبرة",
      availability: "متاح",
      bio: "مأذون شرعي معتمد في الرياض بخبرة 14 عاماً في توثيق العقود والإرشاد الأسري. يتميز بالسرعة في الإنجاز والتعامل الراقي مع العملاء.",
      education: "بكالوريوس في الشريعة الإسلامية - جامعة الإمام محمد بن سعود",
      languages: ["العربية", "الإنجليزية"],
      ratings: {
        commitment: 4.9,
        ease: 4.8,
        knowledge: 4.7,
        price: 4.8,
      },
      verified: true,
      isActive: true,
      price: "400",
      image: "/professional-arabic-sheikh-portrait.png",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: "sheikh-6",
      name: "الشيخ فهد بن عبدالعزيز القحطاني",
      slug: "fahd-abdulaziz-al-qahtani",
      cityId: "jeddah",
      city: "جدة",
      citySlug: "jeddah",
      phone: "+966506789012",
      whatsapp: "+966506789012",
      rating: 4.7,
      reviewCount: 98,
      specialties: ["عقود الزواج", "التوثيق الشرعي"],
      experience: "16 سنة خبرة",
      availability: "متاح",
      bio: "مأذون شرعي معتمد في جدة بخبرة 16 عاماً في توثيق عقود الزواج والتوثيق الشرعي. يتميز بالدقة والسرعة في العمل.",
      education: "ماجستير في الشريعة الإسلامية - جامعة الملك عبدالعزيز",
      languages: ["العربية", "الإنجليزية"],
      ratings: {
        commitment: 4.8,
        ease: 4.7,
        knowledge: 4.6,
        price: 4.8,
      },
      verified: true,
      isActive: true,
      price: "380",
      image: "/professional-arabic-sheikh-portrait.png",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await db.collection('sheikhs').insertMany(sheikhs);
  console.log(`✅ تم إدخال ${sheikhs.length} مأذون`);
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

async function seedSettings(db: Db): Promise<void> {
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
