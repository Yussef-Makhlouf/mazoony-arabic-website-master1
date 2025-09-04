/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'vercel.app', 'netlify.app', 'herokuapp.com', 'railway.app', 'render.com'],
  },
  // تحسينات للنشر
  poweredByHeader: false,
  compress: true,
  // إعدادات خاصة بـ Vercel
  serverExternalPackages: ['mongodb'],
  // إعدادات البيئة
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // تحسينات للأداء
  // إعدادات خاصة بـ Static Generation
  output: 'standalone',
  // إعادة كتابة المسارات للـ API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}

export default nextConfig
