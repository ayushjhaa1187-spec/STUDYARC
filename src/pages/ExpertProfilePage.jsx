import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, Clock, Calendar, MessageSquare, 
  Briefcase, Sparkles, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { EXPERTS } from '../data/mockData';

export default function ExpertProfilePage({ expertId, setActivePage }) {
  const [expert, setExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundExpert = EXPERTS.find(e => e.id === expertId) || EXPERTS[0];
    setExpert(foundExpert);
    if (foundExpert?.availabilitySlots?.length > 0) {
      setSelectedDate(foundExpert.availabilitySlots[0].date);
    }
  }, [expertId]);

  if (!expert) return <div className="p-8 text-white">Loading...</div>;

  const currentDaySlots = expert.availabilitySlots?.find(s => s.date === selectedDate)?.times || [];

  return (
    <div className="min-h-screen bg-[#0C0F14] text-white pb-24 md:pb-8">
      {/* Header Back */}
      <div className="max-w-5xl mx-auto pt-6 px-4 mb-4">
        <button 
          onClick={() => setActivePage('/experts')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Experts
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <div className="glass-bright rounded-2xl p-6 md:p-8 border border-[rgba(38,46,60,0.9)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#35C7B8]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              <img 
                src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=262e3c&color=fff&size=128`} 
                alt={expert.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-[rgba(255,255,255,0.1)] shadow-xl" 
              />
              
              <div className="flex-1">
                {expert.isAIRecommended && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#a78bfa] text-xs font-semibold rounded-full mb-3">
                    <Sparkles className="w-3.5 h-3.5" /> AI Recommended Match
                  </div>
                )}
                
                <h1 className="text-2xl md:text-4xl font-space font-bold mb-2">{expert.name}</h1>
                <p className="text-gray-300 font-inter text-lg mb-2 flex items-center gap-2">
                  {expert.role} <span className="text-gray-600">at</span> <span className="font-semibold text-white">{expert.company}</span>
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {expert.expertise.map((tag, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-[rgba(38,46,60,0.5)] border border-[rgba(255,255,255,0.05)] text-gray-300 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-[rgba(38,46,60,0.9)] pt-5">
                  <div>
                    <div className="text-2xl font-space font-bold text-white flex items-center gap-1">
                      {expert.rating} <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{expert.reviews} Reviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-space font-bold text-white">{expert.sessions}+</div>
                    <div className="text-xs text-gray-400 mt-1">Sessions Held</div>
                  </div>
                  <div>
                    <div className="text-xl font-space font-bold text-white uppercase">{expert.languages[0]}</div>
                    <div className="text-xs text-gray-400 mt-1">Primary Lang</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="glass-bright rounded-2xl p-6 md:p-8 border border-[rgba(38,46,60,0.9)]">
            <h2 className="text-xl font-space font-bold mb-4">About {expert.name.split(' ')[0]}</h2>
            <div className="prose prose-invert max-w-none font-inter text-gray-300 leading-relaxed">
              <p>{expert.bio || `Experienced professional with a demonstrated history of working in the tech industry. Skilled in software development, architecture, and team leadership. Passionate about helping others grow their careers.`}</p>
              <p className="mt-4">Currently leading initiatives at <a href="#" className="text-[#35C7B8] hover:underline">{expert.company}</a>.</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="glass-bright rounded-2xl p-6 md:p-8 border border-[rgba(38,46,60,0.9)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-space font-bold">Recent Reviews</h2>
              <div className="text-sm font-medium text-[#35C7B8]">View All</div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="bg-[rgba(22,27,36,0.5)] p-4 rounded-xl border border-[rgba(38,46,60,0.5)]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-sm">
                        U{i+1}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Learner_{i+1}</div>
                        <div className="text-xs text-gray-500">Mentee</div>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 italic mt-3">"Great session! Really helped me clarify my career path and gave actionable advice."</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Booking & Services */}
        <div className="space-y-6">
          
          {/* Services Grid */}
          <div className="glass-bright rounded-2xl p-6 border border-[rgba(38,46,60,0.9)]">
            <h2 className="text-xl font-space font-bold mb-4">Book a Session</h2>
            <div className="space-y-4">
              {expert.services?.map((service) => (
                <div key={service.id} className="bg-[rgba(22,27,36,0.7)] p-5 rounded-xl border border-[rgba(38,46,60,0.9)] hover:border-[#35C7B8]/50 transition-all hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{service.name}</h3>
                    <div className="text-lg font-space font-bold text-[#35C7B8]">₹{service.price}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                    <Clock className="w-3.5 h-3.5" /> {service.duration} mins
                  </div>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">Get personalized guidance and feedback on your current challenges.</p>
                  <button 
                    onClick={() => setActivePage('/booking', { expertId: expert.id, serviceId: service.id })}
                    className="w-full py-2 bg-[rgba(38,46,60,0.9)] hover:bg-[#35C7B8] hover:text-black text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    Select This Service
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Calendar Quick View */}
          <div className="glass-bright rounded-2xl p-6 border border-[rgba(38,46,60,0.9)] sticky top-24 hidden md:block">
            <h2 className="text-xl font-space font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#35C7B8]" /> Available Slots
            </h2>
            
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
              {expert.availabilitySlots?.slice(0,3).map((slot) => (
                <button
                  key={slot.date}
                  onClick={() => { setSelectedDate(slot.date); setSelectedTime(''); }}
                  className={`flex-1 py-2 px-1 text-center rounded-lg text-sm transition-colors whitespace-nowrap ${
                    selectedDate === slot.date 
                      ? 'bg-white text-black font-semibold' 
                      : 'bg-[rgba(22,27,36,0.7)] text-gray-400 hover:text-white border border-[rgba(38,46,60,0.9)]'
                  }`}
                >
                  {slot.date}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {currentDaySlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 text-sm rounded-lg transition-all border ${
                    selectedTime === time
                      ? 'bg-[#35C7B8]/20 border-[#35C7B8] text-[#35C7B8] font-bold'
                      : 'bg-[rgba(22,27,36,0.5)] border-[rgba(38,46,60,0.9)] text-gray-300 hover:border-gray-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>

            {selectedTime && (
              <div className="bg-[#35C7B8]/10 p-3 rounded-lg border border-[#35C7B8]/30 mb-4 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#35C7B8] mt-0.5" />
                <div className="text-sm">
                  <span className="text-gray-300 block mb-1">Selected Slot:</span>
                  <span className="font-bold text-white">{selectedDate} at {selectedTime}</span>
                </div>
              </div>
            )}

            <button 
              disabled={!selectedTime}
              onClick={() => setActivePage('/booking', { expertId: expert.id, serviceId: expert.services[0].id })}
              className={`w-full py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${
                selectedTime 
                  ? 'bg-[#35C7B8] hover:bg-[#2bb0a2] text-black shadow-[0_0_15px_rgba(53,199,184,0.3)]' 
                  : 'bg-[rgba(38,46,60,0.5)] text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed to Book <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0C0F14]/90 backdrop-blur-xl border-t border-[rgba(38,46,60,0.9)] p-4 z-50 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">Starting from</div>
          <div className="text-xl font-space font-bold text-white flex items-baseline gap-1">
            ₹{expert.services?.[0]?.price} <span className="text-xs text-gray-500 font-normal">/ session</span>
          </div>
        </div>
        <button 
          onClick={() => setActivePage('/booking', { expertId: expert.id, serviceId: expert.services?.[0]?.id })}
          className="px-8 py-3 bg-[#35C7B8] text-black font-bold rounded-xl"
        >
          Book Now
        </button>
      </div>

    </div>
  );
}
