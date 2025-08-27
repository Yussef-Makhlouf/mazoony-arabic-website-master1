// سكريبت تحويل البيانات من lib/data.ts إلى MongoDB
// استخدم هذا السكريبت لتحويل البيانات الموجودة حالياً إلى قاعدة البيانات الجديدة

const { MongoClient } = require('mongodb');

// بيانات المدن من lib/data.ts
const citiesData = [
  { 
    id: "riyadh", 
    name: "الرياض", 
    slug: "al-riyadh", 
    count: 28,
    region: "منطقة الرياض",
    population: "7,000,000",
    description: "عاصمة المملكة العربية السعودية ومركزها السياسي والإداري",
    featured: true
  },
  { 
    id: "jeddah", 
    name: "جدة", 
    slug: "jeddah", 
    count: 22,
    region: "منطقة مكة المكرمة",
    population: "4,700,000",
    description: "العاصمة التجارية للمملكة ومدينة الحجاج",
    featured: true
  },
  { 
    id: "makkah", 
    name: "مكة المكرمة", 
    slug: "makkah-al-mukarramah", 
    count: 15,
    region: "منطقة مكة المكرمة",
    population: "2,400,000",
    description: "أقدس مدن الإسلام وموطن الكعبة المشرفة",
    featured: true
  },
  { 
    id: "madinah", 
    name: "المدينة المنورة", 
    slug: "al-madinah-al-munawwarah", 
    count: 18,
    region: "منطقة المدينة المنورة",
    population: "1,500,000",
    description: "مدينة النبي صلى الله عليه وسلم وموطن المسجد النبوي",
    featured: true
  },
  { 
    id: "dammam", 
    name: "الدمام", 
    slug: "dammam", 
    count: 16,
    region: "المنطقة الشرقية",
    population: "1,300,000",
    description: "عاصمة المنطقة الشرقية ومركز النفط في المملكة",
    featured: false
  },
  { 
    id: "taif", 
    name: "الطائف", 
    slug: "al-taif", 
    count: 12,
    region: "منطقة مكة المكرمة",
    population: "688,000",
    description: "مدينة الورود والمناخ المعتدل في المملكة",
    featured: false
  },
  { 
    id: "tabuk", 
    name: "تبوك", 
    slug: "tabuk", 
    count: 10,
    region: "منطقة تبوك",
    population: "594,000",
    description: "بوابة الشمال ومدينة التاريخ والتراث",
    featured: false
  },
  { 
    id: "abha", 
    name: "أبها", 
    slug: "abha", 
    count: 9,
    region: "منطقة عسير",
    population: "1,200,000",
    description: "عاصمة منطقة عسير ومدينة الضباب والجمال",
    featured: false
  },
  { 
    id: "hail", 
    name: "حائل", 
    slug: "hail", 
    count: 7,
    region: "منطقة حائل",
    population: "700,000",
    description: "مدينة التاريخ والأدب في شمال المملكة",
    featured: false
  },
  { 
    id: "qassim", 
    name: "القصيم", 
    slug: "al-qassim", 
    count: 11,
    region: "منطقة القصيم",
    population: "1,400,000",
    description: "سلة غذاء المملكة ومركز الزراعة",
    featured: false
  },
  { 
    id: "yanbu", 
    name: "ينبع", 
    slug: "yanbu", 
    count: 8,
    region: "منطقة المدينة المنورة",
    population: "300,000",
    description: "مدينة الصناعة والتصدير على البحر الأحمر",
    featured: false
  },
  { 
    id: "khobar", 
    name: "الخبر", 
    slug: "al-khobar", 
    count: 14,
    region: "المنطقة الشرقية",
    population: "1,100,000",
    description: "مدينة الخليج والجمال في المنطقة الشرقية",
    featured: false
  }
];

