import { Metadata } from 'next'
import { cityAPI } from '@/lib/api'
import { PageProps } from '@/lib/types'

interface LayoutProps extends PageProps {
  children: React.ReactNode
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const city = await cityAPI.getBySlug(slug)
    
    if (!city) {
      return {
        title: 'المدينة غير موجودة - مأذون',
        description: 'المدينة التي تبحث عنها غير موجودة',
      }
    }

    return {
      title: `${city.name} - مأذون شرعي`,
      description: `ابحث عن مأذون شرعي معتمد في ${city.name}، ${city.region}. ${city.description}`,
      openGraph: {
        title: `${city.name} - مأذون شرعي`,
        description: `ابحث عن مأذون شرعي معتمد في ${city.name}`,
        type: 'website',
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'المدينة غير موجودة - مأذون',
      description: 'المدينة التي تبحث عنها غير موجودة',
    }
  }
}

export default function CitySlugLayout({ children }: LayoutProps) {
  return children
}
