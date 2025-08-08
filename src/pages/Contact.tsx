import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import mapThumbnail from '../assets/thumbnail_map.png';

const Contact = () => {
  const officeAddress = 'EN-9, Salt Lake, Sec-5, Kolkata-700091';

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            We'd love to hear from you. Please fill out the form or contact us using the details below.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info and Map Section */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Details</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <a href="tel:+917908735132" className="text-gray-600 hover:text-blue-600">+91 7908735132</a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a href="mailto:info@digitalindian.co.in" className="text-gray-600 hover:text-blue-600">info@digitalindian.co.in</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Location & Map */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Our Office</h2>
              <div className="flex items-start space-x-4 mb-6">
                <MapPin className="h-6 w-6 text-orange-500 flex-shrink-0" />
                <p className="text-gray-600">{officeAddress}</p>
              </div>

              {/* Thumbnail with Overlay and Link */}
              <a 
                href="https://www.google.com/maps/place/EN+BLOCK,+EN+-+9,+EN+Block,+Sector+V,+Bidhannagar,+Kolkata,+West+Bengal+700091/@22.5737394,88.4323714,21z/data=!4m6!3m5!1s0x3a0275afb2dd949b:0xcaff4cf09f3240cf!8m2!3d22.5736058!4d88.43239!16s%2Fg%2F11rkm75qlp?entry=ttu&g_ep=EgoyMDI1MDgwNS4wIKXMDSoASAFQAw%3D%3D"
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
                  <span className="text-white text-base max-w-sm">
                    {officeAddress}
                  </span>
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