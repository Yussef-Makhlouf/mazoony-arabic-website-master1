import crypto from 'crypto';

// Node.js specific utilities that require crypto module
export class AuthUtils {
  // Generate reset token using Node.js crypto
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
