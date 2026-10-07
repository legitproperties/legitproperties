import React, { useState, useMemo } from 'react';
import { X, Calendar, Users, Phone, Mail, User, CheckCircle2, MessageSquare, ShieldCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { Property, BookingRequest } from '../../types';
import { saveBookingToSupabase } from '../../lib/supabase';

interface BookingModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete?: (booking: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  property,
  isOpen,
  onClose,
  onBookingComplete
}) => {
  if (!isOpen || !property) return null;

  // Defaults
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guestsCount, setGuestsCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);

  // Nights calculation
  const nights = useMemo(() => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [checkIn, checkOut]);

  const isShortStay = property.listing_type === 'short_stay' || property.price_unit === 'per_night' || property.category === 'short_stay';
  const isUsd = property.currency === 'USD' || property.display_currency === 'USD';
  const currencySymbol = isUsd ? '$' : '₦';
  const activeRate = isUsd
    ? ((property.priceUsd && property.priceUsd > 0) ? property.priceUsd : Math.round((property.priceNgn || 85000) / 1500))
    : (property.priceNgn || 85000);
  const pricePerNight = activeRate;
  const totalAmount = isShortStay ? activeRate * nights : activeRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter your active WhatsApp or phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const booking: BookingRequest = {
      id: 'book-' + Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: `${property.location.neighborhood || ''}, ${property.location.city}`,
      guestName: guestName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      checkIn,
      checkOut,
      nights,
      guestsCount,
      pricePerNightNgn: pricePerNight,
      totalAmountNgn: totalAmount,
      status: 'pending',
      specialRequests: specialRequests.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      await saveBookingToSupabase(booking);
      setSubmittedBooking(booking);
      setIsSuccess(true);
      if (onBookingComplete) {
        onBookingComplete(booking);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit booking. Please contact our agent directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const agentWhatsApp = (property.whatsappNumber || '+2348030000000').replace(/[^0-9]/g, '');
  const whatsAppText = encodeURIComponent(
    `Hello Legit Properties! I just submitted an Instant Reservation Request:\n\n` +
    `• Property: ${property.title}\n` +
    `• Location: ${property.location.city}\n` +
    `• Guest Name: ${guestName}\n` +
    `• Phone: ${phone}\n` +
    `• Check-In: ${checkIn}\n` +
    `• Check-Out: ${checkOut} (${nights} night${nights > 1 ? 's' : ''})\n` +
    `• Guests: ${guestsCount}\n` +
    `• Total Amount: ₦${totalAmount.toLocaleString()}\n\n` +
    `Please confirm instant key collection and payment procedure.`
  );

  const whatsAppUrl = `https://wa.me/${agentWhatsApp}?text=${whatsAppText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {isShortStay ? 'Instant Short-Stay Reservation' : 'Direct Property Purchase Inquiry'}
              </h3>
              <p className="text-[11px] text-slate-400">Guaranteed instant response within 5 minutes</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {isSuccess ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-extrabold text-slate-900">
                  {isShortStay ? 'Reservation Request Received!' : 'Purchase Inquiry Logged!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{guestName}</strong>. Your reservation for <strong className="text-slate-900">{property.title}</strong> has been transmitted to our executive reservations desk.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Dates</span>
                  <span className="font-semibold text-slate-900">{checkIn} to {checkOut} ({nights} nights)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Guests</span>
                  <span className="font-semibold text-slate-900">{guestsCount} Guests</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Estimated Total</span>
                  <span className="font-extrabold text-emerald-700 text-sm">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-amber-600 uppercase text-[10px]">Pending Confirmation</span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant Confirmation via WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Selected Property Preview Bar */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <img
                  src={property.images[0] || property.property_image}
                  alt={property.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{property.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{property.location.neighborhood}, {property.location.city}</p>
                  <div className="text-xs font-extrabold text-slate-900 mt-1 flex items-center gap-1.5 font-mono">
                    <span>{currencySymbol}{pricePerNight.toLocaleString()}{isShortStay ? ' / night' : ' total'}</span>
                    <span className="text-[10px] text-slate-400 font-sans uppercase">({isUsd ? 'USD' : 'NGN'})</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Dates & Guests Grid (for short stay) */}
              {isShortStay && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Check-In</span>
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Check-Out</span>
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Guests</span>
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5 Guests</option>
                      <option value={6}>6+ Guests</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Guest Details */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Dr. Ngozi Adeleke"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>WhatsApp / Phone *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email Address (Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ngozi@domain.com"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Special Notes or Flight Arrival Time</label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Arriving on British Airways BA075 at 7pm, request airport pickup and late check-in."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
                  />
                </div>
              </div>

              {/* Price Calculation Card */}
              {isShortStay && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{currencySymbol}{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="font-mono">{currencySymbol}{(pricePerNight * nights).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Cleanliness & Power Guarantee Fee</span>
                    <span className="text-emerald-400 font-semibold">Included ({currencySymbol}0)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-extrabold text-sm sm:text-base">
                    <span>Total Payable</span>
                    <div className="text-right font-mono">
                      <span className="text-emerald-400">{currencySymbol}{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing Request...' : isShortStay ? 'Confirm Instant Reservation' : 'Submit Property Inquiry'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Booking Fees • Direct Host Pricing • Verified Identity</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
