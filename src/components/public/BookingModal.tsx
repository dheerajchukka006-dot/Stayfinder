import React, { useState } from 'react';
import { X, Calendar, ShieldCheck, IndianRupee, Check, AlertCircle, CreditCard, Lock } from 'lucide-react';
import { Property, Booking } from '../../types/index.ts';
import { apiClient } from '../../services/apiClient.ts';

interface BookingModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  property,
  isOpen,
  onClose,
  onBookingSuccess
}) => {
  if (!isOpen || !property) return null;

  const [selectedRoomId, setSelectedRoomId] = useState(property.roomTypes[0]?.id || '');
  const [checkInDate, setCheckInDate] = useState('2026-12-01');
  const [stayMonths, setStayMonths] = useState(3);
  const [guestsCount, setGuestsCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step in workflow: 'form' | 'payment' | 'confirmed'
  const [step, setStep] = useState<'form' | 'payment' | 'confirmed'>('form');
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card'>('UPI');

  const selectedRoom = property.roomTypes.find(r => r.id === selectedRoomId) || property.roomTypes[0];
  const monthlyRent = selectedRoom ? selectedRoom.priceMonthly : property.price;
  const securityDeposit = selectedRoom ? selectedRoom.securityDeposit : property.securityDeposit;
  const platformFee = 999;
  const totalDue = monthlyRent + securityDeposit + platformFee;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleInitiateBooking = async () => {
    setError(null);
    if (!checkInDate) {
      setError('Please select your preferred check-in date.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.createBooking({
        propertyId: property.id,
        roomTypeId: selectedRoom.id,
        checkInDate,
        stayDurationMonths: stayMonths,
        guestsCount
      });

      if (!res.success || !res.data) {
        setError(res.error || 'Unable to book inventory. It may have already been reserved.');
        setLoading(false);
        return;
      }

      setCurrentBooking(res.data);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || 'Network error occurred while reserving inventory.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!currentBooking) return;
    setLoading(true);
    setError(null);

    try {
      const mockRzpPaymentId = `pay_rzp_mock_${Date.now()}`;
      const mockRzpOrderId = `order_rzp_${Date.now()}`;

      const res = await apiClient.verifyPayment(currentBooking.id, mockRzpPaymentId, mockRzpOrderId);
      if (res.success && res.booking) {
        setCurrentBooking(res.booking);
        setStep('confirmed');
        onBookingSuccess(res.booking);
      } else {
        setError('Payment verification failed.');
      }
    } catch (err: any) {
      setError('Error verifying transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative w-full max-w-lg bg-[#151A22] border border-[#303A49] rounded-2xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#303A49] bg-[#101318] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {step === 'form' && 'Reserve Accommodation'}
              {step === 'payment' && 'Razorpay Test Sandbox'}
              {step === 'confirmed' && 'Booking Confirmed!'}
            </h2>
            <p className="text-xs text-[#737F90]">{property.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1B222D] text-[#A1AAB8] hover:text-white flex items-center justify-center border border-[#303A49]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-6">
          {step === 'form' && (
            <div className="space-y-4">
              {/* Room Choice */}
              <div>
                <label className="text-xs font-semibold text-white block mb-2">Select Room Option</label>
                <div className="space-y-2">
                  {property.roomTypes.map((rt) => {
                    const isSelected = selectedRoomId === rt.id;
                    const isAvailable = rt.availableRooms > 0;
                    return (
                      <div
                        key={rt.id}
                        onClick={() => isAvailable && setSelectedRoomId(rt.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          !isAvailable
                            ? 'opacity-40 cursor-not-allowed bg-[#101318] border-[#303A49]'
                            : isSelected
                            ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white shadow-sm'
                            : 'bg-[#1B222D] border-[#303A49] text-[#A1AAB8] hover:border-[#4B5563]'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold flex items-center gap-2">
                            <span>{rt.name}</span>
                            {isSelected && <span className="text-[10px] text-[#60A5FA]">Selected</span>}
                          </div>
                          <p className="text-[11px] text-[#737F90]">
                            {rt.type} • {rt.hasAttachedBath ? 'Attached Bath' : 'Common Bath'} • {rt.isAC ? 'AC' : 'Non-AC'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-white block">
                            {formatINR(rt.priceMonthly)}/mo
                          </span>
                          <span className={`text-[10px] ${isAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isAvailable ? `${rt.availableRooms} Left` : 'Sold Out'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dates & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Duration (Months)</label>
                  <select
                    value={stayMonths}
                    onChange={(e) => setStayMonths(Number(e.target.value))}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={11}>11 Months (Standard Agreement)</option>
                  </select>
                </div>
              </div>

              {/* Price Breakdown Snapshot */}
              <div className="p-3.5 bg-[#101318] rounded-xl border border-[#303A49] space-y-2 text-xs">
                <div className="flex justify-between text-[#A1AAB8]">
                  <span>1st Month Rent</span>
                  <span className="font-mono text-white">{formatINR(monthlyRent)}</span>
                </div>
                <div className="flex justify-between text-[#A1AAB8]">
                  <span>Refundable Security Deposit</span>
                  <span className="font-mono text-white">{formatINR(securityDeposit)}</span>
                </div>
                <div className="flex justify-between text-[#A1AAB8]">
                  <span>StayFinder Platform & Verification Fee</span>
                  <span className="font-mono text-white">{formatINR(platformFee)}</span>
                </div>
                <div className="pt-2 border-t border-[#303A49] flex justify-between font-bold text-sm text-white">
                  <span>Total Amount Payable</span>
                  <span className="font-mono text-[#60A5FA]">{formatINR(totalDue)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInitiateBooking}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 text-white text-xs font-bold transition-all shadow"
              >
                {loading ? 'Verifying Room Inventory...' : 'Lock Inventory & Proceed to Pay'}
              </button>
            </div>
          )}

          {step === 'payment' && currentBooking && (
            <div className="space-y-4">
              <div className="p-3 bg-[#101318] rounded-xl border border-[#303A49] text-center">
                <span className="text-xs text-[#737F90] uppercase tracking-wider block">Total Payable Now</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">
                  {formatINR(currentBooking.totalAmountDue)}
                </span>
                <span className="text-[10px] text-emerald-400 mt-0.5 inline-block">
                  ● Inventory Reserved for 15:00 minutes
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-2">Select Payment Method (Sandbox)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-xs text-center font-medium transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                        : 'bg-[#1B222D] border-[#303A49] text-[#A1AAB8]'
                    }`}
                  >
                    UPI / QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-xl border text-xs text-center font-medium transition-all ${
                      paymentMethod === 'Card'
                        ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                        : 'bg-[#1B222D] border-[#303A49] text-[#A1AAB8]'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#1B222D] rounded-xl border border-[#303A49] text-xs space-y-1.5 text-[#A1AAB8]">
                <div className="flex items-center gap-1.5 text-white font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Razorpay Standard Test Environment</span>
                </div>
                <p className="text-[11px] text-[#737F90]">
                  Clicking below authorizes a test transaction. Server-side idempotency and booking state will be confirmed.
                </p>
              </div>

              <button
                type="button"
                onClick={handleVerifyPayment}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow"
              >
                {loading ? 'Authorizing Sandbox Payment...' : `Simulate Razorpay Capture (${formatINR(currentBooking.totalAmountDue)})`}
              </button>
            </div>
          )}

          {step === 'confirmed' && currentBooking && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Booking Confirmed!</h3>
                <p className="text-xs text-[#A1AAB8] mt-1">
                  Reference: <span className="font-mono text-white">{currentBooking.id}</span>
                </p>
                <p className="text-xs text-[#737F90] mt-0.5">
                  Check-in Date: {currentBooking.checkInDate}
                </p>
              </div>

              <div className="p-3.5 bg-[#101318] rounded-xl border border-[#303A49] text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#737F90]">Property:</span>
                  <span className="text-white font-medium">{currentBooking.propertyTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737F90]">Room Type:</span>
                  <span className="text-white font-medium">{currentBooking.roomTypeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737F90]">Payment Status:</span>
                  <span className="text-emerald-400 font-medium">Captured via Razorpay Sandbox</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold transition-all"
              >
                View in Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
