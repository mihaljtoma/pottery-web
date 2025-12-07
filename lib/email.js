import nodemailer from 'nodemailer';

export async function sendContactEmail({ name, email, message }) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Pottery Studio Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
            .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; }
            .header p { color: #fef3c7; margin: 10px 0 0 0; font-size: 14px; }
            .content { padding: 40px 30px; }
            .info-box { background-color: #f9fafb; border-left: 4px solid #d97706; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .info-row { margin: 15px 0; }
            .label { font-weight: 600; color: #374151; font-size: 14px; margin-bottom: 5px; }
            .value { color: #1f2937; font-size: 16px; }
            .message-box { background-color: #fffbeb; border: 2px solid #fbbf24; border-radius: 12px; padding: 25px; margin: 25px 0; }
            .message-label { font-weight: 700; color: #92400e; font-size: 15px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .message-text { color: #78350f; font-size: 15px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; }
            .reply-button { display: inline-block; background-color: #d97706; color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: 600; margin: 20px 0; transition: background-color 0.3s; }
            .reply-button:hover { background-color: #b45309; }
            .footer { background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
            .footer p { color: #6b7280; font-size: 13px; margin: 8px 0; }
            .footer a { color: #d97706; text-decoration: none; }
            .divider { height: 1px; background-color: #e5e7eb; margin: 30px 0; }
            .icon { display: inline-block; width: 40px; height: 40px; background-color: #fef3c7; border-radius: 50%; text-align: center; line-height: 40px; font-size: 20px; margin-bottom: 10px; }
          </style>
        </head>
        <body style="background-color: #f3f4f6; padding: 20px;">
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <h1>New Contact Message</h1>
              <p>Someone reached out through your pottery website</p>
            </div>

            <!-- Content -->
            <div class="content">
              <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">
                You've received a new message from a visitor on your Pottery Studio website. Here are the details:
              </p>

              <!-- Sender Info -->
              <div class="info-box">
                <div class="info-row">
                  <div class="label">👤 From:</div>
                  <div class="value" style="font-weight: 600; font-size: 18px;">${name}</div>
                </div>
                <div class="divider"></div>
                <div class="info-row">
                  <div class="label">📧 Email Address:</div>
                  <div class="value">
                    <a href="mailto:${email}" style="color: #d97706; text-decoration: none; font-weight: 500;">${email}</a>
                  </div>
                </div>
              </div>

              <!-- Message -->
              <div class="message-box">
                <div class="message-label">💬 Message</div>
                <div class="message-text">${message}</div>
              </div>

              <!-- Reply Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="mailto:${email}?subject=Re: Your pottery inquiry" class="reply-button" style="color: #ffffff;">
                  ✉️ Reply to ${name.split(' ')[0]}
                </a>
              </div>

              <!-- Quick Tips -->
              <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <div style="font-weight: 600; color: #065f46; margin-bottom: 10px;">💡 Quick Response Tips:</div>
                <ul style="color: #047857; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Respond within 24 hours for best customer experience</li>
                  <li>Personalize your response with their name</li>
                  <li>Include relevant product images if applicable</li>
                  <li>Provide clear next steps or call-to-action</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="font-weight: 600; color: #374151; margin-bottom: 15px;">Pottery Studio Contact System</p>
              <p>This email was automatically sent from your website contact form.</p>
              <p>Submitted on ${new Date().toLocaleString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px;">
                  <a href="https://your-pottery-site.com" style="color: #d97706;">View Website</a> • 
                  <a href="https://your-pottery-site.com/admin/messages" style="color: #d97706;">Manage Messages</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
This email was sent from your Pottery Studio website contact form.
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}