import { Metadata } from 'next'
import { sheikhAPI } from '@/lib/api'
import { PageProps } from '@/lib/types'

interface LayoutProps extends PageProps {
  children: React.ReactNode
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const sheikh = await sheikhAPI.getBySlug(slug)
    
    if (!sheikh) {
      return {
        title: 'المأذون غير موجود - مأذون',
        description: 'المأذون الذي تبحث عنه غير موجود',
      }
    }

    return {
      title: `${sheikh.name} - مأذون شرعي في ${sheikh.city}`,
      description: `${sheikh.name} - مأذون شرعي معتمد في ${sheikh.city}. ${sheikh.bio}`,
      openGraph: {
        title: `${sheikh.name} - مأذون شرعي`,
        description: `مأذون شرعي معتمد في ${sheikh.city}`,
        type: 'profile',
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'المأذون غير موجود - مأذون',
      description: 'المأذون الذي تبحث عنه غير موجود',
    }
  }
}

export default function SheikhSlugLayout({ children }: LayoutProps) {
  return children
}
