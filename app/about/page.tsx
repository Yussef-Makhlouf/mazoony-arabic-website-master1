import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Star, 
  Shield, 
  Award, 
  MapPin, 
  Phone, 
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Heart,
  Target,
  Eye
} from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"



const values = [
  {
    icon: Shield,
    title: "الثقة والموثوقية",
    description: "نضمن لك التعامل مع مأذونين معتمدين ومرخصين رسمياً من الجهات المختصة",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Heart,
    title: "الاهتمام بالعميل",
    description: "نضع راحة العميل في المقام الأول ونوفر له أفضل الخدمات",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Target,
    title: "الدقة والاحترافية",
    description: "نحرص على تقديم خدمات عالية الجودة بأعلى معايير الاحترافية",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Eye,
    title: "الشفافية",
    description: "نوفر معلومات شفافة وواضحة عن جميع المأذونين وخدماتهم",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]



export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background rtl">
      <NavBar />
      
      {/* Header Section */}
      <header className="relative overflow-hidden bg-card border-b border-border">
        <div className="absolute inset-0 islamic-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold arabic-heading text-primary mb-4">
              من نحن
            </h1>
            <p className="text-xl arabic-text text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              تعرف على قصة مأذوني وكيف نعمل على تسهيل عملية توثيق عقود الزواج في المملكة العربية السعودية
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold arabic-heading text-foreground mb-6">
                مهمتنا ورؤيتنا
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold arabic-heading text-primary mb-3">مهمتنا</h3>
                  <p className="arabic-text text-muted-foreground leading-relaxed">
                    تسهيل عملية توثيق عقود الزواج في المملكة العربية السعودية من خلال توفير منصة موثوقة تربط العملاء بأفضل المأذونين الشرعيين المعتمدين، مع ضمان أعلى معايير الجودة والاحترافية.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold arabic-heading text-primary mb-3">رؤيتنا</h3>
                  <p className="arabic-text text-muted-foreground leading-relaxed">
                    أن نكون المنصة الأولى والأكثر موثوقية في مجال خدمات المأذونين الشرعيين في المملكة العربية السعودية، ونكون الشريك الموثوق للعائلات في أهم لحظات حياتهم.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold arabic-heading text-primary mb-3">قيمنا</h3>
                  <p className="arabic-text text-muted-foreground leading-relaxed">
                    نؤمن بالثقة والموثوقية، والاهتمام بالعميل، والدقة والاحترافية، والشفافية في جميع تعاملاتنا.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold arabic-heading text-foreground mb-4">
                      لماذا مأذوني؟
                    </h3>
                    <div className="space-y-4 text-right">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="arabic-text text-muted-foreground">مأذونين معتمدين ومرخصين رسمياً</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="arabic-text text-muted-foreground">تقييمات موثوقة من العملاء</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="arabic-text text-muted-foreground">خدمة عملاء متاحة 24/7</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="arabic-text text-muted-foreground">أسعار شفافة ومنافسة</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="arabic-text text-muted-foreground">تغطية شاملة لجميع المدن</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold arabic-heading text-foreground mb-4">
              قيمنا الأساسية
            </h2>
            <p className="text-lg arabic-text text-muted-foreground">
              المبادئ التي نؤمن بها ونعمل بها
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center hover-lift shadow-islamic border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-center mb-6">
                      <div className={`p-4 ${value.bgColor} rounded-full`}>
                        <Icon className={`h-10 w-10 ${value.color}`} />
                      </div>
                    </div>
                    <CardTitle className="arabic-heading text-foreground text-xl mb-4">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="arabic-text text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="relative overflow-hidden shadow-islamic border-0">
            <div className="absolute inset-0 gradient-islamic opacity-5"></div>
            <div className="absolute inset-0 islamic-pattern opacity-10"></div>
            <CardHeader className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl arabic-heading text-foreground mb-4">
                تواصل معنا
              </CardTitle>
              <CardDescription className="text-xl arabic-text text-muted-foreground max-w-2xl mx-auto">
                نحن هنا لمساعدتك في جميع استفساراتك وطلباتك
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 arabic-text shadow-islamic group" asChild>
                  <Link href="/contact">
                    <Phone className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    تواصل معنا الآن
                    <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 arabic-text bg-transparent group" asChild>
                  <a href="/api/settings" data-dynamic-wa target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    واتساب مباشر
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
