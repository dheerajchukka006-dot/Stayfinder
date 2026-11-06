import React, { useState, useEffect } from 'react';
import {
  X,
  Building,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Maximize2,
  Check,
  AlertCircle,
  Save,
  CheckCircle2
} from 'lucide-react';
import { Property, PropertyType, RentalPeriod, PropertyStatus, VIZAG_LOCALITIES } from '../../types/index.ts';

interface EditPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: Property) => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen || !property) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form states initialized with existing property data
  const [title, setTitle] = useState(property.title);
  const [description, setDescription] = useState(property.description);
  const [propertyType, setPropertyType] = useState<PropertyType>(property.propertyType);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(property.rentalPeriod);
  const [status, setStatus] = useState<PropertyStatus>(property.status);
  const [price, setPrice] = useState(property.price.toString());
  const [securityDeposit, setSecurityDeposit] = useState(property.securityDeposit.toString());
  const [bedrooms, setBedrooms] = useState(property.bedrooms.toString());
  const [bathrooms, setBathrooms] = useState(property.bathrooms.toString());
  const [areaSqFt, setAreaSqFt] = useState(property.areaSqFt.toString());
  const [furnishingStatus, setFurnishingStatus] = useState(property.furnishingStatus);
  const [locality, setLocality] = useState(property.location.locality);
  const [address, setAddress] = useState(property.location.address);
  const [maintenanceCharges, setMaintenanceCharges] = useState(
    (property.utilityCharges?.maintenanceCharges || 0).toString()
  );
  const [electricityCharges, setElectricityCharges] = useState(
    property.utilityCharges?.electricityCharges || 'As per meter'
  );
  const [waterCharges, setWaterCharges] = useState(
    property.utilityCharges?.waterCharges || 'Included'
  );
  const [amenities, setAmenities] = useState<string[]>(property.amenities || []);

  const allAmenities = [
    'Wi-Fi',
    'Air conditioning',
    'Washing machine',
    'Refrigerator',
    'Bed',
    'Wardrobe',
    'Geyser',
    'Parking',
    'CCTV',
    'Security',
    'Power backup',
    'Water supply',
    'Lift',
    'Attached bathroom',
    'Balcony',
    'Pet allowed'
  ];

  const toggleAmenity = (name: string) => {
    setAmenities(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Property title is required');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Please enter a valid monthly rent in INR');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updates: Partial<Property> = {
        title,
        description,
        propertyType,
        rentalPeriod,
        status,
        price: Number(price),
        securityDeposit: Number(securityDeposit) || Number(price) * 2,
        bedrooms: Number(bedrooms) || 1,
        bathrooms: Number(bathrooms) || 1,
        areaSqFt: Number(areaSqFt) || 800,
        furnishingStatus: furnishingStatus as any,
        location: {
          ...property.location,
          locality,
          address
        },
        utilityCharges: {
          maintenanceCharges: Number(maintenanceCharges) || 0,
          electricityCharges,
          waterCharges,
          otherAdditionalFees: 0
        },
        amenities
      };

      const res = await fetch(`/api/v1/owner/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();

      if (data.success && data.data) {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          onSuccess(data.data);
          onClose();
        }, 800);
      } else {
        setError(data.error || 'Failed to update property');
      }
    } catch (err: any) {
      setError(err.message || 'Network error updating property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#151A22] border border-[#303A49] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#303A49] flex items-center justify-between shrink-0 bg-[#151A22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Property Listing</h2>
              <p className="text-xs text-[#737F90]">{property.location.locality}, Visakhapatnam (ID: {property.id})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1B222D] border border-[#303A49] text-[#737F90] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#60A5FA] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Property updated successfully in database!</span>
            </div>
          )}

          {/* Title & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">Property Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="Published">Published</option>
                <option value="Pending verification">Pending Verification</option>
                <option value="Under Offer">Under Offer / Reserved</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Pricing & Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8] flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" /> Monthly Rent (₹) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white font-mono focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">Security Deposit (₹)</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white font-mono focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">Maintenance (₹/mo)</label>
              <input
                type="number"
                value={maintenanceCharges}
                onChange={(e) => setMaintenanceCharges(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white font-mono focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          {/* Specs: Type, Beds, Baths, Area */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">Category</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent House</option>
                <option value="Individual Room">Individual Room</option>
                <option value="PG">PG</option>
                <option value="Hostel">Hostel</option>
                <option value="Studio">Studio</option>
                <option value="Co-living">Co-living</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8] flex items-center gap-1">
                <Bed className="w-3 h-3" /> Bedrooms
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8] flex items-center gap-1">
                <Bath className="w-3 h-3" /> Bathrooms
              </label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8] flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> Area (sq.ft)
              </label>
              <input
                type="number"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white font-mono focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          {/* Location & Locality in Vizag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#3B82F6]" /> Vizag Locality
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              >
                {VIZAG_LOCALITIES.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.pincode})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A1AAB8]">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-sm text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A1AAB8]">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs text-white focus:outline-none focus:border-[#3B82F6] leading-relaxed"
            />
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A1AAB8]">Included Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {allAmenities.map((amenity) => {
                const isSelected = amenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors border text-left ${
                      isSelected
                        ? 'bg-[#3B82F6]/15 border-[#3B82F6]/40 text-[#60A5FA]'
                        : 'bg-[#1B222D] border-[#303A49] text-[#737F90] hover:text-[#A1AAB8]'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                          : 'border-[#303A49]'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-[#303A49] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1B222D] border border-[#303A49] text-xs font-semibold text-[#A1AAB8] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-xs font-semibold text-white shadow disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
