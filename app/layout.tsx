import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import localFont from "next/font/local"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "مأذوني - مأذون شرعي في كل مدن المملكة العربية السعودية",
  description: "الموقع الأول والمتخصص في جميع خدمات توثيق عقود الزواج في المملكة العربية السعودية",
  keywords: "مأذون شرعي, مأذون شرعي مكة, مأذون شرعي الرياض, مأذون شرعي جدة, توثيق عقود الزواج, مأذوني الأنكحة",
  authors: [{ name: "مأذوني" }],
  openGraph: {
    title: "مأذوني - مأذون شرعي في كل مدن المملكة العربية السعودية",
    description: "الموقع الأول والمتخصص في جميع خدمات توثيق عقود الزواج",
    locale: "ar_SA",
    type: "website",
  },
}

const theYearOfHandicrafts = localFont({
  src: "./fonts/TheYearofHandicrafts-Regular.otf",
  display: "swap",
  variable: "--font-arabic",
})

const theYearOfHandicraftsSerif = localFont({
  src: "./fonts/TheYearofHandicrafts-Regular.otf",
  display: "swap",
  variable: "--font-arabic-serif",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="rtl">
      <body
        className={`font-sans arabic-text ${GeistSans.variable} ${GeistMono.variable} ${theYearOfHandicrafts.variable} ${theYearOfHandicraftsSerif.variable}`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
