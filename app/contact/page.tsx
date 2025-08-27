"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Send,
  Clock,
  Users,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const contactMethods = [
  {
    icon: Phone,
    title: "اتصل بنا",
    description: "اتصل بنا مباشرة على الرقم التالي",
    value: "+966 50 123 4567",
    action: "اتصال الآن",
    href: "tel:+966501234567",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MessageCircle,
    title: "واتساب",
    description: "تواصل معنا عبر واتساب للحصول على رد سريع",
    value: "+966 50 123 4567",
    action: "فتح واتساب",
    href: "https://wa.me/966501234567",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    description: "أرسل لنا رسالة عبر البريد الإلكتروني",
    value: "info@mazoony.com",
    action: "إرسال بريد",
    href: "mailto:info@mazoony.com",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: MapPin,
    title: "العنوان",
    description: "موقعنا في المملكة العربية السعودية",
    value: "المملكة العربية السعودية",
    action: "عرض الخريطة",
    href: "#",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

const faqs = [
  {
    question: "كيف يمكنني العثور على مأذون في مدينتي؟",
    answer: "يمكنك البحث عن المأذونين حسب المدينة من خلال صفحة المدن أو استخدام محرك البحث في الصفحة الرئيسية."
  },
  {
    question: "هل جميع المأذونين معتمدين ومرخصين؟",
    answer: "نعم، جميع المأذونين في منصتنا معتمدين ومرخصين رسمياً من الجهات المختصة في المملكة."
  },
  {
    question: "كيف يمكنني تقييم المأذون بعد الخدمة؟",
    answer: "يمكنك تقييم المأذون من خلال صفحة الملف الشخصي الخاص به أو التواصل معنا مباشرة."
  },
  {
    question: "ما هي تكلفة خدمات التوثيق؟",
    answer: "تختلف التكلفة حسب المأذون والخدمات المطلوبة. يمكنك الاطلاع على الأسعار في صفحة كل مأذون."
  },
  {
    question: "هل تقدمون خدمات في جميع مدن المملكة؟",
    answer: "نعم، نغطي جميع المدن الرئيسية في المملكة العربية السعودية ونعمل على توسيع التغطية."
  },
  {
    question: "كيف يمكنني الانضمام كـ مأذون؟",
    answer: "يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف للتسجيل كـ مأذون في المنصة."
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background rtl">
      <NavBar />
      
      {/* Header Section */}
      <header className="relative overflow-hidden bg-card border-b border-border">
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold arabic-heading text-primary mb-4">
              تواصل معنا
            </h1>
            <p className="text-xl arabic-text text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              نحن هنا لمساعدتك في جميع استفساراتك وطلباتك. لا تتردد في التواصل معنا
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="arabic-heading text-foreground text-2xl mb-2">
                  أرسل لنا رسالة
                </CardTitle>
                <CardDescription className="arabic-text text-muted-foreground">
                  املأ النموذج التالي وسنرد عليك في أقرب وقت ممكن
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="arabic-text font-medium text-foreground">
                        الاسم الأول
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="أدخل اسمك الأول"
                        className="arabic-text bg-background border-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="arabic-text font-medium text-foreground">
                        اسم العائلة
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="أدخل اسم العائلة"
                        className="arabic-text bg-background border-primary/20 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="email" className="arabic-text font-medium text-foreground">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      className="arabic-text bg-background border-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="arabic-text font-medium text-foreground">
                      رقم الهاتف
                    </Label>
                    <Input
                      id="phone"
                      placeholder="05xxxxxxxx"
                      className="arabic-text bg-background border-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="subject" className="arabic-text font-medium text-foreground">
                      الموضوع
                    </Label>
                    <select
                      id="subject"
                      className="w-full p-3 border border-primary/20 rounded-lg bg-background arabic-text focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">اختر الموضوع</option>
                      <option value="general">استفسار عام</option>
                      <option value="sheikh">طلب مأذون</option>
                      <option value="registration">التسجيل كـ مأذون</option>
                      <option value="support">الدعم الفني</option>
                      <option value="complaint">شكوى</option>
                      <option value="suggestion">اقتراح</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="message" className="arabic-text font-medium text-foreground">
                      الرسالة
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="اكتب رسالتك هنا..."
                      rows={6}
                      className="arabic-text bg-background border-primary/20 focus:border-primary resize-none"
                      required
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full text-lg py-6 arabic-text shadow-islamic hover-lift">
                    <Send className="w-5 h-5 ml-2" />
                    إرسال الرسالة
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold arabic-heading text-foreground mb-6">
                طرق التواصل
              </h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <Card key={index} className="hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 ${method.bgColor} rounded-full`}>
                            <Icon className={`h-6 w-6 ${method.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold arabic-heading text-foreground mb-1">
                              {method.title}
                            </h3>
                            <p className="text-sm arabic-text text-muted-foreground mb-2">
                              {method.description}
                            </p>
                            <p className="font-medium arabic-text text-foreground">
                              {method.value}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="arabic-text bg-transparent" asChild>
                            <a href={method.href} target={method.href.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
                              {method.action}
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-lg arabic-text text-muted-foreground">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="arabic-heading text-foreground text-lg">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="arabic-text text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20">
          <Card className="relative overflow-hidden shadow-islamic border-0">
            <div className="absolute inset-0 gradient-islamic opacity-5"></div>
            <div className="absolute inset-0 islamic-pattern opacity-10"></div>
            <CardHeader className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl arabic-heading text-foreground mb-4">
                نحن هنا لمساعدتك
              </CardTitle>
              <CardDescription className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
                لا تتردد في التواصل معنا لأي استفسار أو طلب. فريقنا متاح دائماً لمساعدتك
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 arabic-text shadow-islamic group" asChild>
                  <a href="https://wa.me/966501234567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    واتساب مباشر
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 arabic-text bg-transparent group" asChild>
                  <a href="tel:+966501234567">
                    <Phone className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    اتصال فوري
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
