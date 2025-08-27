import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

// Types
export interface City {
  _id?: string;
  name: string;
  slug: string;
  count: number;
  region: string;
  population: string;
  description: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sheikh {
  _id?: string;
  name: string;
  slug: string;
  cityId: string;
  city: string;
  citySlug: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  experience: string;
  availability: "متاح" | "مشغول" | "غير متاح";
  bio: string;
  education: string;
  languages: string[];
  ratings: {
    commitment: number;
    ease: number;
    knowledge: number;
    price: number;
  };
  verified: boolean;
  isActive: boolean;
  price: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  _id?: string;
  sheikhId: string;
  name: string;
  phone: string;
  email?: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  isVerified: boolean;
  reported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  sheikhId?: string;
  status: "new" | "read" | "replied" | "closed";
  priority: "low" | "medium" | "high";
  type: "general" | "inquiry" | "complaint" | "suggestion";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Site Settings
export interface SiteSettings {
  key: 'site';
  contactPhone: string;
  whatsappNumber: string; // in international format without + for wa.me
  contactEmail?: string;
  updatedAt: Date;
}

export class SettingsService {
  static async getSettings(): Promise<SiteSettings> {
    const db = await getDatabase();
    
    // Try to get the site settings document
    let doc = await db.collection('settings').findOne({ key: 'site' });
    
    if (!doc) {
      // If no site settings document exists, create one with defaults
      const defaults: SiteSettings = {
        key: 'site',
        contactPhone: '+966501234567',
        whatsappNumber: '966501234567',
        contactEmail: 'info@mazoony.com',
        updatedAt: new Date(),
      };
      await db.collection('settings').insertOne(defaults as any);
      doc = defaults as any;
    }
    
    return doc as unknown as SiteSettings;
  }

  static async updateSettings(update: Partial<SiteSettings>): Promise<SiteSettings> {
    const db = await getDatabase();
    const updatedAt = new Date();
    
    // Prepare the update data
    const updateData = {
      ...update,
      key: 'site',
      updatedAt
    };
    
    try {
      const result = await db.collection('settings').findOneAndUpdate(
        { key: 'site' },
        { $set: updateData },
        { upsert: true, returnDocument: 'after' as any }
      );
      
      const value = (result as any)?.value;
      return (value || updateData) as SiteSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
}

export interface SheikhRequest {
  _id?: string;
  sheikhId: string;
  fullName: string;
  phone: string;
  email?: string;
  serviceType: "marriage" | "divorce" | "other";
  preferredDate: string;
  preferredTime: string;
  additionalNotes?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

// City Services
export class CityService {
  static async getAllCities(): Promise<City[]> {
    const db = await getDatabase();
    const cities = await db.collection('cities')
      .find({ isActive: true })
      .sort({ name: 1 })
      .toArray();
    return cities as unknown as City[];
  }

  static async getCityBySlug(slug: string): Promise<City | null> {
    const db = await getDatabase();
    const city = await db.collection('cities').findOne({ slug, isActive: true });
    return city as City | null;
  }

  static async getCityById(id: string): Promise<City | null> {
    const db = await getDatabase();
    const city = await db.collection('cities').findOne({ _id: new ObjectId(id), isActive: true });
    return city as City | null;
  }

  static async getFeaturedCities(): Promise<City[]> {
    const db = await getDatabase();
    const cities = await db.collection('cities')
      .find({ featured: true, isActive: true })
      .sort({ name: 1 })
      .toArray();
    return cities as unknown as City[];
  }

  static async createCity(cityData: Omit<City, '_id' | 'createdAt' | 'updatedAt'>): Promise<City> {
    const db = await getDatabase();
    
    // Check if slug already exists
    const existingCity = await db.collection('cities').findOne({ slug: cityData.slug });
    if (existingCity) {
      throw new Error('City with this slug already exists');
    }

    const city: Omit<City, '_id'> = {
      ...cityData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('cities').insertOne(city as any);
    return { ...city, _id: result.insertedId.toString() };
  }

  static async updateCity(id: string, updateData: Partial<City>): Promise<City | null> {
    const db = await getDatabase();
    
    const updateDoc = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await db.collection('cities').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    return result as unknown as City | null;
  }

  static async deleteCity(id: string): Promise<boolean> {
    const db = await getDatabase();
    
    // Soft delete - just mark as inactive
    const result = await db.collection('cities').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  static async searchCities(query: string, limit?: number): Promise<City[]> {
    const db = await getDatabase();
    let cursor = db.collection('cities')
      .find({
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { region: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
      .sort({ name: 1 });
    
    if (limit) {
      cursor = cursor.limit(limit);
    }
    
    const cities = await cursor.toArray();
    return cities as unknown as City[];
  }

  static async getRegions(): Promise<{ name: string; cities: City[] }[]> {
    const cities = await this.getAllCities();
    const regions = cities.reduce((acc, city) => {
      if (!acc[city.region]) {
        acc[city.region] = [];
      }
      acc[city.region].push(city);
      return acc;
    }, {} as Record<string, City[]>);

    return Object.entries(regions).map(([name, cities]) => ({
      name,
      cities
    }));
  }

  // New method to update city counts with actual sheikh counts
  static async updateCityCounts(): Promise<void> {
    const db = await getDatabase();
    
    // Get all cities
    const cities = await this.getAllCities();
    
    for (const city of cities) {
      // Count actual sheikhs for this city
      const sheikhCount = await db.collection('sheikhs').countDocuments({
        citySlug: city.slug,
        isActive: true
      });
      
      // Update city count if different
      if (sheikhCount !== city.count && city._id) {
        try {
          // Handle both string and ObjectId types
          const filter = typeof city._id === 'string' && city._id.length === 24 
            ? { _id: new ObjectId(city._id) }
            : { _id: city._id };
            
          await db.collection('cities').updateOne(
            filter as any,
            { $set: { count: sheikhCount, updatedAt: new Date() } }
          );
          
          console.log(`Updated ${city.name}: ${city.count} → ${sheikhCount}`);
        } catch (error) {
          console.error(`Error updating city ${city.name}:`, error);
        }
      }
    }
  }

  // New method to get cities with actual sheikh counts
  static async getCitiesWithActualCounts(): Promise<City[]> {
    const db = await getDatabase();
    
    // Get all cities
    const cities = await this.getAllCities();
    
    // Update counts for each city
    const citiesWithActualCounts = await Promise.all(
      cities.map(async (city) => {
        const sheikhCount = await db.collection('sheikhs').countDocuments({
          citySlug: city.slug,
          isActive: true
        });
        
        return {
          ...city,
          count: sheikhCount
        };
      })
    );
    
    return citiesWithActualCounts;
  }

  // New method to get featured cities with actual counts
  static async getFeaturedCitiesWithActualCounts(): Promise<City[]> {
    const db = await getDatabase();
    
    // Get featured cities
    const cities = await this.getFeaturedCities();
    
    // Update counts for each city
    const citiesWithActualCounts = await Promise.all(
      cities.map(async (city) => {
        const sheikhCount = await db.collection('sheikhs').countDocuments({
          citySlug: city.slug,
          isActive: true
        });
        
        return {
          ...city,
          count: sheikhCount
        };
      })
    );
    
    return citiesWithActualCounts;
  }
}

// Sheikh Services
export class SheikhService {
  static async getAllSheikhs(): Promise<Sheikh[]> {
    const db = await getDatabase();
    const sheikhs = await db.collection('sheikhs')
      .find({ isActive: true })
      .sort({ rating: -1, name: 1 })
      .toArray();
    return sheikhs as unknown as Sheikh[];
  }

  static async getSheikhBySlug(slug: string): Promise<Sheikh | null> {
    const db = await getDatabase();
    const sheikh = await db.collection('sheikhs').findOne({ slug, isActive: true });
    return sheikh as unknown as Sheikh | null;
  }

  static async getSheikhById(id: string): Promise<Sheikh | null> {
    const db = await getDatabase();
    const sheikh = await db.collection('sheikhs').findOne({ _id: new ObjectId(id), isActive: true });
    return sheikh as unknown as Sheikh | null;
  }

  static async getSheikhsByCity(citySlug: string): Promise<Sheikh[]> {
    const db = await getDatabase();
    const sheikhs = await db.collection('sheikhs')
      .find({ citySlug, isActive: true })
      .sort({ rating: -1, name: 1 })
      .toArray();
    return sheikhs as unknown as Sheikh[];
  }

  static async getSheikhsByCityId(cityId: string): Promise<Sheikh[]> {
    const db = await getDatabase();
    const sheikhs = await db.collection('sheikhs')
      .find({ cityId, isActive: true })
      .sort({ rating: -1, name: 1 })
      .toArray();
    return sheikhs as unknown as Sheikh[];
  }

  static async searchSheikhs(query: string, limit?: number): Promise<Sheikh[]> {
    const db = await getDatabase();
    let cursor = db.collection('sheikhs')
      .find({
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { city: { $regex: query, $options: 'i' } },
          { specialties: { $in: [new RegExp(query, 'i')] } }
        ]
      })
      .sort({ rating: -1, name: 1 });
    
    if (limit) {
      cursor = cursor.limit(limit);
    }
    
    const sheikhs = await cursor.toArray();
    return sheikhs as unknown as Sheikh[];
  }

  static async createSheikh(sheikhData: Omit<Sheikh, '_id' | 'createdAt' | 'updatedAt'>): Promise<Sheikh> {
    const db = await getDatabase();
    
    // Check if slug already exists
    const existingSheikh = await db.collection('sheikhs').findOne({ slug: sheikhData.slug });
    if (existingSheikh) {
      throw new Error('Sheikh with this slug already exists');
    }

    const sheikh: Omit<Sheikh, '_id'> = {
      ...sheikhData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('sheikhs').insertOne(sheikh as any);
    return { ...sheikh, _id: result.insertedId.toString() };
  }

  static async updateSheikh(id: string, updateData: Partial<Sheikh>): Promise<Sheikh | null> {
    const db = await getDatabase();
    
    const updateDoc = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await db.collection('sheikhs').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    return result as unknown as Sheikh | null;
  }

  static async deleteSheikh(id: string): Promise<boolean> {
    const db = await getDatabase();
    
    // Soft delete - just mark as inactive
    const result = await db.collection('sheikhs').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isActive: false, updatedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  static async updateSheikhRating(id: string, newRating: number): Promise<boolean> {
    const db = await getDatabase();
    
    // Get current sheikh data
    const sheikh = await this.getSheikhById(id);
    if (!sheikh) return false;

    // Calculate new average rating
    const totalRating = sheikh.rating * sheikh.reviewCount + newRating;
    const newReviewCount = sheikh.reviewCount + 1;
    const newAverageRating = totalRating / newReviewCount;

    const result = await db.collection('sheikhs').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          rating: newAverageRating, 
          reviewCount: newReviewCount,
          updatedAt: new Date() 
        } 
      }
    );

    return result.modifiedCount > 0;
  }
}

// Review Services
export class ReviewService {
  private static async enrichReviewsWithSheikh(db: any, reviews: any[]) {
    return Promise.all(
      reviews.map(async (review) => {
        try {
          const id = String(review.sheikhId || '')
          const isObjectId = /^[a-f\d]{24}$/i.test(id)
          let sheikh: any = null
          if (isObjectId) {
            sheikh = await db.collection('sheikhs').findOne({ _id: new ObjectId(id) })
          }
          if (!sheikh) {
            sheikh = await db.collection('sheikhs').findOne({ slug: id })
          }
          return {
            ...review,
            sheikhName: sheikh?.name || 'غير محدد',
            sheikhSlug: sheikh?.slug || '',
            sheikhImage: sheikh?.image || ''
          }
        } catch (error) {
          console.warn(`Failed to fetch sheikh for review ${review._id}:`, error)
          return {
            ...review,
            sheikhName: 'غير محدد',
            sheikhSlug: '',
            sheikhImage: ''
          }
        }
      })
    )
  }
  static async getReviewsBySheikh(sheikhId: string): Promise<Review[]> {
    const db = await getDatabase();
    const reviews = await db.collection('reviews')
      .find({ sheikhId, status: 'approved' })
      .sort({ createdAt: -1 })
      .toArray();
    return reviews as unknown as Review[];
  }

  static async createReview(reviewData: Omit<Review, '_id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const db = await getDatabase();
    
    const review: Omit<Review, '_id'> = {
      ...reviewData,
      status: 'pending',
      isVerified: false,
      reported: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('reviews').insertOne(review as any);
    
    // Try to update sheikh rating, but don't fail if sheikh doesn't exist
    try {
      await SheikhService.updateSheikhRating(reviewData.sheikhId, reviewData.rating);
    } catch (error) {
      console.warn(`Failed to update sheikh rating for ${reviewData.sheikhId}:`, error);
      // Don't throw error, just log it
    }
    
    return { ...review, _id: result.insertedId.toString() };
  }

  static async updateReviewStatus(id: string, status: Review['status']): Promise<boolean> {
    const db = await getDatabase();
    
    const result = await db.collection('reviews').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  static async getPendingReviews(): Promise<Review[]> {
    const db = await getDatabase();
    const reviews = await db.collection('reviews')
      .find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .toArray();
    const withSheikh = await this.enrichReviewsWithSheikh(db, reviews)
    return withSheikh as unknown as Review[];
  }

  static async getAllReviews(): Promise<Review[]> {
    const db = await getDatabase();
    const reviews = await db.collection('reviews')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    const withSheikh = await this.enrichReviewsWithSheikh(db, reviews)
    return withSheikh as unknown as Review[];
  }

  static async getReviewsByStatus(status: Review['status']): Promise<Review[]> {
    const db = await getDatabase();
    const reviews = await db.collection('reviews')
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();
    const withSheikh = await this.enrichReviewsWithSheikh(db, reviews)
    return withSheikh as unknown as Review[];
  }

  static async updateReview(id: string, updateData: Partial<Review>): Promise<Review | null> {
    const db = await getDatabase();
    
    const result = await db.collection('reviews').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result as Review | null;
  }

  static async deleteReview(id: string): Promise<boolean> {
    const db = await getDatabase();
    
    const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async getReviewById(id: string): Promise<Review | null> {
    const db = await getDatabase();
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(id) });
    return review as Review | null;
  }
}

// Message Services
export class MessageService {
  static async getAllMessages(): Promise<Message[]> {
    const db = await getDatabase();
    const messages = await db.collection('messages')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return messages as unknown as Message[];
  }

  static async getMessagesByStatus(status: Message['status']): Promise<Message[]> {
    const db = await getDatabase();
    const messages = await db.collection('messages')
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();
    return messages as unknown as Message[];
  }

  static async createMessage(messageData: Omit<Message, '_id' | 'createdAt' | 'updatedAt'>): Promise<Message> {
    const db = await getDatabase();
    
    const message: Omit<Message, '_id'> = {
      ...messageData,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('messages').insertOne(message as any);
    return { ...message, _id: result.insertedId.toString() };
  }

  static async updateMessageStatus(id: string, status: Message['status']): Promise<boolean> {
    const db = await getDatabase();
    
    const result = await db.collection('messages').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  static async deleteMessage(id: string): Promise<boolean> {
    const db = await getDatabase();
    
    const result = await db.collection('messages').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async updateMessage(id: string, updateData: Partial<Message>): Promise<Message | null> {
    const db = await getDatabase();
    
    const result = await db.collection('messages').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result as Message | null;
  }

  static async getMessageById(id: string): Promise<Message | null> {
    const db = await getDatabase();
    const message = await db.collection('messages').findOne({ _id: new ObjectId(id) });
    return message as Message | null;
  }
}

// Sheikh Request Services
export class SheikhRequestService {
  static async getAllRequests(): Promise<SheikhRequest[]> {
    const db = await getDatabase();
    const requests = await db.collection('sheikhRequests')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return requests as unknown as SheikhRequest[];
  }

  static async getRequestsBySheikh(sheikhId: string): Promise<SheikhRequest[]> {
    const db = await getDatabase();
    const requests = await db.collection('sheikhRequests')
      .find({ sheikhId })
      .sort({ createdAt: -1 })
      .toArray();
    return requests as unknown as SheikhRequest[];
  }

  static async getRequestsByStatus(status: SheikhRequest['status']): Promise<SheikhRequest[]> {
    const db = await getDatabase();
    const requests = await db.collection('sheikhRequests')
      .find({ status })
      .sort({ createdAt: -1 })
      .toArray();
    return requests as unknown as SheikhRequest[];
  }

  static async createRequest(requestData: Omit<SheikhRequest, '_id' | 'createdAt' | 'updatedAt'>): Promise<SheikhRequest> {
    const db = await getDatabase();
    
    const request: Omit<SheikhRequest, '_id'> = {
      ...requestData,
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('sheikhRequests').insertOne(request as any);
    return { ...request, _id: result.insertedId.toString() };
  }

  static async updateRequest(id: string, updateData: Partial<SheikhRequest>): Promise<SheikhRequest | null> {
    const db = await getDatabase();
    
    const result = await db.collection('sheikhRequests').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result as SheikhRequest | null;
  }

  static async deleteRequest(id: string): Promise<boolean> {
    const db = await getDatabase();
    
    const result = await db.collection('sheikhRequests').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async getRequestById(id: string): Promise<SheikhRequest | null> {
    const db = await getDatabase();
    const request = await db.collection('sheikhRequests').findOne({ _id: new ObjectId(id) });
    return request as SheikhRequest | null;
  }
}

// Statistics Services
export class StatisticsService {
  static async getDashboardStats() {
    const db = await getDatabase();
    
    const [
      totalCities,
      totalSheikhs,
      totalReviews,
      totalMessages,
      newMessages,
      pendingReviews
    ] = await Promise.all([
      db.collection('cities').countDocuments({ isActive: true }),
      db.collection('sheikhs').countDocuments({ isActive: true }),
      db.collection('reviews').countDocuments({ status: 'approved' }),
      db.collection('messages').countDocuments({}),
      db.collection('messages').countDocuments({ status: 'new' }),
      db.collection('reviews').countDocuments({ status: 'pending' })
    ]);

    return {
      totalCities,
      totalSheikhs,
      totalReviews,
      totalMessages,
      newMessages,
      pendingReviews
    };
  }

  static async getSheikhStats() {
    const db = await getDatabase();
    
    const stats = await db.collection('sheikhs').aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalSheikhs: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: '$reviewCount' },
          verifiedCount: { $sum: { $cond: ['$verified', 1, 0] } },
          availableCount: { $sum: { $cond: [{ $eq: ['$availability', 'متاح'] }, 1, 0] } }
        }
      }
    ]).toArray();

    return stats[0] || {
      totalSheikhs: 0,
      avgRating: 0,
      totalReviews: 0,
      verifiedCount: 0,
      availableCount: 0
    };
  }
}
