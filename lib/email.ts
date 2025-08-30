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
  static async sendPasswordResetEmail(email: string, token: string, userName: string = 'المستخدم') {
    try {
      const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;
      
      const mailOptions = {
        from: {
          name: 'موقع مأذوني',
          address: EMAIL_CONFIG.auth.user
        },
        to: email,
        subject: 'استعادة كلمة المرور - موقع مأذوني',
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
                  للمتابعة، يرجى الضغط على الزر أدناه:
                </p>

                <!-- Reset Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                    إعادة تعيين كلمة المرور
                  </a>
                </div>

                <!-- Alternative Link -->
                <div style="background-color: #f5f5f5; border-radius: 5px; padding: 20px; margin: 20px 0;">
                  <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
                    إذا لم يعمل الزر أعلاه، يمكنك نسخ ولصق الرابط التالي في المتصفح:
                  </p>
                  <p style="color: #4CAF50; word-break: break-all; font-size: 14px; margin: 0;">
                    ${resetUrl}
                  </p>
                </div>

                <!-- Security Notice -->
                <div style="background-color: #fff3cd; border-radius: 5px; padding: 15px; margin: 20px 0; border-right: 4px solid #ffc107;">
                  <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                    <strong>ملاحظة أمنية:</strong> هذا الرابط صالح لمدة 15 دقيقة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.
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

للمتابعة، يرجى زيارة الرابط التالي:
${resetUrl}

هذا الرابط صالح لمدة 15 دقيقة فقط.

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
