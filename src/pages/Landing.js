import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, FileCheck, Award, Leaf } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export default function Landing() {
  const navigate = useNavigate();

  const userTypes = [
    {
      icon: <Users className="w-8 h-8 text-sierra-green" />,
      title: 'Producers',
      description: 'For commercial seed companies and certified seed multipliers for quick seed variety registration.'
    },
    {
      icon: <FileCheck className="w-8 h-8 text-sierra-blue" />,
      title: 'Regulators',
      description: 'For seed inspectors and quality control to manage the seed managing approval.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-harvest-gold" />,
      title: 'Researchers',
      description: 'For research organizations, developing and releasing varieties.'
    },
    {
      icon: <Award className="w-8 h-8 text-sierra-green" />,
      title: 'Certification',
      description: 'Direct access to verified seed-based upon successful certification.'
    }
  ];

  const accreditationSteps = [
    {
      number: '01',
      title: 'Apply',
      description: 'Submit company profile, documents, and production plans.',
      items: ['Profile & documents', 'Compliance proof', 'Payment verification']
    },
    {
      number: '02',
      title: 'Review',
      description: "Regulator's validate eligibility and compliance requirements.",
      items: ['Document checks', 'Production verification', 'Clarifications if needed']
    },
    {
      number: '03',
      title: 'Approve',
      description: 'Board confirmation after review and readiness confirmation.',
      items: ['Board assessment', 'Application processing', 'Approval notice']
    },
    {
      number: '04',
      title: 'Licence',
      description: 'Get valid license with QR for verification.',
      items: ['Digital certificate', 'License with QR', 'Producer ID issued']
    }
  ];

  const faqs = [
    {
      question: 'Who needs to register?',
      answer: 'Seed producers, distributors, and companies involved in commercial seed production and distribution in Sierra Leone must register with the platform.'
    },
    {
      question: 'What documents are required?',
      answer: 'You will need business registration documents, proof of production facilities, quality control certificates, and relevant licenses from agricultural authorities.'
    },
    {
      question: 'How long does approval take?',
      answer: 'The approval process typically takes 2-4 weeks depending on the completeness of your application and verification requirements.'
    },
    {
      question: 'Is the certificate valid internationally?',
      answer: 'Certificates issued through this platform are recognized nationally. For international recognition, additional certifications from ECOWAS seed authorities may be required.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1731682819696-d478cd9dd481?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxncmVlbiUyMGx1c2glMjBoaWxscyUyMGFncmljdWx0dXJlJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc3MzQyNjUwMHww&ixlib=rb-4.1.0&q=85)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-blue-900/70" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 animate-fade-in" data-testid="hero-title">
            Securing Sierra Leone's Seeds
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Sierra Leone Seed Information Management Platform for Seed Producer Registration, Accreditation, Field Registration and Quality Assurance. Ensuring high-quality seed for better yields.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-harvest-gold hover:bg-yellow-600 text-gray-900 font-semibold shadow-xl text-base"
              data-testid="hero-start-registration-btn"
            >
              Start Registration
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/catalogues')}
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-base"
              data-testid="hero-learn-more-btn"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Why Seed Accreditation Matters */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-4" data-testid="accreditation-title">
              Why Seed Accreditation Matters
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Quality seeds are the foundation of food security. The Sierra Leone Seed Tracker offers a trusted framework to register seed companies, certify production, and ensure that farmers have access to high-quality, viable seeds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {userTypes.map((type, index) => (
              <Card key={index} className="p-6 bg-white border border-gray-100 hover:border-sierra-green/50 hover:shadow-lg transition-all duration-300" data-testid={`user-type-card-${index}`}>
                <div className="mb-4">{type.icon}</div>
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4">Key Benefits</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Verify seed origin and quality',
                'Register accredited producers',
                'Track national seed stores',
                'Boost national agricultural yield'
              ].map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-sierra-green flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Accreditation Flow */}
      <section className="py-20 bg-gradient-to-br from-green-800 to-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-4" data-testid="flow-title">
              Accreditation Flow, Transparent & Auditable
            </h2>
            <p className="text-base text-green-100 max-w-2xl mx-auto">
              Our streamlined process ensures transparency at every step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accreditationSteps.map((step, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/20 transition-all" data-testid={`flow-step-${index}`}>
                <div className="text-4xl font-heading font-bold text-harvest-gold mb-4">{step.number}</div>
                <h3 className="font-heading font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-sm text-green-100 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-harvest-gold rounded-full" />
                      <span className="text-green-50">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Varieties Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-4" data-testid="varieties-title">
              Explore Sierra Leone's Released Varieties
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Search official varieties by crop, adaptation zone, maturity, and traits. Compare entries and access trusted agronomic notes for planting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              { label: 'Rice Varieties', value: '45+', description: 'High-yielding varieties' },
              { label: 'Cassava Varieties', value: '18+', description: 'Disease-resistant' },
              { label: 'Maize Varieties', value: '32+', description: 'Drought-tolerant' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100" data-testid={`stat-card-${index}`}>
                <div className="text-4xl font-heading font-bold text-sierra-green mb-2">{stat.value}</div>
                <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/catalogues')}
              size="lg"
              className="bg-sierra-green hover:bg-green-700 text-white font-semibold shadow-md"
              data-testid="view-catalogues-btn"
            >
              Open Catalogues
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sierra-blue to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6" data-testid="cta-title">
            Ready to find quality seed near you?
          </h2>
          <p className="text-base text-blue-100 mb-8">
            Explore accredited seed sources, compare varieties, and connect with verified distributors.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/marketplace')}
            className="bg-white text-sierra-blue hover:bg-gray-100 font-semibold shadow-xl"
            data-testid="cta-explore-btn"
          >
            Explore & Buy Quality Seeds
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-gray-900 mb-4" data-testid="faq-title">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-gray-600">
              Common questions about the accreditation process
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-sierra-green">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}