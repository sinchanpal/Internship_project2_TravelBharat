import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-10 pb-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand Section */}
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">Travel<span className="text-orange-600">Bharat</span></h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your centralized digital encyclopedia for exploring India state by state. Discover heritage, nature, and culture.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col">
                        <h3 className="text-gray-900 font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/" className="hover:text-green-600 transition-colors">Home</Link></li>
                            <li><Link to="/explore" className="hover:text-green-600 transition-colors">Explore States</Link></li>
                            <li><Link to="/about" className="hover:text-green-600 transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact / Info */}
                    <div className="flex flex-col">
                        <h3 className="text-gray-900 font-semibold mb-4 uppercase tracking-wider text-sm">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="mailto:support@travelbharat.com" className="hover:text-green-600 transition-colors">support@travelbharat.com</a></li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>

                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 mt-8 pt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} TravelBharat. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;