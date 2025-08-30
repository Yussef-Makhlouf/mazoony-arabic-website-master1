"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { reviewsAPI } from "@/lib/api"
import { cn } from "@/lib/utils"
import { 
  Menu, 
  X, 
  Home,
  Building2,
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  MessageSquare,
  Bell,
  PanelRight,
  PanelLeft
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // تحديد ما إذا كان الجهاز موبايل
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(false) // إلغاء التصغير في الموبايل
      }
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // جلب التقييمات لعرض العداد
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await reviewsAPI.getAll()
        setReviews(reviewsData)
      } catch (error) {
        console.error('Error fetching reviews for badge:', error)
      }
    }
    
    fetchReviews()
  }, [])

  const navigation = [
    {
      name: "الرئيسية",
      href: "/admin",
      icon: Home,
      current: pathname === "/admin"
    },
    {
      name: "المدن",
      href: "/admin/cities",
      icon: Building2,
      current: pathname.startsWith("/admin/cities")
    },
    {
      name: "المأذونين",
      href: "/admin/sheikhs",
      icon: Users,
      current: pathname.startsWith("/admin/sheikhs")
    },
    {
      name: "التقييمات",
      href: "/admin/reviews",
      icon: FileText,
      current: pathname.startsWith("/admin/reviews"),
      badge: reviews?.filter(r => r.status === 'pending')?.length || 0
    },
    {
      name: "الرسائل",
      href: "/admin/messages",
      icon: MessageSquare,
      current: pathname.startsWith("/admin/messages")
    },
    {
      name: "الإحصائيات",
      href: "/admin/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/admin/analytics")
    },
    {
      name: "الإعدادات",
      href: "/admin/settings",
      icon: Settings,
      current: pathname.startsWith("/admin/settings")
    }
  ]

  // مكون الـ Sidebar المحسّن
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        {(!sidebarCollapsed || isMobile) && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm arabic-text">م</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 arabic-heading">لوحة التحكم</h1>
              <p className="text-xs text-gray-500 arabic-text">مأذوني</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
              title={sidebarCollapsed ? "توسيع الشريط الجانبي" : "تصغير الشريط الجانبي"}
            >
              {sidebarCollapsed ? <PanelRight className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </Button>
          )}
          
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              title="إغلاق القائمة"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 arabic-text",
                item.current 
                  ? 'bg-primary text-white shadow-sm border-r-4 border-primary-foreground' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:border-r-2 hover:border-primary',
                (!sidebarCollapsed || isMobile) ? 'justify-start' : 'justify-center'
              )}
              onClick={() => {
                if (isMobile) setSidebarOpen(false)
              }}
              title={sidebarCollapsed && !isMobile ? item.name : undefined}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-colors",
                item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500',
                (!sidebarCollapsed || isMobile) ? 'ml-3' : ''
              )} />
              
              {(!sidebarCollapsed || isMobile) && (
                <>
                  <span className="truncate flex-1">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="mr-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className={cn(
          "flex items-center gap-3",
          (!sidebarCollapsed || isMobile) ? 'mb-3' : 'justify-center'
        )}>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 arabic-text">المدير</p>
              <p className="text-xs text-gray-500 arabic-text">admin@mazoony.com</p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-gray-700 hover:bg-gray-100 hover:text-gray-900 arabic-text transition-all",
            (!sidebarCollapsed || isMobile) ? 'w-full' : 'w-8 h-8 p-0'
          )}
          title="تسجيل الخروج"
        >
          <LogOut className={cn(
            "w-4 h-4",
            (!sidebarCollapsed || isMobile) ? 'ml-2' : ''
          )} />
          {(!sidebarCollapsed || isMobile) && "تسجيل الخروج"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent 
            side="right" 
            className="w-72 p-0 bg-white border-l border-gray-200"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>القائمة الجانبية</SheetTitle>
            </SheetHeader>
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className={cn(
          "fixed top-0 right-0 z-50 h-full bg-white shadow-xl transition-all duration-300 ease-in-out border-l border-gray-200",
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}>
          <SidebarContent />
        </div>
      )}

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        !isMobile ? (sidebarCollapsed ? 'lg:mr-16' : 'lg:mr-64') : ''
      )}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
                title="فتح القائمة"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <h1 className="text-lg font-semibold text-gray-900 arabic-heading hidden sm:block">
                لوحة التحكم
              </h1>
            </div>

            <div className="flex items-center gap-4">
        
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 arabic-text">المدير</p>
                  <p className="text-xs text-gray-500 arabic-text">admin@mazoony.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
