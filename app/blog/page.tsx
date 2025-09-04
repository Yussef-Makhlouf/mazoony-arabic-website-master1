"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search,
  Calendar,
  Clock,
  User,
  Eye,
  ArrowRight,
  Filter,
  Star
} from "lucide-react"
import { articlesAPI, articleCategoriesAPI } from "@/lib/api"
import { Article, ArticleCategory } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const articlesPerPage = 9

  useEffect(() => {
    fetchData()
  }, [currentPage, selectedCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm])

  const fetchData = async () => {
    try {
      setLoading(true)

      const params: any = {
        status: 'published',
        page: currentPage,
        limit: articlesPerPage
      }

      if (selectedCategory !== "all") {
        params.category = selectedCategory
      }

      if (searchTerm) {
        params.search = searchTerm
      }

      const [articlesResponse, categoriesData, featuredData] = await Promise.all([
        articlesAPI.getAllWithPagination(params),
        articleCategoriesAPI.getAll(true),
        articlesAPI.getAll({ status: 'published', featured: true, limit: 3 })
      ])

      setArticles(articlesResponse.articles)
      setTotalPages(articlesResponse.pagination.pages)
      setCategories(categoriesData)
      setFeaturedArticles(featuredData)

    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchData()
  }

  const getCategoryName = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug)
    return category?.name || categorySlug
  }

  const getCategoryColor = (categorySlug: string) => {
    const category = categories.find(c => c.slug === categorySlug)
    return category?.color || '#3B82F6'
  }

  if (loading && articles.length === 0) {
    return (
     
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white rtl">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Featured Articles Skeleton */}
          <div className="mb-12">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Articles Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 arabic-heading">
            مدونة مأذوني
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto arabic-text">
            اكتشف أحدث المقالات والمعلومات المفيدة حول خدمات المأذونين والزواج في المملكة العربية السعودية
          </p>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900 arabic-heading">
                المقالات المميزة
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Link key={article._id} href={`/blog/${article.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-yellow-200">
                    {article.image && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="w-3 h-3 ml-1" />
                            مميز
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: getCategoryColor(article.category) }}
                          className="arabic-text"
                        >
                          {getCategoryName(article.category)}
                        </Badge>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors arabic-heading">
                        {article.title}
                      </h3>
                      
                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-2 arabic-text">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span className="arabic-text">{article.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث في المقالات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10 arabic-text"
                />
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="arabic-text"
              >
                جميع المقالات
              </Button>
              
              {categories.map((category) => (
                <Button
                  key={category._id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.slug)}
                  className="arabic-text"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2 arabic-heading">
              لا توجد مقالات
            </h3>
            <p className="text-gray-500 arabic-text">
              لم يتم العثور على مقالات تطابق البحث أو الفلتر المحدد
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {articles.map((article) => (
                <Link key={article._id} href={`/blog/${article.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                    {article.image && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: getCategoryColor(article.category) }}
                          className="arabic-text"
                        >
                          {getCategoryName(article.category)}
                        </Badge>
                        
                        {article.views && article.views > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{article.views}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors arabic-heading line-clamp-2">
                        {article.title}
                      </h3>
                      
                      {article.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3 arabic-text flex-1">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span className="arabic-text">{article.author.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="arabic-text">{article.readingTime} دقائق</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-primary font-medium mt-4 arabic-text">
                        <span>اقرأ المزيد</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="arabic-text"
                >
                  السابق
                </Button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        size="sm"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="arabic-text"
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    <Footer />
    </>
  )
}
