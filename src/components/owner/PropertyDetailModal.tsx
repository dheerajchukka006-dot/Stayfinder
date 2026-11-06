import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  IndianRupee,
  Bed,
  Bath,
  Maximize2,
  Users,
  Phone,
  Mail,
  CheckCircle2,
  Send,
  Calendar,
  AlertCircle,
  Building,
  Zap,
  Droplets,
  Car,
  Compass,
  Flag,
  Tag
} from 'lucide-react';
import { Property } from '../../types/index.ts';
import { apiClient } from '../../services/apiClient.ts';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (property: Property) => void;
  currentUser?: any;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onBookNow,
  currentUser
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryName, setEnquiryName] = useState(currentUser?.name || 'Rohan Sharma');
  const [enquiryPhone, setEnquiryPhone] = useState(currentUser?.phone || '+91 99887 66554');
  const [enquiryEmail, setEnquiryEmail] = useState(currentUser?.email || 'rohan.sharma@example.com');
  const [tenantType, setTenantType] = useState('Working Professional');
  const [moveInDate, setMoveInDate] = useState('2026-12-01');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);

  // Offer State
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offeredRent, setOfferedRent] = useState('');
  const [offerDuration, setOfferDuration] = useState('11');
  const [offerNotes, setOfferNotes] = useState('');
  const [offerSending, setOfferSending] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  // Report State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<'Inaccurate Rent' | 'Fake Photos' | 'Property Not Available' | 'Owner Unresponsive' | 'Other'>('Inaccurate Rent');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSending, setReportSending] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (property) {
      setActiveImageIndex(0);
      setEnquirySent(false);
      setShowEnquiryForm(false);
      setShowOfferForm(false);
      setOfferSuccess(false);
      setOfferedRent(property.price.toString());
      // Fetch nearby Vizag properties
      apiClient.getNearbyProperties(property.location.latitude, property.location.longitude, 12)
        .then((res) => {
          if (res.success) {
            setNearbyProperties(res.data.filter(p => p.id !== property.id).slice(0, 3));
          }
        })
        .catch(() => {});
    }
  }, [property]);

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeredRent || Number(offeredRent) <= 0 || !property) return;
    setOfferSending(true);
    try {
      const res = await apiClient.createOffer({
        propertyId: property.id,
        offeredMonthlyRent: Number(offeredRent),
        proposedTenancyMonths: Number(offerDuration) || 11,
        proposedMoveInDate: moveInDate,
        notes: offerNotes
      });
      if (res.success) {
        setOfferSuccess(true);
        setTimeout(() => {
          setShowOfferForm(false);
          setOfferSuccess(false);
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOfferSending(false);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setReportSending(true);
    try {
      const res = await apiClient.reportProperty(property.id, reportReason, reportDetails);
      if (res.success) {
        setReportSuccess(true);
        setTimeout(() => {
          setShowReportModal(false);
          setReportSuccess(false);
          setReportDetails('');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportSending(false);
    }
  };

  if (!isOpen || !property) return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const imagesList = property.images && property.images.length > 0
    ? property.images
    : [property.thumbnailUrl];

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySending(true);
    try {
      const res = await apiClient.sendEnquiry({
        propertyId: property.id,
        customerName: enquiryName,
        customerPhone: enquiryPhone,
        customerEmail: enquiryEmail,
        tenantType,
        expectedMoveInDate: moveInDate,
        message: enquiryMessage || `Interested in viewing ${property.title} in ${property.location.locality}, Visakhapatnam.`
      });

      if (res.success) {
        setEnquirySent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnquirySending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative w-full max-w-4xl bg-[#151A22] border border-[#303A49] rounded-2xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
        {/* Cover Photo / Gallery */}
        <div className="relative h-72 bg-[#101318] shrink-0">
          <img
            src={imagesList[activeImageIndex] || property.thumbnailUrl}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Gallery */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#101318]/90 text-white border border-[#303A49]">
              {property.propertyType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white">
              {property.location.locality}, Visakhapatnam
            </span>
            {property.isVerified && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/90 text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified by StayFinder Vizag
              </span>
            )}
          </div>

          {/* Thumbnail preview carousel if multiple images exist */}
          {imagesList.length > 1 && (
            <div className="absolute bottom-4 right-6 flex items-center gap-1.5 bg-black/70 p-1.5 rounded-xl backdrop-blur-sm">
              {imagesList.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-10 h-7 rounded-md overflow-hidden border transition-all ${
                    activeImageIndex === idx ? 'border-[#3B82F6] scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#303A49]">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{property.title}</h2>
              <div className="flex items-center gap-1.5 text-xs text-[#A1AAB8] mt-1.5">
                <MapPin className="w-4 h-4 text-[#3B82F6]" />
                <span>
                  {property.location.address}, {property.location.locality}, Visakhapatnam, Andhra Pradesh — {property.location.pincode}
                </span>
              </div>
              {property.location.landmark && (
                <p className="text-[11px] text-[#737F90] mt-0.5 ml-5">
                  Landmark: {property.location.landmark}
                </p>
              )}
            </div>

            <div className="text-left md:text-right shrink-0">
              <div className="text-2xl font-bold text-white font-mono">
                {formatINR(property.price)}
                <span className="text-xs text-[#737F90] font-normal ml-1">{property.pricePerUnit}</span>
              </div>
              <p className="text-[11px] text-[#A1AAB8] font-mono mt-0.5">
                Security Deposit: {formatINR(property.securityDeposit)}
              </p>
            </div>
          </div>

          {/* Key Property Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-[#1B222D] rounded-xl border border-[#303A49]">
            <div className="text-center">
              <span className="text-[10px] text-[#737F90] uppercase block">Bedrooms</span>
              <span className="text-sm font-bold text-white font-mono">{property.bedrooms} BHK</span>
            </div>
            <div className="text-center border-l border-[#303A49]">
              <span className="text-[10px] text-[#737F90] uppercase block">Bathrooms</span>
              <span className="text-sm font-bold text-white font-mono">{property.bathrooms} Baths</span>
            </div>
            <div className="text-center border-l border-[#303A49]">
              <span className="text-[10px] text-[#737F90] uppercase block">Balconies</span>
              <span className="text-sm font-bold text-white font-mono">{property.balconies || 1}</span>
            </div>
            <div className="text-center border-l border-[#303A49]">
              <span className="text-[10px] text-[#737F90] uppercase block">Built-up</span>
              <span className="text-sm font-bold text-white font-mono">{property.areaSqFt} sq.ft.</span>
            </div>
            <div className="text-center border-l border-[#303A49] col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#737F90] uppercase block">Furnishing</span>
              <span className="text-xs font-semibold text-white truncate block">{property.furnishingStatus}</span>
            </div>
          </div>

          {/* Rental Pricing & Utility Charges Breakdown */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2.5">
              Rent & Utility Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#1B222D] rounded-xl border border-[#303A49] text-xs">
              <div>
                <span className="text-[#737F90] block mb-0.5">Monthly Maintenance</span>
                <span className="font-mono text-white font-semibold">
                  {property.utilityCharges?.maintenanceCharges ? formatINR(property.utilityCharges.maintenanceCharges) : '₹0 / Included'}
                </span>
              </div>
              <div className="border-l border-[#303A49] pl-3">
                <span className="text-[#737F90] block mb-0.5">Electricity Charges</span>
                <span className="text-white font-medium">
                  {property.utilityCharges?.electricityCharges || 'As per APEPDCL sub-meter'}
                </span>
              </div>
              <div className="border-l border-[#303A49] pl-3">
                <span className="text-[#737F90] block mb-0.5">Water Supply</span>
                <span className="text-white font-medium">
                  {property.utilityCharges?.waterCharges || 'Included in rent (24/7 GVMC)'}
                </span>
              </div>
            </div>
          </div>

          {/* Accommodation Suitability & Rules */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2.5">
              Tenant Suitability & Guidelines
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                property.tenantPreferences?.familiesAllowed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#1B222D] border-[#303A49] text-[#737F90]'
              }`}>
                {property.tenantPreferences?.familiesAllowed ? '✓ Families Welcomed' : '✗ No Families'}
              </span>

              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                property.tenantPreferences?.bachelorFriendly
                  ? 'bg-blue-500/10 border-blue-500/30 text-[#60A5FA]'
                  : 'bg-[#1B222D] border-[#303A49] text-[#737F90]'
              }`}>
                {property.tenantPreferences?.bachelorFriendly ? '✓ Bachelor Friendly' : '✗ Family Only'}
              </span>

              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                property.tenantPreferences?.studentsAllowed
                  ? 'bg-blue-500/10 border-blue-500/30 text-[#60A5FA]'
                  : 'bg-[#1B222D] border-[#303A49] text-[#737F90]'
              }`}>
                {property.tenantPreferences?.studentsAllowed ? '✓ Students Allowed' : '✗ Professionals Only'}
              </span>

              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                property.tenantPreferences?.petsAllowed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#1B222D] border-[#303A49] text-[#737F90]'
              }`}>
                {property.tenantPreferences?.petsAllowed ? '✓ Pets Allowed' : '✗ No Pets'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Description</h3>
            <p className="text-xs text-[#A1AAB8] leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2.5">
              Available Amenities ({property.amenities.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#1B222D] border border-[#303A49] text-xs text-[#A1AAB8]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Customer Enquiry Form */}
          <div className="p-4 bg-[#1B222D] border border-[#303A49] rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Send Direct Rental Enquiry to Owner</span>
                </h4>
                <p className="text-[11px] text-[#737F90]">Connect with {property.ownerName} without brokers</p>
              </div>
              <div className="flex items-center gap-2">
                {!showEnquiryForm && !showOfferForm && !enquirySent && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEnquiryForm(true);
                        setShowOfferForm(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1B222D] hover:bg-[#202936] border border-[#303A49] text-white text-xs font-semibold transition-colors"
                    >
                      Write Enquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowOfferForm(true);
                        setShowEnquiryForm(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Make an Offer</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {offerSuccess && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-[#60A5FA] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Your rental offer was submitted to {property.ownerName}! You will receive updates in My Bookings.</span>
              </div>
            )}

            {showOfferForm && !offerSuccess && (
              <form onSubmit={handleSendOffer} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-[#A1AAB8] block mb-0.5">Offered Monthly Rent (₹) *</label>
                    <input
                      type="number"
                      required
                      value={offeredRent}
                      onChange={(e) => setOfferedRent(e.target.value)}
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-[#3B82F6]"
                    />
                    <div className="text-[10px] text-[#737F90] mt-0.5">
                      Current listed rent: ₹{property.price.toLocaleString('en-IN')}/mo
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#A1AAB8] block mb-0.5">Tenancy Duration</label>
                    <select
                      value={offerDuration}
                      onChange={(e) => setOfferDuration(e.target.value)}
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value="6">6 Months</option>
                      <option value="11">11 Months (Standard)</option>
                      <option value="12">12 Months (1 Year)</option>
                      <option value="24">24 Months (2 Years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#A1AAB8] block mb-0.5">Proposed Move-in Date</label>
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#A1AAB8] block mb-0.5">Negotiation Notes / Upfront Terms</label>
                  <textarea
                    rows={2}
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    placeholder="e.g. Willing to pay 3 months advance rent upfront if monthly rent is ₹17,000..."
                    className="w-full bg-[#151C26] border border-[#303A49] rounded-lg p-2 text-xs text-white focus:border-[#3B82F6]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOfferForm(false)}
                    className="px-3 py-1 text-xs text-[#A1AAB8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={offerSending}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{offerSending ? 'Submitting...' : 'Submit Rental Offer'}</span>
                  </button>
                </div>
              </form>
            )}

            {enquirySent && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Your enquiry was sent directly to {property.ownerName}. They will contact you shortly!</span>
              </div>
            )}

            {showEnquiryForm && !enquirySent && (
              <form onSubmit={handleSendEnquiry} className="space-y-3 pt-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-[#737F90] block mb-0.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#737F90] block mb-0.5">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#737F90] block mb-0.5">Expected Move-in</label>
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#737F90] block mb-0.5">Message / Visit Preference</label>
                  <textarea
                    rows={2}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Hello, I would like to schedule a physical inspection this Saturday..."
                    className="w-full bg-[#151C26] border border-[#303A49] rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEnquiryForm(false)}
                    className="px-3 py-1 text-xs text-[#A1AAB8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={enquirySending}
                    className="px-4 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow"
                  >
                    {enquirySending ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Nearby Similar Properties in Vizag */}
          {nearbyProperties.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Nearby Properties in Visakhapatnam</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nearbyProperties.map((np) => (
                  <div
                    key={np.id}
                    className="p-3 bg-[#1B222D] border border-[#303A49] rounded-xl hover:border-[#3B82F6]/50 transition-colors"
                  >
                    <img
                      src={np.thumbnailUrl}
                      alt={np.title}
                      className="w-full aspect-[16/10] object-cover rounded-lg mb-2"
                    />
                    <h5 className="text-xs font-bold text-white truncate">{np.title}</h5>
                    <p className="text-[11px] text-[#737F90]">{np.location.locality}</p>
                    <p className="text-xs font-mono font-bold text-[#60A5FA] mt-1">{formatINR(np.price)}/mo</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Owner Profile & Action Bar */}
          <div className="p-4 bg-[#1B222D] border border-[#303A49] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 text-[#60A5FA] font-bold flex items-center justify-center border border-[#3B82F6]/30">
                {property.ownerName.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{property.ownerName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3B82F6]/20 text-[#60A5FA]">Verified Owner</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#737F90] mt-0.5">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {property.ownerPhone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {property.ownerEmail}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-1 px-3 py-2 text-xs text-[#737F90] hover:text-red-400 transition-colors"
                title="Report inaccurate details or scam"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Report Listing</span>
              </button>

              {onBookNow && (
                <button
                  onClick={() => {
                    onClose();
                    onBookNow(property);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold shadow-md transition-all whitespace-nowrap text-center"
                >
                  Proceed to Book Online
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151A22] border border-[#303A49] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400">
                <Flag className="w-4 h-4" />
                <h4 className="text-sm font-bold text-white">Report Listing</h4>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-[#737F90] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#737F90]">
              Help keep StayFinder safe. Reported listings are audited by our Visakhapatnam field team within 24 hours.
            </p>

            {reportSuccess ? (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#60A5FA] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Report submitted. Our moderation team has flagged this property for audit.</span>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A1AAB8]">Reason for Report *</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Inaccurate Rent">Inaccurate Rent / Hidden Charges</option>
                    <option value="Fake Photos">Fake or Misleading Photos</option>
                    <option value="Property Not Available">Property Already Occupied / Not Available</option>
                    <option value="Owner Unresponsive">Owner Unresponsive / Wrong Phone Number</option>
                    <option value="Other">Other Policy Violation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#A1AAB8]">Additional Context</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide specific details about what is inaccurate..."
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-1.5 rounded-xl bg-[#1B222D] text-xs text-[#A1AAB8] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportSending}
                    className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow disabled:opacity-50"
                  >
                    {reportSending ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
