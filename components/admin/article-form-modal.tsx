"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Save,
  X,
  Plus,
  Upload,
  Eye,
  FileText,
  Settings,
  Tag,
  Image as ImageIcon
} from "lucide-react"
import { articlesAPI } from "@/lib/api"
import { Article, ArticleCategory } from "@/lib/types"

interface ArticleFormModalProps {
  isOpen: boolean
  onClose: () => void
  article?: Article | null
  categories: ArticleCategory[]
  onSuccess: () => void
}

export default function ArticleFormModal({
  isOpen,
  onClose,
  article,
  categories,
  onSuccess
}: ArticleFormModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published' | 'archived',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    author: {
      name: 'مدير النظام',
      email: 'admin@mazoony.com',
      avatar: ''
    }
  })

  const [newTag, setNewTag] = useState('')
  const [newSeoKeyword, setNewSeoKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  // تحديث النموذج عند تغيير المقال
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        image: article.image || '',
        category: article.category || '',
        tags: article.tags || [],
        status: article.status || 'draft',
        featured: article.featured || false,
        seoTitle: article.seoTitle || '',
        seoDescription: article.seoDescription || '',
        seoKeywords: article.seoKeywords || [],
        author: article.author || {
          name: 'مدير النظام',
          email: 'admin@mazoony.com',
          avatar: ''
        }
      })
    } else {
      // إعادة تعيين النموذج للمقال الجديد
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        category: '',
        tags: [],
        status: 'draft',
        featured: false,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: [],
        author: {
          name: 'مدير النظام',
          email: 'admin@mazoony.com',
          avatar: ''
        }
      })
    }
    setError(null)
    setPreviewMode(false)
  }, [article, isOpen])

  // تحديث الـ slug تلقائياً عند تغيير العنوان
  useEffect(() => {
    if (formData.title && !article) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\w\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, article])

  // تحديث SEO title تلقائياً
  useEffect(() => {
    if (formData.title && !formData.seoTitle) {
      setFormData(prev => ({ ...prev, seoTitle: formData.title }))
    }
  }, [formData.title])

  // تحديث SEO description تلقائياً
  useEffect(() => {
    if (formData.excerpt && !formData.seoDescription) {
      setFormData(prev => ({ ...prev, seoDescription: formData.excerpt }))
    }
  }, [formData.excerpt])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddSeoKeyword = () => {
    if (newSeoKeyword.trim() && !formData.seoKeywords.includes(newSeoKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, newSeoKeyword.trim()]
      }))
      setNewSeoKeyword('')
    }
  }

  const handleRemoveSeoKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(keyword => keyword !== keywordToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('عنوان المقال مطلوب')
      return
    }

    if (!formData.content.trim()) {
      setError('محتوى المقال مطلوب')
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (article) {
        await articlesAPI.update(article._id, formData)
      } else {
        await articlesAPI.create(formData)
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Error saving article:', error)
      setError(error.message || 'فشل في حفظ المقال')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.title.trim() && formData.content.trim()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rtl">
        <DialogHeader>
          <DialogTitle className="arabic-heading">
            {article ? 'تعديل المقال' : 'إضافة مقال جديد'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="arabic-text">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="arabic-text">
                <FileText className="w-4 h-4 ml-2" />
                المحتوى
              </TabsTrigger>
              <TabsTrigger value="media" className="arabic-text">
                <ImageIcon className="w-4 h-4 ml-2" />
                الوسائط
              </TabsTrigger>
              <TabsTrigger value="settings" className="arabic-text">
                <Settings className="w-4 h-4 ml-2" />
                الإعدادات
              </TabsTrigger>
              <TabsTrigger value="seo" className="arabic-text">
                <Tag className="w-4 h-4 ml-2" />
                SEO
              </TabsTrigger>
            </TabsList>

            {/* محتوى المقال */}
            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="arabic-text">عنوان المقال *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="أدخل عنوان المقال"
                    className="arabic-text"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="arabic-text">الرابط المختصر</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="article-url-slug"
                    className="text-left"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="arabic-text">الملخص</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="ملخص قصير عن المقال"
                  className="arabic-text"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content" className="arabic-text">محتوى المقال *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="arabic-text"
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    {previewMode ? 'تحرير' : 'معاينة'}
                  </Button>
                </div>
                
                {previewMode ? (
                  <div 
                    className="min-h-[300px] p-4 border rounded-md bg-gray-50 prose prose-lg max-w-none arabic-text"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                ) : (
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="اكتب محتوى المقال هنا... يمكنك استخدام HTML للتنسيق"
                    className="arabic-text"
                    rows={15}
                    required
                  />
                )}
              </div>

              {/* الكلمات المفتاحية */}
              <div className="space-y-2">
                <Label className="arabic-text">الكلمات المفتاحية</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="أضف كلمة مفتاحية"
                    className="arabic-text"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    className="arabic-text"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="arabic-text">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* الوسائط */}
            <TabsContent value="media" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image" className="arabic-text">صورة المقال</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="text-left"
                />
              </div>

              {formData.image && (
                <div className="space-y-2">
                  <Label className="arabic-text">معاينة الصورة</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <img 
                      src={formData.image} 
                      alt="معاينة الصورة"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 arabic-text">
                  سيتم إضافة إمكانية رفع الصور لاحقاً
                </p>
              </div>
            </TabsContent>

            {/* الإعدادات */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="arabic-text">التصنيف</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="arabic-text">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="arabic-text">حالة المقال</Label>
                  <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                    <SelectTrigger className="arabic-text">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="published">منشور</SelectItem>
                      <SelectItem value="archived">مؤرشف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="featured" className="arabic-text font-medium">مقال مميز</Label>
                  <p className="text-sm text-gray-600 arabic-text">سيظهر هذا المقال في القسم المميز</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="arabic-text">معلومات المؤلف</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="authorName" className="arabic-text">اسم المؤلف</Label>
                    <Input
                      id="authorName"
                      value={formData.author.name}
                      onChange={(e) => handleInputChange('author', { ...formData.author, name: e.target.value })}
                      className="arabic-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorEmail" className="arabic-text">بريد المؤلف</Label>
                    <Input
                      id="authorEmail"
                      type="email"
                      value={formData.author.email}
                      onChange={(e) => handleInputChange('author', { ...formData.author, email: e.target.value })}
                      className="text-left"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* SEO */}
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle" className="arabic-text">عنوان SEO</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="عنوان محسن لمحركات البحث"
                  className="arabic-text"
                />
                <p className="text-xs text-gray-500 arabic-text">
                  الطول المثالي: 50-60 حرف (الحالي: {formData.seoTitle.length})
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription" className="arabic-text">وصف SEO</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="وصف محسن لمحركات البحث"
                  className="arabic-text"
                  rows={3}
                />
                <p className="text-xs text-gray-500 arabic-text">
                  الطول المثالي: 150-160 حرف (الحالي: {formData.seoDescription.length})
                </p>
              </div>

              <div className="space-y-2">
                <Label className="arabic-text">كلمات SEO المفتاحية</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSeoKeyword}
                    onChange={(e) => setNewSeoKeyword(e.target.value)}
                    placeholder="أضف كلمة SEO مفتاحية"
                    className="arabic-text"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSeoKeyword())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSeoKeyword}
                    className="arabic-text"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.seoKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.seoKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="arabic-text">
                        {keyword}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => handleRemoveSeoKeyword(keyword)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* أزرار الحفظ */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="arabic-text"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="arabic-text"
            >
              <Save className="w-4 h-4 ml-2" />
              {loading ? 'جاري الحفظ...' : (article ? 'تحديث المقال' : 'حفظ المقال')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
