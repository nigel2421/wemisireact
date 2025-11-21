import React from 'react';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 sm:p-10">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">About WEMISI</h1>
                    <p className="mt-3 text-lg text-stone-600 max-w-3xl mx-auto">
                        We are Kenya's premier supplier of high-quality interior and exterior design materials. From luxurious marble and timeless tiles to durable fencing and natural stone, we provide the foundation for creating beautiful and lasting spaces for both residential and commercial projects.
                    </p>
                </div>
            </div>

            <div className="border-t border-stone-200 bg-stone-50">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-stone-800">Get In Touch</h2>
                            <p className="mt-2 text-stone-600">Our team is available during business hours to assist you with product inquiries, quotes, and expert advice.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <PhoneIcon className="h-6 w-6 text-stone-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-stone-900">Phone & WhatsApp</h3>
                                    <a href="tel:+254712345678" className="text-stone-600 hover:text-stone-900">+254 712 345 678</a>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <MailIcon className="h-6 w-6 text-stone-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-stone-900">Email</h3>
                                    <a href="mailto:hello@wemisi.com" className="text-stone-600 hover:text-stone-900">hello@wemisi.com</a>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <LocationMarkerIcon className="h-6 w-6 text-stone-500" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-stone-900">Our Showroom</h3>
                                    <p className="text-stone-600">123 Industrial Area, Off Mombasa Road<br/>Nairobi, Kenya</p>
                                </div>
                            </div>
                        </div>
                         <div>
                            <h3 className="text-lg font-medium text-stone-900">Business Hours</h3>
                            <p className="text-stone-600 mt-1">Monday - Friday: 9am - 5pm</p>
                            <p className="text-stone-600">Saturday: 10am - 2pm</p>
                            <p className="text-stone-600">Sunday: Closed</p>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="rounded-lg overflow-hidden shadow-md">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.788530325958!2d36.84883531475396!3d-1.302334999052554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1174972a9121%3A0x3429a3930513904a!2sEnterprise%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1689252431289!5m2!1sen!2ske"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '300px' }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="WEMISI Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;