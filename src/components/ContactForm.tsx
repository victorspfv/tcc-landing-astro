import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { actions } from 'astro:actions';

// Validation schema matching the server-side schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Please enter your name').min(2, 'Name must be at least 2 characters long'),
  email: z.string().min(1, 'Please enter your email address').email('Please enter a valid email address'),
  school: z.string().optional(),
  message: z.string().min(1, 'Please enter a message').min(10, 'Message must be at least 10 characters long'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange', // Real-time validation
  });

  const message = watch('message', '');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (data.school) formData.append('school', data.school);
      formData.append('message', data.message);

      const { data: result, error } = await actions.sendContactForm(formData);
      
      if (error) {
        setSubmitStatus('error');
        setSubmitMessage(error.message || 'Something went wrong. Please try again.');
      } else {
        setSubmitStatus('success');
        setSubmitMessage(result.message || "Thank you for your message! We'll get back to you within 24-48 hours.");
        reset(); // Clear the form
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldClasses = (fieldName: keyof ContactFormData) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200";
    const hasError = errors[fieldName];
    const isDirty = dirtyFields[fieldName];
    const isValidField = isDirty && !hasError;

    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-200 bg-red-50`;
    } else if (isValidField) {
      return `${baseClasses} border-green-500 focus:ring-green-200 bg-green-50`;
    } else {
      return `${baseClasses} border-gray-300 focus:ring-[#5CA1CB] focus:border-[#5CA1CB]`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-pacifico text-[#5CA1CB] mb-2">Send us a message</h2>
        <p className="text-[#00486D]">
          We'd love to hear from you! Whether you have questions, suggestions, or want to get involved.
        </p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="text-green-700">{submitMessage}</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <p className="text-red-700">{submitMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Name and Email Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#00486D] mb-2">
              Name *
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className={getFieldClasses('name')}
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#00486D] mb-2">
              Email *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className={getFieldClasses('email')}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* School Field */}
        <div>
          <label htmlFor="school" className="block text-sm font-semibold text-[#00486D] mb-2">
            School (Optional)
          </label>
          <input
            {...register('school')}
            type="text"
            id="school"
            className={getFieldClasses('school')}
            placeholder="Your school or university"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-[#00486D] mb-2">
            Message *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            className={getFieldClasses('message')}
            placeholder="Tell us about yourself, your interest in fashion, or any questions you have..."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {errors.message.message}
              </p>
            ) : (
              <div />
            )}
            <span className={`text-sm ${message.length >= 10 ? 'text-green-600' : 'text-gray-500'}`}>
              {message.length}/10 characters minimum
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
            isSubmitting || !isValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending message...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}
