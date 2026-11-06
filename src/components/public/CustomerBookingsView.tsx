import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  FileText,
  MapPin,
  RefreshCw,
  Eye,
  IndianRupee,
  Building2,
  Trash2
} from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';
import { Booking, Property } from '../../types/index.ts';

interface CustomerBookingsViewProps {
  onSelectProperty?: (property: Property) => void;
  onBookProperty?: (property: Property) => void;
}

export const CustomerBookingsView: React.FC<CustomerBookingsViewProps> = ({
  onSelectProperty,
  onBookProperty
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'favourites'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favouriteProps, setFavouriteProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bookings') {
        const res = await apiClient.getBookings();
        if (res.success && res.data) {
          setBookings(res.data);
        }
      } else {
        const favRes = await apiClient.getFavourites();
        if (favRes.success && favRes.data) {
          const propsRes = await apiClient.getPublicProperties({ pageSize: 100 });
          if (propsRes.success && propsRes.data) {
            const favSet = new Set(favRes.data);
            setFavouriteProps(propsRes.data.filter(p => favSet.has(p.id)));
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking reservation?')) return;
    setActionLoadingId(bookingId);
    try {
      const res = await apiClient.cancelBooking(bookingId, 'Tenant requested cancellation via web portal');
      if (res.success && res.data) {
        setBookings(prev => prev.map(b => (b.id === bookingId ? res.data! : b)));
        setMsg('Booking reservation cancelled and room returned to available inventory.');
        setTimeout(() => setMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRemoveFavourite = async (propertyId: string) => {
    try {
      await apiClient.toggleFavourite(propertyId);
      setFavouriteProps(prev => prev.filter(p => p.id !== propertyId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#3B82F6]" />
            <span>My Bookings & Saved Stays</span>
          </h2>
          <p className="text-xs text-[#737F90] mt-0.5">
            Manage your Visakhapatnam rental reservations, monthly rent invoices, and shortlisted properties.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs font-semibold text-[#A1AAB8] hover:text-white self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#60A5FA] text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 bg-[#151A22] p-1.5 rounded-2xl border border-[#303A49] w-fit">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookings'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#A1AAB8] hover:text-white hover:bg-[#1B222D]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Reservations ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favourites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'favourites'
              ? 'bg-[#3B82F6] text-white shadow-sm'
              : 'text-[#A1AAB8] hover:text-white hover:bg-[#1B222D]'
          }`}
        >
          <Heart className="w-4 h-4 text-red-400" />
          <span>Saved Favourites ({favouriteProps.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-[#1B222D] rounded-2xl border border-[#303A49] animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'bookings' ? (
        bookings.length === 0 ? (
          <div className="text-center py-20 bg-[#151A22] rounded-2xl border border-[#303A49] p-8">
            <Calendar className="w-12 h-12 text-[#737F90] mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No active reservations yet</h3>
            <p className="text-xs text-[#737F90] mt-1 max-w-sm mx-auto">
              Explore available flats, PGs, and shared rooms across Visakhapatnam and complete booking in seconds.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#151A22] border border-[#303A49] rounded-2xl p-5 hover:border-[#3B82F6]/40 transition-colors shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  {/* Thumbnail & Title */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={booking.propertyThumbnail || '/src/assets/images/stay_modern_apartment_1793966389648.jpg'}
                      alt={booking.propertyTitle}
                      className="w-24 h-24 rounded-xl object-cover border border-[#303A49] shrink-0"
                    />

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">{booking.propertyTitle}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            booking.status === 'Confirmed'
                              ? 'bg-blue-500/20 text-[#60A5FA] border border-blue-500/30'
                              : booking.status === 'Cancelled'
                              ? 'bg-zinc-700/50 text-[#737F90] border border-zinc-600 line-through'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            booking.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-700/50 text-[#CBD5E1] border border-zinc-600'
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>

                      <div className="text-xs text-[#60A5FA] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{booking.propertyLocation}</span>
                      </div>

                      <div className="text-xs text-[#CBD5E1]">
                        Unit: <strong className="text-white">{booking.roomTypeName}</strong> • Check-in: <strong className="text-white">{booking.checkInDate}</strong> • Duration: <strong className="text-white">{booking.stayDurationMonths} mo</strong>
                      </div>

                      <div className="text-xs font-mono font-bold text-white pt-1">
                        Total Amount Due: ₹{booking.totalAmountDue.toLocaleString('en-IN')} (Rent: ₹{booking.monthlyRent} + Deposit: ₹{booking.securityDeposit})
                      </div>
                    </div>
                  </div>

                  {/* Right actions: Cancel or View Invoice */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0 self-stretch sm:self-auto border-t sm:border-t-0 border-[#303A49] pt-3 sm:pt-0">
                    <button
                      onClick={() => alert(`Official Rent Agreement & Razorpay Tax Invoice generated for Booking #${booking.id}.\nProperty: ${booking.propertyTitle}\nAmount Paid: ₹${booking.totalAmountDue}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B222D] hover:bg-[#202936] border border-[#303A49] text-xs font-medium text-[#CBD5E1] hover:text-white transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#3B82F6]" />
                      <span>Rent Receipt</span>
                    </button>

                    {booking.status !== 'Cancelled' && (
                      <button
                        disabled={actionLoadingId === booking.id}
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B222D] hover:bg-red-500/20 border border-[#303A49] text-xs font-medium text-red-400 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        favouriteProps.length === 0 ? (
          <div className="text-center py-20 bg-[#151A22] rounded-2xl border border-[#303A49] p-8">
            <Heart className="w-12 h-12 text-[#737F90] mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No saved properties yet</h3>
            <p className="text-xs text-[#737F90] mt-1 max-w-sm mx-auto">
              Click the heart icon on any Visakhapatnam property listing to save it to your wishlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favouriteProps.map((prop) => (
              <div
                key={prop.id}
                className="bg-[#151A22] border border-[#303A49] rounded-2xl overflow-hidden hover:border-[#3B82F6]/50 transition-colors flex flex-col group shadow-sm"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={prop.thumbnailUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemoveFavourite(prop.id)}
                    title="Remove from saved"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#101318]/80 backdrop-blur-sm border border-[#303A49] text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-[#101318]/90 text-[10px] font-bold text-[#60A5FA] border border-[#303A49]">
                    {prop.location.locality}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-white truncate">{prop.title}</h4>
                    <p className="text-xs text-[#737F90] line-clamp-2 mt-1 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#303A49]/60">
                    <div className="text-base font-bold text-white font-mono">
                      ₹{prop.price.toLocaleString('en-IN')}{prop.pricePerUnit}
                    </div>

                    <div className="flex items-center gap-2">
                      {onSelectProperty && (
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="px-3 py-1.5 rounded-xl bg-[#1B222D] hover:bg-[#202936] text-xs font-semibold text-white border border-[#303A49]"
                        >
                          Details
                        </button>
                      )}
                      {onBookProperty && (
                        <button
                          onClick={() => onBookProperty(prop)}
                          className="px-3 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-semibold text-white shadow"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
