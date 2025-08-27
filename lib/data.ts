// Central data file for cities and sheikhs
// This will be replaced with API calls in production

export interface City {
  id: string
  name: string
  slug: string
  count: number
  region: string
  population: string
  description: string
  featured: boolean
}

export interface Sheikh {
  id: string
  name: string
  slug: string
  city: string
  citySlug: string
  phone: string
  whatsapp: string
  rating: number
  reviewCount: number
  specialties: string[]
  experience: string
  availability: "متاح" | "مشغول" | "غير متاح"
  bio: string
  education: string
  languages: string[]
  ratings: {
    commitment: number
    ease: number
    knowledge: number
    price: number
  }
  reviews: Array<{
    id: number
    name: string
    phone: string
    rating: number
    comment: string
    date: string
  }>
  verified: boolean
  price: string
  image?: string
}

// Cities data
export const cities: City[] = [
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
  },
]

// Sheikhs data
export const sheikhs: Sheikh[] = [
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
  },
]

// Helper functions
export function getCityBySlug(slug: string): City | undefined {
  return cities.find(city => city.slug === slug)
}

export function getSheikhBySlug(slug: string): Sheikh | undefined {
  return sheikhs.find(sheikh => sheikh.slug === slug)
}

export function getSheikhsByCity(citySlug: string): Sheikh[] {
  return sheikhs.filter(sheikh => sheikh.citySlug === citySlug)
}

export function getFeaturedCities(): City[] {
  return cities.filter(city => city.featured)
}

export function getAllSheikhs(): Sheikh[] {
  return sheikhs
}

export function getRegions() {
  const regions = cities.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = []
    }
    acc[city.region].push(city)
    return acc
  }, {} as Record<string, City[]>)

  return Object.entries(regions).map(([name, cities]) => ({
    name,
    cities
  }))
}
