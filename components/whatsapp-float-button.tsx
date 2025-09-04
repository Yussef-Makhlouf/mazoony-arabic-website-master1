"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppFloatButton() {
  const handleWhatsAppClick = () => {
    // رقم الواتساب - يمكن تغييره حسب الحاجة
    const phoneNumber = "966501234567" // مثال: رقم سعودي
    const message = "مرحباً، أريد الاستفسار عن خدمات المأذون الشرعي"
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-5 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center group"
        aria-label="تواصل معنا عبر الواتساب"
        title="تواصل معنا عبر الواتساب"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap" dir="rtl">
          تواصل معنا عبر الواتساب
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
        </div>
      </button>
    </div>
  )
}
