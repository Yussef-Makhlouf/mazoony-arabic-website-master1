"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  Filter,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Star
} from "lucide-react"
import { articlesAPI, articleCategoriesAPI } from "@/lib/api"
import { Article, ArticleCategory } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import ArticleFormModal from "@/components/admin/article-form-modal"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0
  })

  // جلب البيانات
  useEffect(() => {
    fetchData()
  }, [statusFilter, categoryFilter])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: any = {}
      if (statusFilter !== "all") params.status = statusFilter
      if (categoryFilter !== "all") params.category = categoryFilter
      if (searchTerm) params.search = searchTerm

      const [articlesData, categoriesData] = await Promise.all([
        articlesAPI.getAll(params),
        articleCategoriesAPI.getAll(true)
      ])

      setArticles(articlesData)
      setCategories(categoriesData)

      // حساب الإحصائيات
      setStats({
        total: articlesData.length,
        published: articlesData.filter(a => a.status === 'published').length,
        draft: articlesData.filter(a => a.status === 'draft').length,
        featured: articlesData.filter(a => a.featured).length
      })

    } catch (error) {
      console.error('Error fetching data:', error)
      setError('فشل في تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  // البحث
  const handleSearch = () => {
    fetchData()
  }

  // حذف مقال
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    try {
      await articlesAPI.delete(id)
      await fetchData()
    } catch (error) {
      console.error('Error deleting article:', error)
      setError('فشل في حذف المقال')
    }
  }

  // عرض الحالة
  const getStatusBadge = (status: string) => {
    const variants = {
      published: { variant: "default" as const, label: "منشور", color: "bg-green-100 text-green-800" },
      draft: { variant: "secondary" as const, label: "مسودة", color: "bg-yellow-100 text-yellow-800" },
      archived: { variant: "outline" as const, label: "مؤرشف", color: "bg-gray-100 text-gray-800" }
    }
    
    const config = variants[status as keyof typeof variants] || variants.draft
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  // الحصول على اسم التصنيف
  const getCategoryName = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug)
    return category?.name || categorySlug
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-full mb-4" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 arabic-heading">إدارة المقالات</h1>
          <p className="text-gray-600 arabic-text">إدارة مقالات ومحتوى المدونة</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedArticle(null)
            setIsFormOpen(true)
          }}
          className="arabic-text"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة مقال جديد
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="arabic-text">{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 arabic-text">إجمالي المقالات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 arabic-text">المقالات المنشورة</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 arabic-text">المسودات</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <Edit className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 arabic-text">المقالات المميزة</p>
                <p className="text-2xl font-bold text-purple-600">{stats.featured}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في المقالات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pr-10 arabic-text"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="arabic-text">
                <SelectValue placeholder="تصفية بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="published">منشور</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="archived">مؤرشف</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="arabic-text">
                <SelectValue placeholder="تصفية بالتصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="arabic-text">
              <Filter className="w-4 h-4 ml-2" />
              تطبيق الفلتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle className="arabic-heading">قائمة المقالات</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 arabic-text">لا توجد مقالات</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="arabic-text">العنوان</TableHead>
                  <TableHead className="arabic-text">التصنيف</TableHead>
                  <TableHead className="arabic-text">الحالة</TableHead>
                  <TableHead className="arabic-text">المؤلف</TableHead>
                  <TableHead className="arabic-text">المشاهدات</TableHead>
                  <TableHead className="arabic-text">تاريخ الإنشاء</TableHead>
                  <TableHead className="arabic-text">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {article.image && (
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 arabic-text">
                            {article.title}
                          </p>
                          {article.featured && (
                            <Badge variant="secondary" className="mt-1">
                              <Star className="w-3 h-3 ml-1" />
                              مميز
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="arabic-text">
                        {getCategoryName(article.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(article.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 arabic-text">
                          {article.author.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {article.views || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(article.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedArticle(article)
                            setIsViewOpen(true)
                          }}
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedArticle(article)
                            setIsFormOpen(true)
                          }}
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(article._id)}
                          title="حذف"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Article Form Modal */}
      <ArticleFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedArticle(null)
        }}
        article={selectedArticle}
        categories={categories}
        onSuccess={fetchData}
      />

      {/* Article View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rtl">
          <DialogHeader>
            <DialogTitle className="arabic-heading">تفاصيل المقال</DialogTitle>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="space-y-6">
              {/* Article Header */}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-gray-900 arabic-heading">
                  {selectedArticle.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="arabic-text">{selectedArticle.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedArticle.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{selectedArticle.views || 0} مشاهدة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span className="arabic-text">{getCategoryName(selectedArticle.category)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedArticle.status)}
                  {selectedArticle.featured && (
                    <Badge variant="secondary">
                      <Star className="w-3 h-3 ml-1" />
                      مميز
                    </Badge>
                  )}
                </div>
              </div>

              {/* Article Image */}
              {selectedArticle.image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={selectedArticle.image} 
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Article Excerpt */}
              {selectedArticle.excerpt && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 arabic-heading">الملخص</h3>
                  <p className="text-gray-700 arabic-text">{selectedArticle.excerpt}</p>
                </div>
              )}

              {/* Article Content */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 arabic-heading">المحتوى</h3>
                <div 
                  className="prose prose-lg max-w-none arabic-text"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>

              {/* Article Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 arabic-heading">الكلمات المفتاحية</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="arabic-text">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Info */}
              {(selectedArticle.seoTitle || selectedArticle.seoDescription) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2 arabic-heading">معلومات SEO</h3>
                  {selectedArticle.seoTitle && (
                    <div className="mb-2">
                      <span className="font-medium text-blue-800 arabic-text">عنوان SEO: </span>
                      <span className="text-blue-700 arabic-text">{selectedArticle.seoTitle}</span>
                    </div>
                  )}
                  {selectedArticle.seoDescription && (
                    <div>
                      <span className="font-medium text-blue-800 arabic-text">وصف SEO: </span>
                      <span className="text-blue-700 arabic-text">{selectedArticle.seoDescription}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
