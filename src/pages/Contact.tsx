import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Paperclip } from 'lucide-react';
import mapThumbnail from '../assets/thumbnail_map.png';

// Declare grecaptcha globally
declare global {
  interface Window {
    grecaptcha: any;
  }
}

const RECAPTCHA_SITE_KEY = '6LfubZ4rAAAAAAMD-wue0qn2upb0e2ty11hFVcEF'; // Your reCAPTCHA v3 site key

const Contact = () => {
  const officeAddress = 'EN-9, Salt Lake, Sec-5, Kolkata-700091';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [captchaReady, setCaptchaReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => setCaptchaReady(true);
    document.body.appendChild(script);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResume(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');

    if (!captchaReady || !window.grecaptcha) {
      setStatus('Captcha not ready.');
      return;
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: 'submit',
      });

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);
      if (resume) formDataToSend.append('resume', resume);
      formDataToSend.append('captcha', token);

      // ✅ Use relative path so Vercel serverless function works
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        setResume(null);
      } else {
        setStatus(data.error || 'Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Server error. Please try again later.');
    }
  };

  return (
    <div className="pt-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 transition-colors duration-500 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">Get in Touch</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            We'd love to hear from you. Please fill out the form or contact us using the details below.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
              <div>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                ></textarea>
              </div>
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Resume/Attachment (Optional)
                </label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label
                    htmlFor="resume"
                    className={`flex items-center justify-center w-full px-4 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700 hover:border-blue-500 transition-colors duration-200 ${
                      resume ? 'border-blue-500' : ''
                    }`}
                  >
                    {resume ? (
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">{resume.name}</span>
                    ) : (
                      <>
                        <Paperclip className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Choose file...</span>
                      </>
                    )}
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                {resume && (
                  <button
                    type="button"
                    onClick={() => setResume(null)}
                    className="mt-2 px-2 py-1 text-xs rounded text-red-600 hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    Remove file
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!captchaReady}
                className="w-full px-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                Send Message
              </button>
              {status && <p className="mt-4 text-sm text-green-500 dark:text-green-400">{status}</p>}
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Contact Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <a href="tel:+917908735132" className="hover:text-blue-600">+91 7908735132</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href="mailto:info@digitalindian.co.in" className="hover:text-blue-600">info@digitalindian.co.in</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Find Our Office</h2>
              <div className="flex items-start space-x-4 mb-6">
                <MapPin className="h-6 w-6 text-orange-500" />
                <p>{officeAddress}</p>
              </div>
              <a
                href="https://www.google.com/maps/place/EN+BLOCK,+EN+-+9,+EN+Block,+Sector+V,+Bidhannagar,+Kolkata,+West+Bengal+700091/@22.5737394,88.4323714,21z"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-64 w-full rounded-lg overflow-hidden shadow-md block"
              >
                <img
                  src={mapThumbnail}
                  alt="Office Location Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-white text-base max-w-sm">{officeAddress}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
