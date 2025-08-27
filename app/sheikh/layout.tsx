import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'المأذون - مأذون',
  description: 'تصفح المأذون الشرعيين المعتمدين في المملكة العربية السعودية',
}

export default function SheikhLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
