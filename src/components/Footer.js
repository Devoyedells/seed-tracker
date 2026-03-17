import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-900 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-sierra-green" />
              </div>
              <span className="font-heading font-bold text-xl">Sierra Seeds</span>
            </div>
            <p className="text-green-100 text-sm">
              Sierra Leone Seed Information Management Platform for Quality Assurance and Better Yields.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-green-100 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link to="/catalogues" className="text-green-100 hover:text-white text-sm transition-colors">Catalogues</Link></li>
              <li><Link to="/marketplace" className="text-green-100 hover:text-white text-sm transition-colors">Marketplace</Link></li>
              <li><Link to="/about" className="text-green-100 hover:text-white text-sm transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-green-100 hover:text-white text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/register" className="text-green-100 hover:text-white text-sm transition-colors">Register Company</Link></li>
              <li><a href="#" className="text-green-100 hover:text-white text-sm transition-colors">Verify Certificate</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-green-300" />
                <span className="text-green-100">Freetown, Sierra Leone</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-green-300" />
                <span className="text-green-100">+232 76 123 456</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-green-300" />
                <span className="text-green-100">info@sierraseeds.sl</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-100 text-sm">
          <p>&copy; 2026 Sierra Leone Seed Tracker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};