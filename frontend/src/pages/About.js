import React from 'react';
import { Card } from '../components/ui/card';
import { CheckCircle2, Target, Eye, Award } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Target className="w-10 h-10 text-sierra-green" />,
      title: 'Our Mission',
      description: 'To ensure food security in Sierra Leone through quality seed production, certification, and distribution management.'
    },
    {
      icon: <Eye className="w-10 h-10 text-sierra-blue" />,
      title: 'Our Vision',
      description: 'A transparent and efficient seed system that empowers farmers with access to quality, certified seeds for better yields.'
    },
    {
      icon: <Award className="w-10 h-10 text-harvest-gold" />,
      title: 'Our Values',
      description: 'Transparency, quality assurance, farmer empowerment, and sustainable agricultural development.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1631620570575-486ce20df339?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZmFybWVyJTIwcmljZSUyMGZpZWxkJTIwU2llcnJhJTIwTGVvbmV8ZW58MHx8fHwxNzczNDI2NDg1fDA&ixlib=rb-4.1.0&q=85)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-blue-900/70" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white mb-4" data-testid="about-title">
            About Sierra Seeds Tracker
          </h1>
          <p className="text-base sm:text-lg text-white/90">
            Empowering agriculture through quality seed management
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-8 bg-white text-center hover:shadow-lg transition-shadow" data-testid={`value-card-${index}`}>
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="font-heading font-semibold text-2xl text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-heading font-bold text-3xl text-gray-900 mb-6">About the Platform</h2>
            <p className="text-gray-700 mb-6">
              The Sierra Leone Seed Tracker is a comprehensive seed information management platform designed to revolutionize how seeds are produced, certified, and distributed across Sierra Leone. Our platform serves as a central hub connecting seed producers, distributors, farmers, researchers, and regulatory authorities.
            </p>
            <p className="text-gray-700 mb-6">
              We are committed to ensuring that every farmer in Sierra Leone has access to high-quality, certified seeds that will improve agricultural productivity and food security. Through our digital platform, we provide transparency in the seed supply chain, from production to distribution.
            </p>
            
            <h3 className="font-heading font-semibold text-2xl text-gray-900 mb-4 mt-8">What We Offer</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-sierra-green mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Comprehensive seed registration and certification system</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-sierra-green mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Real-time tracking of seed availability across regions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-sierra-green mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Quality assurance and verification for all registered seeds</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-sierra-green mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Direct connection between farmers and certified distributors</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-sierra-green mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Analytics and reporting for agricultural planning</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}