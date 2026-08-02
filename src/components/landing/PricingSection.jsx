import React from 'react';
import { Check } from 'lucide-react';

export default function PricingSection({ openDiagnostic }) {
  return (
    <section id="pricing" className="py-24 bg-classic-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-classic-textPrimary mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-classic-textSecondary">
            Invest in your career with a plan that fits your goals.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
          
          {/* Free Tier */}
          <div className="flex-1 bg-white p-8 rounded-2xl border border-classic-border shadow-classic-card flex flex-col">
            <h3 className="text-2xl font-bold text-classic-textPrimary mb-2">Free</h3>
            <p className="text-classic-textSecondary mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-classic-textPrimary">₹0</span>
              <span className="text-classic-textSecondary"> / month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Community access', 'Public portfolio', 'Basic reputation', '7-day challenge'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-classic-textSecondary">
                  <Check className="w-5 h-5 text-classic-success flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="w-full py-3 px-4 rounded-lg font-medium text-classic-primary border border-classic-border hover:bg-classic-bg transition-colors">
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="flex-1 bg-classic-primary p-8 rounded-2xl border border-classic-primary shadow-classic-modal flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-classic-warning text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-full shadow-sm">
                Most Popular
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-blue-200 mb-6">For serious career execution</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹499</span>
              <span className="text-blue-200"> / month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited AI questions', 'Priority expert booking', '2× reputation points', 'Advanced analytics', 'Verified Portfolio badges'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-blue-100">
                  <Check className="w-5 h-5 text-classic-accent flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={openDiagnostic}
              className="w-full py-3 px-4 rounded-lg font-bold text-classic-primary bg-white hover:bg-gray-50 shadow-classic-btn transition-transform active:scale-95"
            >
              Get Started with Pro
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
