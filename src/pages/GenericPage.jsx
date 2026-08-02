import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function GenericPage({ title, setActivePage }) {
  return (
    <div className="min-h-screen bg-classic-bg text-classic-textPrimary p-8">
      <div className="max-w-4xl mx-auto mt-20">
        <button 
          onClick={() => setActivePage('/')}
          className="flex items-center text-classic-accent hover:text-brand-emerald transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>
        <h1 className="text-4xl font-bold mb-6">{title}</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <p className="text-gray-600 text-lg leading-relaxed">
            This page is currently under construction. Please check back later for updates on {title}.
          </p>
        </div>
      </div>
    </div>
  );
}
