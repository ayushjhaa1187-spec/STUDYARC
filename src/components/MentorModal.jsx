import React, { useState } from 'react';
import { X, Star, Calendar, Clock, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function MentorModal({ mentor, isOpen, onClose }) {
  const [selectedType, setSelectedType] = useState('Code & Architecture Review');
  const [selectedSlot, setSelectedSlot] = useState('Today, 5:30 PM');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen || !mentor) return null;

  const reviewTypes = [
    { id: 'Code & Architecture Review', title: 'Code & Architecture Roast', duration: '45 mins', desc: '1-on-1 deep dive into your GitHub pull request and software design.' },
    { id: 'Mock Technical Interview', title: 'Mock Technical Interview', duration: '60 mins', desc: 'Simulated FAANG-level live coding & system design interview.' },
    { id: 'Resume & Portfolio Review', title: 'Portfolio & Resume Roast', duration: '30 mins', desc: 'Recruiter perspective roast on your portfolio, live apps, and ATS resume.' },
  ];

  const availableSlots = [
    'Today, 5:30 PM',
    'Tomorrow, 2:00 PM',
    'Aug 6, 11:00 AM',
    'Aug 7, 6:00 PM'
  ];

  const handleBooking = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
      alert(`Booking Confirmed with ${mentor.name} for ${selectedSlot}! A Google Meet link has been dispatched.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/30 bg-[#0f172a] p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header Profile Info */}
        <div className="flex items-start space-x-4">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500/40"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-white">{mentor.name}</h3>
              <span className="flex items-center space-x-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{mentor.rating} ({mentor.reviewCount} reviews)</span>
              </span>
            </div>
            <p className="text-sm font-medium text-emerald-400">{mentor.role} @ {mentor.company}</p>
            <p className="mt-1 text-xs text-slate-400">{mentor.bio}</p>
          </div>
        </div>

        {/* Skill Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {mentor.expertise.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-mono text-slate-300 border border-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Session Type Selection */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">1. Select Review Type</h4>
          <div className="space-y-2">
            {reviewTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex cursor-pointer items-start justify-between rounded-xl p-3.5 border transition ${
                  selectedType === type.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-white">{type.title}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                      {type.duration}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{type.desc}</p>
                </div>
                {selectedType === type.id && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Slot Picker */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">2. Choose Available Slot</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-xl p-2.5 text-center text-xs font-mono transition border ${
                  selectedSlot === slot
                    ? 'border-teal-400 bg-teal-500/20 text-teal-300 font-bold'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Checkout Bar */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4">
          <div>
            <span className="text-xs text-slate-400 font-mono">Investment</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-white">₹{mentor.price}</span>
              <span className="text-xs text-slate-400">/ session</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleBooking}
              disabled={isBooked}
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:opacity-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" />
              <span>{isBooked ? 'Confirming...' : 'Book Session'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
