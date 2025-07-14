import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import nodemailer from 'nodemailer';

export const server = {
  sendContactForm: defineAction({
    accept: 'form',
    input: z.object({
      name: z
        .union([z.string(), z.null()])
        .transform((val) => val || '')
        .pipe(z.string().min(1, { message: "Please enter your name" }).min(2, { message: "Name must be at least 2 characters long" })),
      email: z
        .union([z.string(), z.null()])
        .transform((val) => val || '')
        .pipe(z.string().min(1, { message: "Please enter your email address" }).email({ message: "Please enter a valid email address" })),
      school: z
        .union([z.string(), z.null()])
        .transform((val) => val || '')
        .optional(),
      message: z
        .union([z.string(), z.null()])
        .transform((val) => val || '')
        .pipe(z.string().min(1, { message: "Please enter a message" }).min(10, { message: "Message must be at least 10 characters long" })),
    }),
    handler: async (input) => {
      try {
        // Log the form submission for debugging
        console.log('📧 Contact form submission:', {
          name: input.name,
          email: input.email,
          school: input.school || 'Not provided',
          messageLength: input.message.length,
          timestamp: new Date().toISOString()
        });

        // Create email content
        const emailContent = `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #5CA1CB; margin-bottom: 20px;">New Contact Form Submission</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${input.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${input.email}</p>
              ${input.school ? `<p style="margin: 5px 0;"><strong>School:</strong> ${input.school}</p>` : ''}
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; margin: 0; line-height: 1.5;">${input.message}</p>
            </div>
            
            <p style="color: #6c757d; font-size: 12px; margin-top: 20px; border-top: 1px solid #e9ecef; padding-top: 20px;">
              Sent from The Closet Clique contact form on ${new Date().toLocaleString()}
            </p>
          </div>
        `;

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: import.meta.env.SMTP_HOST,
          port: 465,
          secure: true,
          auth: {
            user: import.meta.env.SMTP_USER,
            pass: import.meta.env.SMTP_PASS,
          },
        });

        // Send email
        await transporter.sendMail({
          from: `"The Closet Clique" <${import.meta.env.SMTP_USER}>`,
          to: 'victor@spfairvalue.com',
          subject: `New Contact Form Message from ${input.name}`,
          html: emailContent,
          replyTo: input.email, // Allow direct reply to the sender
        });

        console.log('✅ Contact form email sent successfully');
        
        return {
          success: true,
          message: "Thank you for your message! We'll get back to you within 24-48 hours."
        };
        
      } catch (error) {
        console.error('❌ Error sending contact form:', error);
        
        // Return a user-friendly error message
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unable to send your message at this time. Please try again or contact us directly at hello@theclosetclique.com'
        });
      }
    },
  }),
}; 