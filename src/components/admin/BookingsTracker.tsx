import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Users,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Trash2,
  ExternalLink,
  MessageSquare,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { BookingRequest, BookingStatus } from '../../types';
import {
  fetchBookingsFromSupabase,
  updateBookingStatusInSupabase,
  deleteBookingFromSupabase
} from '../../lib/supabase';

export const BookingsTracker: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBookingsFromSupabase();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    await updateBookingStatusInSupabase(id, newStatus);
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm('Delete this reservation record from tracker?')) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
      if (selectedBooking?.id === id) setSelectedBooking(null);
      await deleteBookingFromSupabase(id);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = b.guestName.toLowerCase().includes(q);
        const matchProp = b.propertyTitle.toLowerCase().includes(q);
        const matchPhone = b.phone.toLowerCase().includes(q);
        const matchLoc = b.propertyLocation.toLowerCase().includes(q);
        if (!matchName && !matchProp && !matchPhone && !matchLoc) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  // Metric stats
  const metrics = useMemo(() => {
    const totalCount = bookings.length;
    const pendingCount = bookings.filter((b) => b.status === 'pending').length;
    const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
    const totalGrossRevenueNgn = bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalAmountNgn || 0), 0);

    return { totalCount, pendingCount, confirmedCount, totalGrossRevenueNgn };
  }, [bookings]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-emerald-400" />
            <span>Short-Stay Bookings Tracker</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time reservation requests from high-intent shortlet clients
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadBookings}
            disabled={isLoading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Refresh bookings"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <span className="text-xs font-semibold text-slate-400">Total Reservations</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.totalCount}</span>
            <span className="text-[11px] text-slate-400">Requests</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">{metrics.pendingCount}</span>
            <span className="text-[11px] text-amber-300">Action needed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed Stays</span>
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{metrics.confirmedCount}</span>
            <span className="text-[11px] text-emerald-400">Verified</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
          <span className="text-xs font-semibold text-slate-400">Confirmed Booking Volume</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              ₦{metrics.totalGrossRevenueNgn.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs border border-slate-600'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest, apartment, phone..."
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

      </div>

      {/* Bookings Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">No reservation requests found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Incoming bookings submitted via the public short-stay landing pages will appear here with live client data.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-3 font-semibold">Guest & Apartment</th>
                  <th className="pb-3 font-semibold">Stay Dates</th>
                  <th className="pb-3 font-semibold">Nights / Guests</th>
                  <th className="pb-3 font-semibold">Total Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredBookings.map((b) => {
                  const cleanPhone = b.phone.replace(/[^0-9]/g, '');
                  const waText = encodeURIComponent(
                    `Hello ${b.guestName}, this is Legit Properties Concierge confirming your short-stay booking for ${b.propertyTitle} (${b.checkIn} to ${b.checkOut}).`
                  );

                  return (
                    <tr key={b.id} className="hover:bg-slate-750/50 transition-colors">
                      
                      {/* Guest & Apartment */}
                      <td className="py-3.5">
                        <div className="font-bold text-white text-sm">{b.guestName}</div>
                        <div className="text-[11px] text-emerald-400 font-medium line-clamp-1">{b.propertyTitle}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{b.propertyLocation}</span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 text-slate-300 font-mono">
                        <div>In: {b.checkIn}</div>
                        <div>Out: {b.checkOut}</div>
                      </td>

                      {/* Nights & Guests */}
                      <td className="py-3.5 text-slate-300">
                        <div className="font-semibold">{b.nights} night{b.nights > 1 ? 's' : ''}</div>
                        <div className="text-[10px] text-slate-400">{b.guestsCount} Guest{b.guestsCount > 1 ? 's' : ''}</div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 font-bold text-emerald-400 font-mono text-sm">
                        ₦{(b.totalAmountNgn || 0).toLocaleString()}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase border cursor-pointer focus:outline-none ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : b.status === 'pending'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : b.status === 'completed'
                              ? 'bg-blue-950 text-blue-300 border-blue-800'
                              : 'bg-red-950 text-red-300 border-red-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.phone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${waText}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <a
                            href={`tel:${b.phone}`}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                            title="Call Guest"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-400"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
