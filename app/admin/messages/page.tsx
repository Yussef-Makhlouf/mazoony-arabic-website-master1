"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { DeleteModal } from "@/components/ui/delete-modal"
import { messagesAPI, adminAPI } from "@/lib/api"
import { 
  MessageSquare, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Mail,
  Calendar,
  User,
  Phone,
  Loader2
} from "lucide-react"

export default function AdminMessages() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [replyText, setReplyText] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    messageId: "",
    messageSubject: ""
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyDialog, setReplyDialog] = useState(false)

  // جلب الرسائل من API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const allMessages = await messagesAPI.getAll()
        setMessages(allMessages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        toast.error("فشل في جلب الرسائل")
      }
    }
    
    fetchMessages()
  }, [])

  // Ensure messages is always an array before filtering
  const safeMessages = Array.isArray(messages) ? messages : []
  const filteredMessages = safeMessages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || message.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await adminAPI.messages.respond(messageId, { 
        status: "read",
        response: ""
      })
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, status: "read" } : msg
      ))
      toast.success("تم تحديد الرسالة كمقروءة")
    } catch (error) {
      console.error('Error marking message as read:', error)
      toast.error("حدث خطأ في تحديث حالة الرسالة")
    }
  }

  // تم إلغاء الردود من لوحة التحكم - القراءة فقط

  // تم إلغاء إغلاق الرسائل من لوحة التحكم

  const handleDelete = async () => {
    if (!deleteModal.messageId) return

    setIsDeleting(true)
    try {
      await adminAPI.deleteMessage(deleteModal.messageId)
      setMessages(prev => prev.filter(msg => msg._id !== deleteModal.messageId))
      toast.success("تم حذف الرسالة بنجاح")
      setDeleteModal({ isOpen: false, messageId: "", messageSubject: "" })
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error("حدث خطأ في حذف الرسالة")
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">جديد</Badge>
      case "read":
        return <Badge variant="secondary">مقروء</Badge>
      case "replied":
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 ml-1" />
          تم الرد
        </Badge>
      case "closed":
        return <Badge variant="destructive">مغلق</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSubjectText = (subject: string) => {
    const subjects: { [key: string]: string } = {
      general: "استفسار عام",
      sheikh: "طلب مأذون",
      registration: "التسجيل كـ مأذون",
      support: "الدعم الفني",
      complaint: "شكوى",
      suggestion: "اقتراح"
    }
    return subjects[subject] || subject
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold arabic-heading text-foreground">إدارة الرسائل</h1>
          <p className="arabic-text text-muted-foreground">إدارة رسائل التواصل من الزوار</p>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          <span className="arabic-text font-semibold text-foreground">{messages.length} رسالة</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الرسائل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 arabic-text"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border border-border rounded-lg bg-background arabic-text"
              >
                <option value="all">جميع الرسائل</option>
                <option value="new">جديد</option>
                <option value="read">مقروء</option>
                <option value="replied">تم الرد</option>
                <option value="closed">مغلق</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid gap-4">
        {filteredMessages.map((message) => (
          <Card key={message._id} className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="arabic-heading font-semibold text-foreground text-lg">{message.name}</h3>
                    {getStatusBadge(message.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{message.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{message.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(message.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="arabic-text">
                      {getSubjectText(message.subject)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(message._id)}
                    disabled={message.status !== "new"}
                  >
                    تحديد كمقروء
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteModal({
                      isOpen: true,
                      messageId: message._id,
                      messageSubject: message.subject
                    })}
                  >
                    <Trash2 className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="arabic-heading font-medium text-foreground mb-2">الرسالة:</h4>
                  <p className="arabic-text text-muted-foreground leading-relaxed">{message.message}</p>
                </div>
                {message.adminResponse && (
                  <div className="border-r-4 border-primary pr-4 bg-primary/5 p-4 rounded-lg">
                    <h4 className="arabic-heading font-medium text-foreground mb-2">الرد:</h4>
                    <p className="arabic-text text-muted-foreground leading-relaxed">{message.adminResponse}</p>
                    {message.respondedAt && (
                      <p className="arabic-text text-xs text-muted-foreground mt-2">
                        تم الرد في: {new Date(message.respondedAt).toLocaleDateString('ar-SA')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* تم إلغاء نافذة الرد - قراءة فقط */}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, messageId: "", messageSubject: "" })}
        onConfirm={handleDelete}
        title="حذف الرسالة"
        description={`هل أنت متأكد من حذف رسالة "${getSubjectText(deleteModal.messageSubject)}"؟`}
        isLoading={isDeleting}
      />
    </div>
  )
}
