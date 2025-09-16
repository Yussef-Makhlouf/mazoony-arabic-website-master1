import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { sheikhsAPI, citiesAPI } from "@/lib/api"
import { SheikhsClient } from "./sheikhs-client"

// Get data from APIs
async function getSheikhsPageData() {
  try {
    const [allSheikhs, cities] = await Promise.all([
      sheikhsAPI.getAll(),
      citiesAPI.getAll()
    ])
    
    // Ensure data is always an array to prevent filter errors
    const safeSheikhs = Array.isArray(allSheikhs) ? allSheikhs : []
    const safeCities = Array.isArray(cities) ? cities : []
    
    // Filter active sheikhs and cities
    const activeSheikhs = safeSheikhs.filter(sheikh => sheikh.isActive !== false)
    const activeCities = safeCities.filter(city => city.isActive !== false && (city.featured || city.count > 0))
    
    return { allSheikhs: activeSheikhs, cities: activeCities }
  } catch (error) {
    console.error('Error fetching sheikhs page data:', error)
    // Return empty arrays - no static data
    return { allSheikhs: [], cities: [] }
  }
}

export default async function SheikhsPage() {
  const { allSheikhs, cities } = await getSheikhsPageData()
  
  return (
    <div 
      className="min-h-screen bg-background rtl relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/decor2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
      <div className="relative z-10">
        <NavBar />
        <SheikhsClient initialSheikhs={allSheikhs} cities={cities} />
        <Footer />
      </div>
    </div>
  )
}