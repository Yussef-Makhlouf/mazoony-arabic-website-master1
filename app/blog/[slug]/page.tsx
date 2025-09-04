import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar,
  Clock,
  User,
  Eye,
  ArrowRight,
  ArrowLeft,
  Share2,
  Tag,
  Home
} from "lucide-react"
import { articlesAPI, articleCategoriesAPI } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { Article, ArticleCategory } from "@/lib/types"
import { NavBar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getArticleData(slug: string): Promise<{
  article: Article | null
  relatedArticles: Article[]
  categories: ArticleCategory[]
}> {
  try {
    const [article, categories] = await Promise.all([
      articlesAPI.getBySlug(slug, true), // زيادة عداد المشاهدات
      articleCategoriesAPI.getAll(true)
    ])

    if (!article || article.status !== 'published') {
      return { article: null, relatedArticles: [], categories: [] }
    }

    // جلب المقالات ذات الصلة
    const relatedArticles = await articlesAPI.getAll({
      status: 'published',
      category: article.category,
      limit: 3
    })

    // استبعاد المقال الحالي من المقالات ذات الصلة
    const filteredRelated = relatedArticles.filter(a => a._id !== article._id)

    return {
      article,
      relatedArticles: filteredRelated,
      categories
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return { article: null, relatedArticles: [], categories: [] }
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const { article, relatedArticles, categories } = await getArticleData(slug)

  if (!article) {
    notFound()
  }

  const getCategoryName = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug)
    return category?.name || categorySlug
  }

  const getCategoryColor = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug)
    return category?.color || '#3B82F6'
  }

  // تحويل التاريخ
  const publishDate = article.publishedAt || article.createdAt
  const formattedDate = formatDate(publishDate)

  return (
    <>
    <NavBar/>
    <div id="top" className="min-h-screen bg-white rtl">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ArrowLeft className="w-4 h-4" />
            <Link href="/blog" className="hover:text-primary transition-colors arabic-text">
              المدونة
            </Link>
            <ArrowLeft className="w-4 h-4" />
            <span className="text-gray-900 arabic-text">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge 
                variant="outline" 
                style={{ borderColor: getCategoryColor(article.category) }}
                className="arabic-text"
              >
                <Tag className="w-3 h-3 ml-1" />
                {getCategoryName(article.category)}
              </Badge>
              
              {article.featured && (
                <Badge className="bg-yellow-500 text-white arabic-text">
                  مميز
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-relaxed arabic-heading">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed arabic-text">
                {article.excerpt}
              </p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="arabic-text">{article.author.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="arabic-text">{article.readingTime} دقائق قراءة</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{article.views || 0} مشاهدة</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 arabic-text">شارك المقال:</span>
              <Button variant="outline" size="sm" className="arabic-text">
                <Share2 className="w-4 h-4 ml-2" />
                مشاركة
              </Button>
            </div>
          </header>

          {/* Article Image */}
          {article.image && (
            <div className="mb-8">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-12 arabic-text">
            <div 
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 arabic-heading">
                الكلمات المفتاحية
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="arabic-text">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-12" />

          {/* Author Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 arabic-heading">
                  {article.author.name}
                </h4>
                <p className="text-gray-600 arabic-text">
                  كاتب في مدونة مأذوني
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 arabic-heading">
                مقالات ذات صلة
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link 
                    key={relatedArticle._id} 
                    href={`/blog/${relatedArticle.slug}`}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                      {relatedArticle.image && (
                        <div className="relative overflow-hidden">
                          <img 
                            src={relatedArticle.image}
                            alt={relatedArticle.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <CardContent className="p-4">
                        <Badge 
                          variant="outline" 
                          className="mb-2 arabic-text"
                          style={{ borderColor: getCategoryColor(relatedArticle.category) }}
                        >
                          {getCategoryName(relatedArticle.category)}
                        </Badge>
                        
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors arabic-heading line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        
                        {relatedArticle.excerpt && (
                          <p className="text-sm text-gray-600 line-clamp-2 arabic-text">
                            {relatedArticle.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-1 text-primary text-sm mt-3 arabic-text">
                          <span>اقرأ المزيد</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center">
              <Link href="/blog">
                <Button variant="outline" className="arabic-text">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  العودة للمدونة
                </Button>
              </Link>
              
              <Link href="#top">
                <Button variant="outline" className="arabic-text">
                  العودة للأعلى
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
   
    <Footer />
    </>
  )
}

// تحسين SEO
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  
  try {
    const article = await articlesAPI.getBySlug(slug)
    
    if (!article || article.status !== 'published') {
      return {
        title: 'المقال غير موجود - مأذوني',
        description: 'المقال المطلوب غير موجود'
      }
    }

    return {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      keywords: article.seoKeywords?.join(', '),
      authors: [{ name: article.author.name }],
      openGraph: {
        title: article.title,
        description: article.excerpt,
        images: article.image ? [article.image] : [],
        type: 'article',
        publishedTime: article.publishedAt?.toISOString(),
        authors: [article.author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: article.image ? [article.image] : [],
      }
    }
  } catch (error) {
    return {
      title: 'خطأ في تحميل المقال - مأذوني',
      description: 'حدث خطأ أثناء تحميل المقال'
    }
  }
}