// بيانات المأذونين من lib/data.ts
const sheikhsData = [
  {
    id: "sheikh-1",
    name: "الشيخ عبدالرحمن بن سفر المالكي",
    slug: "abdulrahman-safer-al-malki",
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
    reviews: [
      {
        id: 1,
        name: "أحمد محمد العتيبي",
        phone: "+966501111111",
        rating: 5,
        comment: "خدمة ممتازة والشيخ متعاون جداً. تم إنجاز المعاملة بسرعة ودقة.",
        date: "2024-12-15",
      },
      {
        id: 2,
        name: "فهد عبدالله القحطاني",
        phone: "+966502222222",
        rating: 4,
        comment: "الشيخ محترف ولديه خبرة واسعة. أنصح بالتعامل معه.",
        date: "2024-12-10",
      },
      {
        id: 3,
        name: "سعد بن علي الدوسري",
        phone: "+966503333333",
        rating: 5,
        comment: "تعامل راقي وشرح مفصل لجميع الإجراءات. جزاه الله خيراً.",
        date: "2024-12-05",
      },
    ],
    verified: true,
    price: "400",
    image: "/professional-arabic-sheikh-portrait.png",
  },
  {
    id: "sheikh-2",
    name: "الشيخ محمد بن عناد الشربط",
    slug: "mohammed-enaad-al-sharbat",
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
    reviews: [
      {
        id: 1,
        name: "خالد بن سعد المطيري",
        phone: "+966504444444",
        rating: 5,
        comment: "الشيخ ممتاز في التعامل ولديه صبر في الشرح. أنصح به بشدة.",
        date: "2024-12-12",
      },
    ],
    verified: true,
    price: "350",
    image: "/professional-arabic-sheikh-portrait.png",
  },
  {
    id: "sheikh-3",
    name: "الشيخ أحمد بن علي الحارثي",
    slug: "ahmed-ali-al-harthi",
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
    reviews: [
      {
        id: 1,
        name: "عبدالله بن محمد الشمري",
        phone: "+966505555555",
        rating: 5,
        comment: "الشيخ أحمد لديه خبرة واسعة ويشرح الإجراءات بوضوح. أنصح به بشدة.",
        date: "2024-12-18",
      },
      {
        id: 2,
        name: "محمد بن عبدالعزيز العنزي",
        phone: "+966506666666",
        rating: 4,
        comment: "خدمة ممتازة وتعامل محترم. أشكره على تعاونه.",
        date: "2024-12-14",
      },
    ],
    verified: true,
    price: "500",
    image: "/professional-arabic-sheikh-portrait.png",
  },
  {
    id: "sheikh-4",
    name: "الشيخ خالد بن سعد العتيبي",
    slug: "khalid-saad-al-otaibi",
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
    reviews: [
      {
        id: 1,
        name: "عبدالرحمن الشمري",
        phone: "+966507777777",
        rating: 5,
        comment: "خدمة احترافية ومعاملة طيبة. الشيخ لديه علم واسع ويشرح بوضوح.",
        date: "2024-12-18",
      },
      {
        id: 2,
        name: "محمد العنزي",
        phone: "+966508888888",
        rating: 4,
        comment: "تعامل جيد وسرعة في الإنجاز. أشكره على تعاونه.",
        date: "2024-12-14",
      },
    ],
    verified: true,
    price: "450",
    image: "/professional-arabic-sheikh-portrait.png",
  },
  {
    id: "sheikh-5",
    name: "الشيخ عبدالله بن محمد الدوسري",
    slug: "abdullah-mohammed-al-dosari",
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
    reviews: [
      {
        id: 1,
        name: "عبدالعزيز بن فهد الشمري",
        phone: "+966509999999",
        rating: 5,
        comment: "الشيخ عبدالله متعاون جداً وسريع في الإنجاز. تم توثيق العقد بكل سهولة ويسر.",
        date: "2024-12-20",
      },
      {
        id: 2,
        name: "سلطان بن عبدالرحمن القحطاني",
        phone: "+966500000000",
        rating: 4,
        comment: "خدمة ممتازة وتعامل محترم. أنصح بالتعامل معه.",
        date: "2024-12-16",
      },
      {
        id: 3,
        name: "ناصر بن علي العتيبي",
        phone: "+966501111111",
        rating: 5,
        comment: "الشيخ لديه خبرة واسعة ويشرح الإجراءات بوضوح. جزاه الله خيراً.",
        date: "2024-12-11",
      },
    ],
    verified: true,
    price: "400",
    image: "/professional-arabic-sheikh-portrait.png",
  },
  {
    id: "sheikh-6",
    name: "الشيخ فهد بن عبدالعزيز القحطاني",
    slug: "fahd-abdulaziz-al-qahtani",
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
    reviews: [
      {
        id: 1,
        name: "عبدالرحمن بن سعد المطيري",
        phone: "+966502222222",
        rating: 5,
        comment: "الشيخ فهد ممتاز في التعامل وسريع في الإنجاز. أنصح به بشدة.",
        date: "2024-12-19",
      },
      {
        id: 2,
        name: "محمد بن خالد الشمري",
        phone: "+966503333333",
        rating: 4,
        comment: "خدمة جيدة وتعامل محترم. أشكره على تعاونه.",
        date: "2024-12-15",
      },
    ],
    verified: true,
    price: "380",
    image: "/professional-arabic-sheikh-portrait.png",
  }
];

