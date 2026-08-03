import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Calendar, ArrowLeft, 
  Lock, CreditCard, ChevronRight, Check
} from 'lucide-react';
import { EXPERTS } from '../data/mockData';

export default function BookingPage({ expertId, serviceId, setActivePage }) {
  const [step, setStep] = useState(1);
  const [expert, setExpert] = useState(null);
  const [service, setService] = useState(null);
  
  // Form States
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    topic: '',
    source: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, upi

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundExpert = EXPERTS.find(e => e.id === expertId) || EXPERTS[0];
    setExpert(foundExpert);
    
    if (foundExpert) {
      const foundService = foundExpert.services?.find(s => s.id === serviceId) || foundExpert.services?.[0];
      setService(foundService);
      if (foundExpert.availabilitySlots?.length > 0) {
        setSelectedDate(foundExpert.availabilitySlots[0].date);
      }
    }
  }, [expertId, serviceId]);

  if (!expert || !service) return <div className="p-8 text-white">Loading...</div>;

  const currentDaySlots = expert.availabilitySlots?.find(s => s.date === selectedDate)?.times || [];
  const platformFee = 29;
  const totalAmount = service.price + platformFee;

  const handleDetailsSubmit = () => {
    const errors = {};
    if (!formData.topic || formData.topic.length < 20) {
      errors.topic = 'Please provide at least 20 characters of detail.';
    }
    if (!formData.source) {
      errors.source = 'Please select an option.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      setStep(3);
    }
  };

  const handlePaymentSubmit = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setStep(4);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0C0F14] text-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header & Steps */}
        {step < 4 && (
          <div className="mb-8">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : setActivePage('/experts')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> {step === 1 ? 'Back to Experts' : 'Back'}
            </button>
            
            <h1 className="text-2xl md:text-3xl font-space font-bold mb-8">Complete Your Booking</h1>

            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[rgba(38,46,60,0.9)] z-0"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#35C7B8] z-0 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
              
              {['Slot', 'Details', 'Payment'].map((label, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;
                return (
                  <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      isActive ? 'bg-[#35C7B8] text-black shadow-[0_0_10px_rgba(53,199,184,0.5)]' : 
                      isCompleted ? 'bg-[#35C7B8] text-black' : 
                      'bg-[rgba(22,27,36,1)] border-2 border-[rgba(38,46,60,0.9)] text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                    </div>
                    <span className={`text-xs font-medium hidden md:block ${isActive ? 'text-[#35C7B8]' : isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-[rgba(22,27,36,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(38,46,60,0.9)] overflow-hidden">
          
          {/* STEP 1: PICK SLOT */}
          {step === 1 && (
            <div className="p-6 md:p-8 animate-slide-up">
              <div className="flex items-center gap-4 p-4 bg-[rgba(38,46,60,0.3)] rounded-xl border border-[rgba(38,46,60,0.9)] mb-8">
                <img src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}`} alt={expert.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-bold text-white">{expert.name}</h3>
                  <p className="text-sm text-gray-400">{service.name} • {service.duration} mins</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-lg font-space font-bold text-[#35C7B8]">₹{service.price}</div>
                </div>
              </div>

              <h2 className="text-lg font-space font-bold mb-4">1. Select a Date</h2>
              <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-none">
                {expert.availabilitySlots?.map((slot) => (
                  <button
                    key={slot.date}
                    onClick={() => { setSelectedDate(slot.date); setSelectedTime(''); }}
                    className={`flex-1 min-w-[100px] py-3 px-2 text-center rounded-xl transition-all border ${
                      selectedDate === slot.date 
                        ? 'bg-white border-white text-black shadow-lg' 
                        : 'bg-[rgba(22,27,36,0.7)] border-[rgba(38,46,60,0.9)] text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                  >
                    <div className="text-xs uppercase font-semibold opacity-70 mb-1">{slot.date.split(',')[0]}</div>
                    <div className="font-bold">{slot.date.split(',')[1] || slot.date}</div>
                  </button>
                ))}
              </div>

              <h2 className="text-lg font-space font-bold mb-4">2. Select a Time</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                {currentDaySlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 text-sm rounded-xl transition-all border ${
                      selectedTime === time
                        ? 'bg-[#35C7B8]/20 border-[#35C7B8] text-[#35C7B8] font-bold shadow-[0_0_15px_rgba(53,199,184,0.15)]'
                        : 'bg-[rgba(22,27,36,0.5)] border-[rgba(38,46,60,0.9)] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <button 
                disabled={!selectedTime}
                onClick={() => setStep(2)}
                className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${
                  selectedTime 
                    ? 'bg-[#35C7B8] hover:bg-[#2bb0a2] text-black shadow-[0_0_20px_rgba(53,199,184,0.3)]' 
                    : 'bg-[rgba(38,46,60,0.5)] text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Details <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="p-6 md:p-8 animate-slide-up">
              <div className="bg-[#35C7B8]/10 p-4 rounded-xl border border-[#35C7B8]/30 mb-8 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#35C7B8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Selected Slot</h4>
                  <p className="text-sm text-gray-300">{selectedDate} at {selectedTime}</p>
                  <p className="text-xs text-[#35C7B8] mt-1">{service.duration} minute session</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input type="text" value={formData.name} readOnly className="w-full bg-[rgba(22,27,36,0.5)] border border-[rgba(38,46,60,0.9)] rounded-xl py-3 px-4 text-gray-400 cursor-not-allowed focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input type="email" value={formData.email} readOnly className="w-full bg-[rgba(22,27,36,0.5)] border border-[rgba(38,46,60,0.9)] rounded-xl py-3 px-4 text-gray-400 cursor-not-allowed focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What would you like to discuss? <span className="text-red-400">*</span>
                  </label>
                  <textarea 
                    rows={4}
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="Briefly describe your current situation and what you hope to get out of this session..."
                    className={`w-full bg-[rgba(22,27,36,0.7)] border ${formErrors.topic ? 'border-red-500' : 'border-[rgba(38,46,60,0.9)]'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#35C7B8] transition-colors resize-none`}
                  ></textarea>
                  {formErrors.topic && <p className="text-red-400 text-xs mt-1">{formErrors.topic}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    How did you hear about this expert? <span className="text-red-400">*</span>
                  </label>
                  <select 
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className={`w-full bg-[rgba(22,27,36,0.7)] border ${formErrors.source ? 'border-red-500' : 'border-[rgba(38,46,60,0.9)]'} rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#35C7B8] transition-colors appearance-none`}
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="skillbridge">SkillBridge Recommendations</option>
                    <option value="friend">Friend / Colleague</option>
                  </select>
                  {formErrors.source && <p className="text-red-400 text-xs mt-1">{formErrors.source}</p>}
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={handleDetailsSubmit}
                  className="w-full py-4 bg-[#35C7B8] hover:bg-[#2bb0a2] text-black font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(53,199,184,0.3)] flex justify-center items-center gap-2"
                >
                  Continue to Payment <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="flex flex-col md:flex-row animate-slide-up">
              {/* Order Summary */}
              <div className="w-full md:w-2/5 bg-[rgba(38,46,60,0.3)] p-6 md:p-8 border-b md:border-b-0 md:border-r border-[rgba(38,46,60,0.9)]">
                <h3 className="text-lg font-space font-bold mb-6">Order Summary</h3>
                
                <div className="flex items-center gap-3 mb-6">
                  <img src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}`} alt={expert.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-semibold text-white">{expert.name}</div>
                    <div className="text-xs text-gray-400">{service.name}</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-[rgba(38,46,60,0.9)] text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date & Time</span>
                    <span className="text-right">{selectedDate}<br/>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span>{service.duration} mins</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session Fee</span>
                    <span>₹{service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-space font-bold border-t border-[rgba(38,46,60,0.9)] pt-4">
                  <span>Total</span>
                  <span className="text-[#35C7B8]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Payment Form */}
              <div className="w-full md:w-3/5 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-space font-bold">Payment Method</h3>
                  <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                    <Lock className="w-3 h-3" /> Secure Server
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-3 border rounded-xl flex flex-col items-center gap-2 transition-colors ${
                      paymentMethod === 'card' ? 'border-[#35C7B8] bg-[#35C7B8]/10 text-[#35C7B8]' : 'border-[rgba(38,46,60,0.9)] bg-[rgba(22,27,36,0.5)] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs font-semibold">Card</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-3 border rounded-xl flex flex-col items-center gap-2 transition-colors ${
                      paymentMethod === 'upi' ? 'border-[#35C7B8] bg-[#35C7B8]/10 text-[#35C7B8]' : 'border-[rgba(38,46,60,0.9)] bg-[rgba(22,27,36,0.5)] text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-bold text-sm h-5 flex items-center">UPI</div>
                    <span className="text-xs font-semibold">Apps</span>
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-4 mb-8 opacity-80 pointer-events-none">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Card Number (Mock)</label>
                      <input type="text" value="4111 1111 1111 1111" readOnly className="w-full bg-[rgba(22,27,36,0.8)] border border-[rgba(38,46,60,0.9)] rounded-xl py-3 px-4 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Expiry</label>
                        <input type="text" value="12/25" readOnly className="w-full bg-[rgba(22,27,36,0.8)] border border-[rgba(38,46,60,0.9)] rounded-xl py-3 px-4 text-gray-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">CVV</label>
                        <input type="text" value="***" readOnly className="w-full bg-[rgba(22,27,36,0.8)] border border-[rgba(38,46,60,0.9)] rounded-xl py-3 px-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-8 opacity-80 pointer-events-none">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">UPI ID (Mock)</label>
                      <input type="text" value="user@okicici" readOnly className="w-full bg-[rgba(22,27,36,0.8)] border border-[rgba(38,46,60,0.9)] rounded-xl py-3 px-4 text-gray-400" />
                    </div>
                  </div>
                )}

                <button 
                  disabled={isProcessingPayment}
                  onClick={handlePaymentSubmit}
                  className={`w-full py-4 font-bold rounded-xl flex justify-center items-center gap-2 transition-all ${
                    isProcessingPayment 
                      ? 'bg-[rgba(38,46,60,0.9)] text-gray-400 cursor-wait' 
                      : 'bg-[#35C7B8] hover:bg-[#2bb0a2] text-black shadow-[0_0_20px_rgba(53,199,184,0.3)]'
                  }`}
                >
                  {isProcessingPayment ? 'Processing Secure Payment...' : `Pay ₹${totalAmount} Now`}
                </button>
                <p className="text-center text-xs text-gray-500 mt-4 flex justify-center items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Refund if expert cancels
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden">
              {/* Confetti decoration mock */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#35C7B8]/20 via-transparent to-transparent"></div>
              
              <div className="w-24 h-24 bg-gradient-to-tr from-[#35C7B8] to-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(53,199,184,0.5)] animate-[scale-in_0.5s_ease-out]">
                <Check className="w-12 h-12 text-black" strokeWidth={3} />
              </div>
              
              <h2 className="text-3xl font-space font-bold mb-2">Session Booked! 🎉</h2>
              <p className="text-gray-400 mb-8 max-w-md">Your payment is successful. We've sent a calendar invite with the meeting link to your email.</p>
              
              <div className="w-full max-w-md bg-[rgba(38,46,60,0.3)] border border-[rgba(38,46,60,0.9)] rounded-2xl p-6 mb-8 text-left relative z-10">
                <div className="flex items-center gap-4 mb-6 border-b border-[rgba(38,46,60,0.9)] pb-4">
                  <img src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}`} alt={expert.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-bold text-white">{expert.name}</h3>
                    <p className="text-sm text-gray-400">{service.name}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Date</div>
                    <div className="font-medium">{selectedDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Time</div>
                    <div className="font-medium">{selectedTime}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Duration</div>
                    <div className="font-medium">{service.duration} mins</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Status</div>
                    <div className="text-[#35C7B8] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-md relative z-10">
                <button className="flex-1 py-3 border border-[rgba(38,46,60,0.9)] hover:bg-[rgba(38,46,60,0.9)] rounded-xl font-medium transition-colors">
                  Add to Calendar
                </button>
                <button 
                  onClick={() => setActivePage('/experts')}
                  className="flex-1 py-3 bg-[#35C7B8] hover:bg-[#2bb0a2] text-black font-bold rounded-xl transition-colors"
                >
                  Explore More
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
