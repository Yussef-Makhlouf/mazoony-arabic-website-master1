import { connectToDatabase } from '../lib/mongodb'

async function seedBlogData() {
  try {
    const { db } = await connectToDatabase()
    
    console.log('🚀 بدء إدخال بيانات المدونة التجريبية...')

    // إدخال تصنيفات المقالات
    const categories = [
      {
        name: 'النصائح والإرشادات',
        slug: 'tips-guidance',
        description: 'نصائح مفيدة وإرشادات عامة حول الزواج والمأذونين',
        color: '#3B82F6',
        icon: 'lightbulb',
        isActive: true,
        articleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'الأسئلة الشائعة',
        slug: 'faq',
        description: 'إجابات على الأسئلة الأكثر شيوعاً',
        color: '#10B981',
        icon: 'help-circle',
        isActive: true,
        articleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'الأخبار والتحديثات',
        slug: 'news-updates',
        description: 'آخر الأخبار والتحديثات في مجال المأذونين',
        color: '#F59E0B',
        icon: 'newspaper',
        isActive: true,
        articleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'الثقافة الشرعية',
        slug: 'islamic-culture',
        description: 'مقالات حول الثقافة الشرعية والأحكام',
        color: '#8B5CF6',
        icon: 'book',
        isActive: true,
        articleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    await db.collection('articleCategories').insertMany(categories)
    console.log(`✅ تم إدخال ${categories.length} تصنيف`)

    // إدخال مقالات تجريبية
    const articles = [
      {
        title: 'كيفية اختيار المأذون المناسب لحفل زفافك',
        slug: 'how-to-choose-right-sheikh',
        excerpt: 'دليل شامل لمساعدتك في اختيار المأذون الشرعي المناسب لاحتياجاتك وتوقعاتك.',
        content: `
          <h2>مقدمة</h2>
          <p>يعتبر اختيار المأذون الشرعي المناسب من أهم القرارات التي يتخذها الزوجان قبل إتمام مراسم الزواج. فالمأذون ليس مجرد شخص يقوم بتوثيق العقد، بل هو مرشد ومساعد في هذه المرحلة المهمة من حياتكما.</p>
          
          <h2>العوامل المهمة في الاختيار</h2>
          <h3>1. الخبرة والتأهيل</h3>
          <p>تأكد من أن المأذون معتمد ومرخص من الجهات المختصة، ولديه خبرة كافية في هذا المجال.</p>
          
          <h3>2. السمعة والتقييمات</h3>
          <p>ابحث عن تقييمات العملاء السابقين واستفسر من الأصدقاء والعائلة عن تجاربهم.</p>
          
          <h3>3. التوافق الشخصي</h3>
          <p>من المهم أن تشعر بالراحة والثقة مع المأذون المختار.</p>
          
          <h2>نصائح إضافية</h2>
          <ul>
            <li>احجز مبكراً خاصة في مواسم الأعراس</li>
            <li>اسأل عن الأسعار والخدمات المقدمة</li>
            <li>تأكد من توافر المأذون في التاريخ المطلوب</li>
          </ul>
        `,
        image: '/placeholder.jpg',
        author: {
          name: 'د. أحمد المحمد',
          email: 'admin@mazoony.com',
          avatar: ''
        },
        category: 'tips-guidance',
        tags: ['اختيار المأذون', 'نصائح الزواج', 'دليل العروسين'],
        status: 'published' as const,
        featured: true,
        views: 245,
        readingTime: 5,
        seoTitle: 'كيفية اختيار المأذون المناسب - دليل شامل للعروسين',
        seoDescription: 'تعرف على أهم النصائح والمعايير لاختيار المأذون الشرعي المناسب لحفل زفافك',
        seoKeywords: ['اختيار المأذون', 'المأذون الشرعي', 'حفل الزفاف', 'نصائح الزواج'],
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin',
        updatedBy: 'admin'
      },
      {
        title: 'الأوراق المطلوبة لعقد الزواج في المملكة العربية السعودية',
        slug: 'required-documents-marriage',
        excerpt: 'قائمة شاملة بجميع الأوراق والوثائق المطلوبة لإتمام عقد الزواج وفقاً للأنظمة السعودية.',
        content: `
          <h2>الأوراق الأساسية</h2>
          <h3>للعريس</h3>
          <ul>
            <li>الهوية الوطنية أو الإقامة النظامية</li>
            <li>شهادة الميلاد</li>
            <li>شهادة عدم الممانعة من الزواج</li>
          </ul>
          
          <h3>للعروس</h3>
          <ul>
            <li>الهوية الوطنية أو الإقامة النظامية</li>
            <li>شهادة الميلاد</li>
            <li>موافقة ولي الأمر</li>
          </ul>
          
          <h2>أوراق إضافية</h2>
          <p>قد تطلب بعض الجهات أوراق إضافية حسب الحالة والظروف الخاصة.</p>
        `,
        author: {
          name: 'أ. سارة العثمان',
          email: 'admin@mazoony.com',
          avatar: ''
        },
        category: 'faq',
        tags: ['أوراق الزواج', 'المستندات المطلوبة', 'الإجراءات القانونية'],
        status: 'published' as const,
        featured: false,
        views: 189,
        readingTime: 3,
        seoTitle: 'الأوراق المطلوبة لعقد الزواج في السعودية',
        seoDescription: 'دليل شامل للأوراق والمستندات المطلوبة لإتمام عقد الزواج في المملكة العربية السعودية',
        seoKeywords: ['أوراق الزواج', 'عقد الزواج', 'المستندات المطلوبة', 'السعودية'],
        publishedAt: new Date(Date.now() - 86400000), // يوم واحد في الماضي
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        createdBy: 'admin',
        updatedBy: 'admin'
      },
      {
        title: 'أحكام وآداب الزواج في الإسلام',
        slug: 'marriage-rules-etiquette-islam',
        excerpt: 'تعرف على أهم الأحكام الشرعية وآداب الزواج في الإسلام التي يجب على كل مسلم معرفتها.',
        content: `
          <h2>أهمية الزواج في الإسلام</h2>
          <p>الزواج في الإسلام ليس مجرد عقد مدني، بل هو ميثاق غليظ ورباط مقدس بين الرجل والمرأة.</p>
          
          <h2>الأحكام الشرعية</h2>
          <h3>شروط صحة النكاح</h3>
          <ol>
            <li>وجود الولي للمرأة</li>
            <li>وجود شاهدين عدلين</li>
            <li>تحديد المهر</li>
            <li>رضا الطرفين</li>
          </ol>
          
          <h2>آداب الزواج</h2>
          <p>يُستحب اتباع السنة النبوية في جميع مراحل الزواج من الخطبة إلى الدخول.</p>
        `,
        author: {
          name: 'الشيخ محمد الأحمد',
          email: 'admin@mazoony.com',
          avatar: ''
        },
        category: 'islamic-culture',
        tags: ['أحكام الزواج', 'الفقه الإسلامي', 'آداب الزواج', 'الشريعة'],
        status: 'published' as const,
        featured: true,
        views: 312,
        readingTime: 7,
        seoTitle: 'أحكام وآداب الزواج في الإسلام - دليل شرعي شامل',
        seoDescription: 'تعرف على أهم الأحكام الشرعية وآداب الزواج في الإسلام وفقاً للقرآن والسنة النبوية',
        seoKeywords: ['أحكام الزواج', 'الفقه الإسلامي', 'آداب الزواج', 'الشريعة الإسلامية'],
        publishedAt: new Date(Date.now() - 172800000), // يومين في الماضي
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        createdBy: 'admin',
        updatedBy: 'admin'
      },
      {
        title: 'تطورات جديدة في أنظمة الزواج والطلاق',
        slug: 'new-marriage-divorce-regulations',
        excerpt: 'آخر التطورات والتحديثات في أنظمة الزواج والطلاق والتي تهم جميع المواطنين.',
        content: `
          <h2>التحديثات الحديثة</h2>
          <p>شهدت الأنظمة المتعلقة بالزواج والطلاق تطورات مهمة تهدف إلى تسهيل الإجراءات وحماية حقوق الأطراف.</p>
          
          <h2>أهم التغييرات</h2>
          <ul>
            <li>تبسيط إجراءات التوثيق</li>
            <li>إدخال الخدمات الإلكترونية</li>
            <li>تعزيز الحماية القانونية</li>
          </ul>
          
          <h2>كيفية الاستفادة</h2>
          <p>يمكن للمواطنين الاستفادة من هذه التطورات من خلال منصات الخدمات الحكومية الإلكترونية.</p>
        `,
        author: {
          name: 'أ. فاطمة الزهراني',
          email: 'admin@mazoony.com',
          avatar: ''
        },
        category: 'news-updates',
        tags: ['تطورات الأنظمة', 'الخدمات الحكومية', 'الأخبار'],
        status: 'published' as const,
        featured: false,
        views: 156,
        readingTime: 4,
        seoTitle: 'تطورات جديدة في أنظمة الزواج والطلاق في السعودية',
        seoDescription: 'اطلع على آخر التطورات والتحديثات في أنظمة الزواج والطلاق في المملكة العربية السعودية',
        seoKeywords: ['أنظمة الزواج', 'تطورات قانونية', 'الخدمات الحكومية', 'السعودية'],
        publishedAt: new Date(Date.now() - 259200000), // ثلاثة أيام في الماضي
        createdAt: new Date(Date.now() - 259200000),
        updatedAt: new Date(Date.now() - 259200000),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    ]

    await db.collection('articles').insertMany(articles)
    console.log(`✅ تم إدخال ${articles.length} مقال`)

    // تحديث عدادات التصنيفات
    for (const category of categories) {
      const count = await db.collection('articles').countDocuments({ 
        category: category.slug, 
        status: 'published' 
      })
      
      await db.collection('articleCategories').updateOne(
        { slug: category.slug },
        { $set: { articleCount: count } }
      )
    }
    
    console.log('✅ تم تحديث عدادات التصنيفات')
    console.log('🎉 تم إدخال جميع بيانات المدونة بنجاح!')

  } catch (error) {
    console.error('❌ خطأ في إدخال بيانات المدونة:', error)
    throw error
  }
}

// تشغيل الكود
if (require.main === module) {
  seedBlogData()
    .then(() => {
      console.log('✅ انتهى تشغيل السكريبت')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ خطأ:', error)
      process.exit(1)
    })
}

export default seedBlogData
