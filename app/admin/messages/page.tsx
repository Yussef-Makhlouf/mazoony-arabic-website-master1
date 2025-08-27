"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DeleteModal } from "@/components/ui/delete-modal"
import { messagesAPI } from "@/lib/api"
import { 
  MessageSquare, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Reply,
  Mail,
  Calendar,
  User,
  Phone,
  Send
} from "lucide-react"

export default function AdminMessages() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyText, setReplyText] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    messageId: 0,
    messageSubject: ""
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // جلب الرسائل من API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const allMessages = await messagesAPI.getAll()
        setMessages(allMessages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        toast({
          title: "خطأ",
          description: "فشل في جلب الرسائل",
          variant: "destructive",
        })
      }
    }
    
    fetchMessages()
  }, [toast])

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || message.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await messagesAPI.update(messageId.toString(), { status: "read" })
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: "read" } : msg
      ))
      toast({
        title: "نجح",
        description: "تم تحديد الرسالة كمقروءة",
      })
    } catch (error) {
      console.error('Error marking message as read:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث حالة الرسالة",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsReplied = async (messageId: number) => {
    try {
      await messagesAPI.update(messageId.toString(), { status: "replied" })
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: "replied" } : msg
      ))
      toast({
        title: "نجح",
        description: "تم تحديد الرسالة كرد",
      })
    } catch (error) {
      console.error('Error marking message as replied:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث حالة الرسالة",
        variant: "destructive",
      })
    }
  }

  const openDeleteModal = (messageId: number, messageSubject: string) => {
    setDeleteModal({
      isOpen: true,
      messageId,
      messageSubject
    })
  }

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      messageId: 0,
      messageSubject: ""
    })
  }

  const handleDeleteMessage = async () => {
    setIsDeleting(true)
    try {
      await messagesAPI.delete(deleteModal.messageId.toString())
      setMessages(prev => prev.filter(msg => msg.id !== deleteModal.messageId))
      toast({
        title: "نجح",
        description: "تم حذف الرسالة بنجاح",
      })
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting message:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الرسالة",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReply = () => {
    if (replyText.trim() && selectedMessage) {
      // هنا سيتم إرسال الرد
      console.log("إرسال رد:", replyText)
      handleMarkAsReplied(selectedMessage.id)
      setReplyText("")
      setSelectedMessage(null)
      toast({
        title: "نجح",
        description: "تم إرسال الرد بنجاح",
      })
    } else {
      toast({
        title: "خطأ",
        description: "يرجى كتابة نص الرد",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-gray-100 text-gray-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = {
    totalMessages: messages.length,
    unreadMessages: messages.filter(m => m.status === "unread").length,
    repliedMessages: messages.filter(m => m.status === "replied").length,
    highPriorityMessages: messages.filter(m => m.priority === "high").length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الرسائل</h1>
          <p className="text-gray-600">إدارة جميع الرسائل والاستفسارات</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الرسائل</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">رسالة واردة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرسائل الجديدة</CardTitle>
            <Mail className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">رسالة غير مقروءة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الردود المرسلة</CardTitle>
            <Reply className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.repliedMessages}</div>
            <p className="text-xs text-muted-foreground">رسالة تم الرد عليها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عالية الأولوية</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPriorityMessages}</div>
            <p className="text-xs text-muted-foreground">رسالة عالية الأولوية</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>البحث والفلترة</CardTitle>
          <CardDescription>البحث في الرسائل وفلترة النتائج</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث في الرسائل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">جميع الرسائل</option>
                <option value="unread">غير مقروءة</option>
                <option value="read">مقروءة</option>
                <option value="replied">تم الرد عليها</option>
              </select>
            </div>

            <div>
              <select className="w-full p-2 border border-gray-300 rounded-md bg-white">
                <option value="all">جميع الأولويات</option>
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
            </div>

            <div>
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 ml-2" />
                فلترة متقدمة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List and Detail */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الرسائل</CardTitle>
            <CardDescription>
              عرض {filteredMessages.length} من {messages.length} رسالة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                  } ${message.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message)
                    if (message.status === 'unread') {
                      handleMarkAsRead(message.id)
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium">{message.name}</div>
                        <Badge className={getPriorityColor(message.priority)}>
                          {message.priority === 'high' ? 'عالية' : 
                           message.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </Badge>
                        {message.status === 'unread' && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {message.subject}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {message.message}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {message.date} {message.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Badge className={getStatusColor(message.status)}>
                        {message.status === 'unread' ? 'جديدة' :
                         message.status === 'read' ? 'مقروءة' : 'تم الرد'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد رسائل مطابقة لبحثك</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الرسالة</CardTitle>
            <CardDescription>
              {selectedMessage ? 'عرض تفاصيل الرسالة المحددة' : 'اختر رسالة لعرض تفاصيلها'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                {/* Message Info */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{selectedMessage.name}</div>
                      <div className="text-sm text-gray-500">{selectedMessage.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(selectedMessage.priority)}>
                        {selectedMessage.priority === 'high' ? 'عالية' : 
                         selectedMessage.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                      </Badge>
                      <Badge className={getStatusColor(selectedMessage.status)}>
                        {selectedMessage.status === 'unread' ? 'جديدة' :
                         selectedMessage.status === 'read' ? 'مقروءة' : 'تم الرد'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="font-medium text-lg mb-2">{selectedMessage.subject}</div>
                    <p className="text-gray-700">{selectedMessage.message}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {selectedMessage.date} {selectedMessage.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedMessage.phone}
                    </div>
                  </div>
                </div>

                {/* Reply Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">الرد على الرسالة</h3>
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="mb-3"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={handleReply} disabled={!replyText.trim()}>
                      <Send className="w-4 h-4 ml-2" />
                      إرسال الرد
                    </Button>
                    <Button variant="outline" onClick={() => setReplyText("")}>
                      مسح
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    disabled={selectedMessage.status === 'read'}
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    تحديد كمقروءة
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsReplied(selectedMessage.id)}
                    disabled={selectedMessage.status === 'replied'}
                  >
                    <Reply className="w-4 h-4 ml-2" />
                    تحديد كرد
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteModal(selectedMessage.id, selectedMessage.subject)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">اختر رسالة لعرض تفاصيلها</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteMessage}
        title="حذف الرسالة"
        description="هل أنت متأكد من حذف هذه الرسالة؟ سيتم حذفها نهائياً من النظام."
        itemName={deleteModal.messageSubject}
        isLoading={isDeleting}
      />
    </div>
  )
}