// بيانات الرسائل الافتراضية
const messagesData = [
  {
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    subject: "استفسار عن مأذون في الرياض",
    message: "أريد معرفة أفضل مأذون في الرياض لتوثيق عقد زواج. هل يمكنكم مساعدتي؟",
    type: "inquiry",
    priority: "medium",
    status: "new",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20")
  },
  {
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966502345678",
    subject: "شكوى على مأذون",
    message: "تعاملت مع مأذون من خلال موقعكم وكانت الخدمة سيئة. أريد تقديم شكوى رسمية.",
    type: "complaint",
    priority: "high",
    status: "new",
    createdAt: new Date("2024-12-19"),
    updatedAt: new Date("2024-12-19")
  },
  {
    name: "عبدالرحمن سالم",
    email: "abdulrahman@example.com",
    phone: "+966503456789",
    subject: "طلب إضافة مأذون جديد",
    message: "أنا مأذون شرعي وأريد الانضمام لموقعكم. كيف يمكنني التسجيل؟",
    type: "contact",
    priority: "medium",
    status: "read",
    createdAt: new Date("2024-12-18"),
    updatedAt: new Date("2024-12-18"),
    readAt: new Date("2024-12-18")
  }
];

async function migrateData() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ تم الاتصال بقاعدة البيانات");

    const db = client.db("mazoony_db");

    // حذف البيانات الموجودة (اختياري)
    console.log("🗑️ حذف البيانات الموجودة...");
    await db.collection("cities").deleteMany({});
    await db.collection("sheikhs").deleteMany({});
    await db.collection("reviews").deleteMany({});
    await db.collection("messages").deleteMany({});

    // إدراج المدن
    console.log("🏙️ إدراج المدن...");
    const citiesToInsert = citiesData.map(city => ({
      name: city.name,
      slug: city.slug,
      region: city.region,
      population: city.population,
      description: city.description,
      featured: city.featured,
      count: city.count,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const citiesResult = await db.collection("cities").insertMany(citiesToInsert);
    console.log(`✅ تم إدراج ${citiesResult.insertedCount} مدينة`);

    // إنشاء خريطة للمدن
    const citiesMap = new Map();
    const insertedCities = await db.collection("cities").find({}).toArray();
    insertedCities.forEach(city => {
      citiesMap.set(city.slug, city._id);
    });

    // إدراج المأذونين
    console.log("👨‍💼 إدراج المأذونين...");
    const sheikhsToInsert = sheikhsData.map(sheikh => {
      const cityId = citiesMap.get(sheikh.citySlug);
      return {
        name: sheikh.name,
        slug: sheikh.slug,
        cityId: cityId,
        cityName: sheikh.city,
        citySlug: sheikh.citySlug,
        phone: sheikh.phone,
        whatsapp: sheikh.whatsapp,
        email: "", // سيتم إضافته لاحقاً
        rating: sheikh.rating,
        reviewCount: sheikh.reviewCount,
        specialties: sheikh.specialties,
        experience: sheikh.experience,
        availability: sheikh.availability,
        bio: sheikh.bio,
        education: sheikh.education,
        languages: sheikh.languages,
        ratings: sheikh.ratings,
        verified: sheikh.verified,
        price: sheikh.price,
        image: sheikh.image,
        documents: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    const sheikhsResult = await db.collection("sheikhs").insertMany(sheikhsToInsert);
    console.log(`✅ تم إدراج ${sheikhsResult.insertedCount} مأذون`);

    // إنشاء خريطة للمأذونين
    const sheikhsMap = new Map();
    const insertedSheikhs = await db.collection("sheikhs").find({}).toArray();
    insertedSheikhs.forEach(sheikh => {
      sheikhsMap.set(sheikh.slug, sheikh._id);
    });

    // إدراج التقييمات
    console.log("⭐ إدراج التقييمات...");
    const reviewsToInsert = [];
    sheikhsData.forEach(sheikh => {
      const sheikhId = sheikhsMap.get(sheikh.slug);
      if (sheikhId && sheikh.reviews) {
        sheikh.reviews.forEach(review => {
          reviewsToInsert.push({
            sheikhId: sheikhId,
            sheikhName: sheikh.name,
            sheikhSlug: sheikh.slug,
            name: review.name,
            phone: review.phone,
            email: "",
            rating: review.rating,
            comment: review.comment,
            ratings: {
              commitment: review.rating,
              ease: review.rating,
              knowledge: review.rating,
              price: review.rating
            },
            status: "approved",
            isVerified: true,
            reported: false,
            createdAt: new Date(review.date),
            updatedAt: new Date(review.date),
            approvedAt: new Date(review.date)
          });
        });
      }
    });

    if (reviewsToInsert.length > 0) {
      const reviewsResult = await db.collection("reviews").insertMany(reviewsToInsert);
      console.log(`✅ تم إدراج ${reviewsResult.insertedCount} تقييم`);
    }

    // إدراج الرسائل
    console.log("💬 إدراج الرسائل...");
    const messagesResult = await db.collection("messages").insertMany(messagesData);
    console.log(`✅ تم إدراج ${messagesResult.insertedCount} رسالة`);

    // إنشاء مستخدم مدير افتراضي
    console.log("👤 إنشاء مستخدم مدير...");
    const adminUser = {
      name: "مدير النظام",
      email: "admin@mazoony.com",
      password: "$2b$10$hashed_password_here", // يجب تشفير كلمة المرور
      role: "admin",
      permissions: ["all"],
      isActive: true,
      lastLogin: null,
      loginAttempts: 0,
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
    };

    await db.collection("users").insertOne(adminUser);
    console.log("✅ تم إنشاء مستخدم المدير");

    // إنشاء الإعدادات الافتراضية
    console.log("⚙️ إنشاء الإعدادات الافتراضية...");
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
    ];

    await db.collection("settings").insertMany(defaultSettings);
    console.log("✅ تم إنشاء الإعدادات الافتراضية");

    // تحديث عدد المأذونين في كل مدينة
    console.log("📊 تحديث إحصائيات المدن...");
    const cities = await db.collection("cities").find({}).toArray();
    for (const city of cities) {
      const sheikhCount = await db.collection("sheikhs").countDocuments({
        cityId: city._id,
        isActive: true
      });
      
      await db.collection("cities").updateOne(
        { _id: city._id },
        { $set: { count: sheikhCount } }
      );
    }
    console.log("✅ تم تحديث إحصائيات المدن");

    console.log("🎉 تم الانتهاء من تحويل البيانات بنجاح!");

  } catch (error) {
    console.error("❌ خطأ في تحويل البيانات:", error);
  } finally {
    await client.close();
    console.log("🔌 تم إغلاق الاتصال بقاعدة البيانات");
  }
}

// تشغيل السكريبت
migrateData().catch(console.error);

module.exports = { migrateData };
