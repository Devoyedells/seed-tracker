import React from 'react';
import { Card } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

export default function FAQ() {
  const faqs = [
    {
      category: 'Registration',
      questions: [
        {
          q: 'Who needs to register?',
          a: 'Seed producers, distributors, and companies involved in commercial seed production and distribution in Sierra Leone must register with the platform.'
        },
        {
          q: 'What documents are required?',
          a: 'You will need business registration documents, proof of production facilities, quality control certificates, and relevant licenses from agricultural authorities.'
        },
        {
          q: 'How long does approval take?',
          a: 'The approval process typically takes 2-4 weeks depending on the completeness of your application and verification requirements.'
        }
      ]
    },
    {
      category: 'Certification',
      questions: [
        {
          q: 'Is the certificate valid internationally?',
          a: 'Certificates issued through this platform are recognized nationally. For international recognition, additional certifications from ECOWAS seed authorities may be required.'
        },
        {
          q: 'How do I verify a certificate?',
          a: 'Each certificate comes with a unique QR code that can be scanned or verified through our online portal by entering the certificate number.'
        },
        {
          q: 'What happens if my application is rejected?',
          a: 'You will receive detailed feedback on why your application was rejected and guidance on what improvements are needed to reapply.'
        }
      ]
    },
    {
      category: 'Seeds & Quality',
      questions: [
        {
          q: 'How do I know if a seed is certified?',
          a: 'Certified seeds are listed on our platform with a certification badge. You can also verify the certification status by checking the seed details.'
        },
        {
          q: 'What quality standards are used?',
          a: 'We follow international seed quality standards including germination rates, purity, moisture content, and freedom from diseases as per ISTA guidelines.'
        },
        {
          q: 'Can I report fake or poor quality seeds?',
          a: 'Yes, you can report quality issues through our platform. Each report is investigated by our quality assurance team.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl text-gray-900 mb-4" data-testid="faq-page-title">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-gray-600">
            Find answers to common questions about seed registration, certification, and quality assurance
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-6 bg-white shadow-sm" data-testid={`faq-category-${categoryIndex}`}>
              <h2 className="font-heading font-semibold text-2xl text-gray-900 mb-4">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`item-${categoryIndex}-${index}`} className="border border-gray-200 rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-sierra-green">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}