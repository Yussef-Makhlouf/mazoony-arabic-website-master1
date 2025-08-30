import { AuthService } from '../lib/auth';
import { getDatabase } from '../lib/database';

async function testPasswordReset() {
  try {
    console.log('🔍 Testing Password Reset System...\n');

    // 1. Test user exists
    const testEmail = 'admin@mazoony.com';
    console.log(`1. Checking if user exists: ${testEmail}`);
    const user = await AuthService.getUserByEmail(testEmail);
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log(`✅ User found: ${user.name} (${user._id})`);
    console.log(`   _id type: ${typeof user._id}`);

    // 2. Test password reset request
    console.log('\n2. Testing password reset request...');
    const resetCode = await AuthService.requestPasswordReset(testEmail);
    console.log(`✅ Reset code generated: ${resetCode}`);

    // 3. Test code verification
    console.log('\n3. Testing code verification...');
    const result = await AuthService.verifyResetCode(resetCode, testEmail);
    console.log(`✅ Code verified successfully`);
    console.log(`   User: ${result.user.email}`);
    console.log(`   Token: ${result.token.substring(0, 20)}...`);

    // 4. Test token verification
    console.log('\n4. Testing token verification...');
    const verifiedUser = await AuthService.verifyResetToken(result.token);
    console.log(`✅ Token verified successfully`);
    console.log(`   User: ${verifiedUser.email}`);

    // 5. Test password reset (without actually changing it)
    console.log('\n5. Testing password reset process...');
    console.log('⚠️  Skipping actual password change to preserve test data');

    // 6. Check database state
    console.log('\n6. Checking database state...');
    const db = await getDatabase();
    const resetTokens = await db.collection('passwordResetTokens')
      .find({ used: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    console.log(`📊 Active reset tokens: ${resetTokens.length}`);
    for (const token of resetTokens) {
      console.log(`   Code: ${token.code}, userId: ${token.userId} (${typeof token.userId})`);
    }

    console.log('\n✅ All tests passed successfully!');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testPasswordReset().catch(console.error);
