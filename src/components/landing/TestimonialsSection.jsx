import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    rating: 5,
    quote: "Earned ₹4,200 in my first month as a freelance web developer after completing the Frontend Sprint. The AI Coach was a game-changer.",
    name: "Rahul S.",
    role: "B.Tech Student, VIT"
  },
  {
    rating: 5,
    quote: "SkillBridge Pro helped me bridge the gap between college projects and industry expectations. Booked an expert who helped me crack my first internship.",
    name: "Anjali M.",
    role: "Frontend Intern, Startup Inc."
  },
  {
    rating: 5,
    quote: "The Verified Portfolio badge got me an interview call within 2 weeks of adding it to my resume. It proves you can actually build things.",
    name: "Karan T.",
    role: "Junior Developer"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-classic-textPrimary mb-4">Real Outcomes</h2>
          <p className="text-lg text-classic-textSecondary">
            Don't just take our word for it. See how students are transforming their careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-classic-bg p-8 rounded-xl border border-classic-border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-classic-warning fill-classic-warning' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-classic-textSecondary italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-classic-primaryLight text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-classic-textPrimary">{testimonial.name}</h4>
                  <p className="text-sm text-classic-textSecondary">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
