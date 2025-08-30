import nodemailer from 'nodemailer';

// إعدادات البريد الإلكتروني
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'yussef.ali.it@gmail.com',
         pass: process.env.EMAIL_APP_PASSWORD || 'hxigwtmkxdxtvqdy'
  }
};

// إنشاء transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

export class EmailService {
  
  // إرسال رمز استعادة كلمة المرور
  static async sendPasswordResetEmail(email: string, resetCode: string, userName: string = 'المستخدم') {
    try {
      const mailOptions = {
        from: {
          name: 'موقع مأذوني',
          address: EMAIL_CONFIG.auth.user
        },
        to: email,
        subject: 'رمز استعادة كلمة المرور - موقع مأذوني',
        html: `
          <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c5530; margin: 0; font-size: 28px;">موقع مأذوني</h1>
                <div style="width: 50px; height: 3px; background-color: #4CAF50; margin: 10px auto;"></div>
              </div>

              <!-- Content -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">مرحباً ${userName}</h2>
                
                <p style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                  تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في موقع مأذوني.
                </p>
                
                <p style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
                  يرجى استخدام الرمز التالي لإعادة تعيين كلمة المرور:
                </p>

                <!-- Reset Code -->
                <div style="text-align: center; margin: 30px 0;">
                  <div style="background-color: #f8f9fa; border: 2px dashed #4CAF50; border-radius: 10px; padding: 25px; display: inline-block;">
                    <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">رمز استعادة كلمة المرور:</p>
                    <div style="font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 4px; font-family: 'Courier New', monospace; background-color: white; padding: 15px 25px; border-radius: 8px; border: 1px solid #e9ecef;">
                      ${resetCode}
                    </div>
                  </div>
                </div>

                <!-- Instructions -->
                <div style="background-color: #e7f3ff; border-radius: 5px; padding: 20px; margin: 20px 0; border-right: 4px solid #007bff;">
                  <h3 style="color: #004085; margin-top: 0; font-size: 16px;">كيفية الاستخدام:</h3>
                  <ol style="color: #004085; margin: 10px 0; padding-right: 20px;">
                    <li style="margin-bottom: 8px;">انتقل إلى صفحة استعادة كلمة المرور في الموقع</li>
                    <li style="margin-bottom: 8px;">أدخل الرمز المذكور أعلاه</li>
                    <li style="margin-bottom: 8px;">اتبع التعليمات لإنشاء كلمة مرور جديدة</li>
                  </ol>
                </div>

                <!-- Security Notice -->
                <div style="background-color: #fff3cd; border-radius: 5px; padding: 15px; margin: 20px 0; border-right: 4px solid #ffc107;">
                  <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                    <strong>ملاحظة أمنية:</strong> هذا الرمز صالح لمدة 15 دقيقة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  هذه رسالة تلقائية من موقع مأذوني، يرجى عدم الرد عليها.
                </p>
                <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                  © ${new Date().getFullYear()} موقع مأذوني. جميع الحقوق محفوظة.
                </p>
              </div>
            </div>
          </div>
        `,
        // نسخة نصية للبريد
        text: `
مرحباً ${userName},

تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في موقع مأذوني.

رمز استعادة كلمة المرور هو: ${resetCode}

يرجى استخدام هذا الرمز في صفحة استعادة كلمة المرور في الموقع.

هذا الرمز صالح لمدة 15 دقيقة فقط.

إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.

موقع مأذوني
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ تم إرسال البريد الإلكتروني بنجاح:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('❌ خطأ في إرسال البريد الإلكتروني:', error);
      throw new Error('فشل في إرسال البريد الإلكتروني');
    }
  }

  // إرسال بريد ترحيب للمستخدمين الجدد
  static async sendWelcomeEmail(email: string, userName: string, temporaryPassword?: string) {
    try {
      const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/login`;
      
      const mailOptions = {
        from: {
          name: 'موقع مأذوني',
          address: EMAIL_CONFIG.auth.user
        },
        to: email,
        subject: 'مرحباً بك في موقع مأذوني',
        html: `
          <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c5530; margin: 0; font-size: 28px;">مرحباً بك في موقع مأذوني</h1>
                <div style="width: 50px; height: 3px; background-color: #4CAF50; margin: 10px auto;"></div>
              </div>

              <!-- Content -->
              <div style="margin-bottom: 30px;">
                <h2 style="color: #333; margin-bottom: 20px;">أهلاً ${userName}</h2>
                
                <p style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
                  تم إنشاء حسابك بنجاح في موقع مأذوني. يمكنك الآن الوصول إلى لوحة التحكم.
                </p>

                ${temporaryPassword ? `
                  <div style="background-color: #e7f3ff; border-radius: 5px; padding: 20px; margin: 20px 0; border-right: 4px solid #007bff;">
                    <h3 style="color: #004085; margin-top: 0;">بيانات تسجيل الدخول:</h3>
                    <p style="color: #004085; margin: 5px 0;"><strong>البريد الإلكتروني:</strong> ${email}</p>
                    <p style="color: #004085; margin: 5px 0;"><strong>كلمة المرور المؤقتة:</strong> ${temporaryPassword}</p>
                  </div>

                  <div style="background-color: #fff3cd; border-radius: 5px; padding: 15px; margin: 20px 0; border-right: 4px solid #ffc107;">
                    <p style="color: #856404; font-size: 14px; margin: 0;">
                      <strong>مهم:</strong> يرجى تغيير كلمة المرور المؤقتة بعد تسجيل الدخول الأول.
                    </p>
                  </div>
                ` : ''}

                <!-- Login Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${loginUrl}" 
                     style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                    تسجيل الدخول
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  شكراً لانضمامك إلى موقع مأذوني
                </p>
                <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                  © ${new Date().getFullYear()} موقع مأذوني. جميع الحقوق محفوظة.
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ تم إرسال بريد الترحيب بنجاح:', result.messageId);
      return { success: true, messageId: result.messageId };
      
    } catch (error) {
      console.error('❌ خطأ في إرسال بريد الترحيب:', error);
      throw new Error('فشل في إرسال بريد الترحيب');
    }
  }

  // اختبار اتصال البريد الإلكتروني
  static async testConnection() {
    try {
      await transporter.verify();
      console.log('✅ تم التحقق من إعدادات البريد الإلكتروني بنجاح');
      return true;
    } catch (error) {
      console.error('❌ خطأ في إعدادات البريد الإلكتروني:', error);
      return false;
    }
  }
}
