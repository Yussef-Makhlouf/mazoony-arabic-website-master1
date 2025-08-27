import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'المدن - مأذون',
  description: 'تصفح المدن المتاحة للعثور على مأذون شرعي في منطقتك',
}

export default function CityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
