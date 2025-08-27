import CityClientPage from "./CityClientPage"
import { cityAPI } from "@/lib/api"
import { notFound } from "next/navigation"
import { PageProps } from "@/lib/types"

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params
  
  try {
    // Check if city exists
    const city = await cityAPI.getBySlug(slug)
    if (!city) {
      notFound()
    }
    
    return <CityClientPage params={{ slug }} />
  } catch (error) {
    console.error('Error loading city page:', error)
    throw error // This will trigger the error boundary
  }
}

// Generate static params for all cities
export async function generateStaticParams() {
  try {
    const cities = await cityAPI.getAll()
    return cities.map((city) => ({
      slug: city.slug,
    }))
  } catch (error) {
    console.error("Error generating static params for cities:", error)
    return []
  }
}
