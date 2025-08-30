import { jwtVerify } from 'jose';

// JWT secret key
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'mazoony-super-secret-key-2024'
);

// Edge Runtime compatible functions only
export class AuthEdgeService {
  // Verify JWT token (Edge Runtime compatible)
  static async verifyToken(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Validate permissions
  static hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission) || userPermissions.includes('*');
  }
}
