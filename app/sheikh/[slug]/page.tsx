import SheikhProfileClient from "./SheikhProfileClient"
import { sheikhAPI } from "@/lib/api"
import { notFound } from "next/navigation"
import { PageProps } from "@/lib/types"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SheikhPage({ params }: PageProps) {
  const { slug } = await params
  
  try {
    // Check if sheikh exists
    const sheikh = await sheikhAPI.getBySlug(slug)
    if (!sheikh) {
      notFound()
    }
    
    return <SheikhProfileClient params={{ slug }} />
  } catch (error) {
    console.error('Error loading sheikh page:', error)
    throw error // This will trigger the error boundary
  }
}
