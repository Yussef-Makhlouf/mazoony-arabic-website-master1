"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  Plus, 
  Pencil, 
  Trash2, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  KeyRound,
  Search,
  Filter
} from "lucide-react"

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'editor'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  profile: {
    department?: string
    phone?: string
  }
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Form states
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as 'admin' | 'manager' | 'editor',
    department: ""
  })
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "editor" as 'admin' | 'manager' | 'editor',
    department: "",
    isActive: true
  })
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
      } else {
        setError(data.error || 'حدث خطأ في جلب المستخدمين')
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('تم إنشاء المستخدم بنجاح')
        setIsCreateModalOpen(false)
        setCreateFormData({
          name: "",
          email: "",
          password: "",
          role: "editor",
          department: ""
        })
        loadUsers()
      } else {
        setError(data.error || 'حدث خطأ في إنشاء المستخدم')
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editFormData,
          profile: {
            department: editFormData.department
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('تم تحديث المستخدم بنجاح')
        setIsEditModalOpen(false)
        setSelectedUser(null)
        loadUsers()
      } else {
        setError(data.error || 'حدث خطأ في تحديث المستخدم')
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين')
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: resetPasswordData.newPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('تم إعادة تعيين كلمة المرور بنجاح')
        setIsResetPasswordModalOpen(false)
        setSelectedUser(null)
        setResetPasswordData({ newPassword: "", confirmPassword: "" })
      } else {
        setError(data.error || 'حدث خطأ في إعادة تعيين كلمة المرور')
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟`)) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('تم حذف المستخدم بنجاح')
        loadUsers()
      } else {
        setError(data.error || 'حدث خطأ في حذف المستخدم')
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة')
    } finally {
      setIsLoading(false)
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.profile.department || "",
      isActive: user.isActive
    })
    setIsEditModalOpen(true)
  }

  const openResetPasswordModal = (user: User) => {
    setSelectedUser(user)
    setResetPasswordData({ newPassword: "", confirmPassword: "" })
    setIsResetPasswordModalOpen(true)
  }

  const getRoleBadge = (role: string) => {
    const roleMap = {
      admin: { label: 'مدير', variant: 'destructive' as const },
      manager: { label: 'مدير محتوى', variant: 'default' as const },
      editor: { label: 'محرر', variant: 'secondary' as const }
    }
    const roleInfo = roleMap[role as keyof typeof roleMap] || { label: role, variant: 'secondary' as const }
    return <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'نشط' : 'غير نشط'}
      </Badge>
    )
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  if (isLoading && users.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 rtl arabic-text">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold arabic-heading">إدارة المستخدمين</h1>
          <p className="text-admin-text-muted mt-2">إدارة حسابات المستخدمين وصلاحياتهم</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة مستخدم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="rtl arabic-text">
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
              <DialogDescription>
                إنشاء حساب مستخدم جديد مع تحديد الصلاحيات
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">الاسم</Label>
                <Input
                  id="create-name"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">البريد الإلكتروني</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">كلمة المرور</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">الدور</Label>
                <Select 
                  value={createFormData.role} 
                  onValueChange={(value: 'admin' | 'manager' | 'editor') => 
                    setCreateFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">محرر</SelectItem>
                    <SelectItem value="manager">مدير محتوى</SelectItem>
                    <SelectItem value="admin">مدير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-department">القسم</Label>
                <Input
                  id="create-department"
                  value={createFormData.department}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء المستخدم'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted w-4 h-4" />
                <Input
                  id="search"
                  placeholder="البحث بالاسم أو البريد الإلكتروني"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-filter">الدور</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأدوار</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="manager">مدير محتوى</SelectItem>
                  <SelectItem value="editor">محرر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status-filter">الحالة</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستخدمين</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            قائمة المستخدمين ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>آخر دخول</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{user.profile.department || '-'}</TableCell>
                    <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                    <TableCell>
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleString('ar-SA')
                        : 'لم يسجل دخول بعد'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openResetPasswordModal(user)}
                        >
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-admin-text-muted">
              لا توجد نتائج مطابقة لبحثك
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="rtl arabic-text">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>
              تعديل بيانات المستخدم: {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">الاسم</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">البريد الإلكتروني</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">الدور</Label>
              <Select 
                value={editFormData.role} 
                onValueChange={(value: 'admin' | 'manager' | 'editor') => 
                  setEditFormData(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">محرر</SelectItem>
                  <SelectItem value="manager">مدير محتوى</SelectItem>
                  <SelectItem value="admin">مدير</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">القسم</Label>
              <Input
                id="edit-department"
                value={editFormData.department}
                onChange={(e) => setEditFormData(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">الحالة</Label>
              <Select 
                value={editFormData.isActive ? 'active' : 'inactive'} 
                onValueChange={(value) => 
                  setEditFormData(prev => ({ ...prev, isActive: value === 'active' }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'جاري التحديث...' : 'تحديث المستخدم'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={isResetPasswordModalOpen} onOpenChange={setIsResetPasswordModalOpen}>
        <DialogContent className="rtl arabic-text">
          <DialogHeader>
            <DialogTitle>إعادة تعيين كلمة المرور</DialogTitle>
            <DialogDescription>
              إعادة تعيين كلمة المرور للمستخدم: {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password">كلمة المرور الجديدة</Label>
              <Input
                id="reset-password"
                type="password"
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-confirm-password">تأكيد كلمة المرور</Label>
              <Input
                id="reset-confirm-password"
                type="password"
                value={resetPasswordData.confirmPassword}
                onChange={(e) => setResetPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'جاري التحديث...' : 'إعادة تعيين كلمة المرور'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
