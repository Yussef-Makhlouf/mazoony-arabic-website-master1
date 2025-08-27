#!/usr/bin/env tsx

import { initializeDatabase } from '../lib/mongodb'

async function main() {
  try {
    console.log('🚀 بدء تهيئة قاعدة البيانات...')
    
    await initializeDatabase()
    
    console.log('✅ تم تهيئة قاعدة البيانات بنجاح!')
    console.log('📊 يمكنك الآن الوصول إلى لوحة التحكم على: http://localhost:3000/admin')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', error)
    process.exit(1)
  }
}

main()
