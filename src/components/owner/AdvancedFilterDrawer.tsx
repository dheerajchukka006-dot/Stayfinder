import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Plus, Minus, Check, MapPin, ShieldCheck } from 'lucide-react';
import { PropertyFilterParams, PropertyType, RentalPeriod, VIZAG_LOCALITIES } from '../../types/index.ts';

interface AdvancedFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertyFilterParams;
  onApplyFilters: (newFilters: PropertyFilterParams) => void;
  onResetFilters: () => void;
}

export const AdvancedFilterDrawer: React.FC<AdvancedFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters
}) => {
  const [locality, setLocality] = useState<string>(filters.locality || 'All');
  const [propertyType, setPropertyType] = useState<PropertyType | 'All'>(filters.propertyType || 'All');
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod | 'All'>(filters.rentalPeriod || 'All');
  const [minPrice, setMinPrice] = useState<number>(filters.minPrice || 5000);
  const [maxPrice, setMaxPrice] = useState<number>(filters.maxPrice || 60000);
  const [bedrooms, setBedrooms] = useState<number>(filters.bedrooms || 0);
  const [bathrooms, setBathrooms] = useState<number>(filters.bathrooms || 0);
  const [minArea, setMinArea] = useState<number>(filters.minArea || 200);
  const [maxArea, setMaxArea] = useState<number>(filters.maxArea || 3000);
  const [furnishingStatus, setFurnishingStatus] = useState<string>(filters.furnishingStatus || 'All');
  const [bachelorFriendly, setBachelorFriendly] = useState<boolean>(Boolean(filters.bachelorFriendly));
  const [familySuitable, setFamilySuitable] = useState<boolean>(Boolean(filters.familySuitable));
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(Boolean(filters.verifiedOnly));
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);

  useEffect(() => {
    setLocality(filters.locality || 'All');
    setPropertyType(filters.propertyType || 'All');
    setRentalPeriod(filters.rentalPeriod || 'All');
    setMinPrice(filters.minPrice || 5000);
    setMaxPrice(filters.maxPrice || 60000);
    setBedrooms(filters.bedrooms || 0);
    setBathrooms(filters.bathrooms || 0);
    setMinArea(filters.minArea || 200);
    setMaxArea(filters.maxArea || 3000);
    setFurnishingStatus(filters.furnishingStatus || 'All');
    setBachelorFriendly(Boolean(filters.bachelorFriendly));
    setFamilySuitable(Boolean(filters.familySuitable));
    setVerifiedOnly(Boolean(filters.verifiedOnly));
    setSelectedAmenities(filters.amenities || []);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const propertyTypeOptions: PropertyType[] = [
    'Apartment',
    'Independent House',
    'Individual Room',
    'PG',
    'Hostel',
    'Boys Accommodation',
    'Girls Accommodation',
    'Family Accommodation',
    'Shared Room',
    'Private Room',
    'Studio',
    'Co-living',
    'Short-term Stay'
  ];

  const rentalPeriodOptions: { label: string; value: RentalPeriod | 'All' }[] = [
    { label: 'All', value: 'All' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' }
  ];

  const amenityOptions = [
    'Wi-Fi',
    'Air conditioning',
    'Parking',
    'Security',
    'Power backup',
    'Water supply',
    'Food available',
    'Laundry',
    'Attached bathroom',
    'Kitchen',
    'Geyser',
    'CCTV'
  ];

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      ...filters,
      locality,
      propertyType,
      rentalPeriod,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      furnishingStatus,
      bachelorFriendly,
      familySuitable,
      verifiedOnly,
      amenities: selectedAmenities,
      page: 1
    });
    onClose();
  };

  const handleReset = () => {
    setLocality('All');
    setPropertyType('All');
    setRentalPeriod('All');
    setMinPrice(5000);
    setMaxPrice(60000);
    setBedrooms(0);
    setBathrooms(0);
    setMinArea(200);
    setMaxArea(3000);
    setFurnishingStatus('All');
    setBachelorFriendly(false);
    setFamilySuitable(false);
    setVerifiedOnly(false);
    setSelectedAmenities([]);
    onResetFilters();
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" />

      <div className="relative w-full max-w-md bg-[#151A22] border-l border-[#303A49] text-white flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="h-16 px-6 border-b border-[#303A49] flex items-center justify-between shrink-0 bg-[#101318]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Vizag Rental Filters</h2>
            <p className="text-xs text-[#737F90]">Visakhapatnam Accommodation Search</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1B222D] hover:bg-[#202936] text-[#A1AAB8] hover:text-white flex items-center justify-center border border-[#303A49] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Section: Visakhapatnam Locality Filter */}
          <div>
            <label className="text-xs font-semibold text-white uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Vizag Locality</span>
            </label>
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
            >
              <option value="All">All Vizag Localities (25 Areas)</option>
              {VIZAG_LOCALITIES.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} (Pin: {loc.pincode})
                </option>
              ))}
            </select>
          </div>

          {/* Section: Verified Only */}
          <div className="p-3 bg-[#1B222D] rounded-xl border border-[#303A49] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-xs font-medium text-white">Verified Properties Only</span>
            </div>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-[#3B82F6] w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Section: Property Category */}
          <div>
            <label className="text-xs font-semibold text-white uppercase tracking-wider block mb-2.5">
              Property Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPropertyType('All')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                  propertyType === 'All'
                    ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm'
                    : 'bg-[#1B222D] text-[#A1AAB8] border-[#303A49] hover:text-white'
                }`}
              >
                All Categories
              </button>
              {propertyTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-left transition-all truncate ${
                    propertyType === type
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm'
                      : 'bg-[#1B222D] text-[#A1AAB8] border-[#303A49] hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Rental Period */}
          <div>
            <label className="text-xs font-semibold text-white uppercase tracking-wider block mb-2">
              Rental Period
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#101318] rounded-xl border border-[#303A49]">
              {rentalPeriodOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRentalPeriod(opt.value)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                    rentalPeriod === opt.value
                      ? 'bg-[#3B82F6] text-white shadow-sm'
                      : 'text-[#A1AAB8] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Monthly Rent Dual Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white uppercase tracking-wider">
                Monthly Rent (INR ₹)
              </label>
              <span className="text-xs font-mono font-medium text-[#60A5FA]">
                {formatINR(minPrice)} — {formatINR(maxPrice)}
              </span>
            </div>
            <div className="space-y-3 bg-[#1B222D] p-3 rounded-xl border border-[#303A49]">
              <input
                type="range"
                min="5000"
                max="80000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#3B82F6] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#737F90] font-mono">
                <span>₹5,000</span>
                <span>₹40,000</span>
                <span>₹80,000+</span>
              </div>
            </div>
          </div>

          {/* Section: Tenant Suitability */}
          <div>
            <label className="text-xs font-semibold text-white uppercase tracking-wider block mb-2">
              Suitability
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFamilySuitable(!familySuitable)}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                  familySuitable ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white' : 'bg-[#1B222D] border-[#303A49] text-[#A1AAB8]'
                }`}
              >
                Family Suitable
              </button>
              <button
                type="button"
                onClick={() => setBachelorFriendly(!bachelorFriendly)}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                  bachelorFriendly ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white' : 'bg-[#1B222D] border-[#303A49] text-[#A1AAB8]'
                }`}
              >
                Bachelor Friendly
              </button>
            </div>
          </div>

          {/* Section: Rooms Stepper */}
          <div>
            <label className="text-xs font-semibold text-white uppercase tracking-wider block mb-2.5">
              Bedrooms & Bathrooms
            </label>
            <div className="space-y-3 bg-[#1B222D] p-3.5 rounded-xl border border-[#303A49]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-white block">Bedrooms</span>
                  <span className="text-[11px] text-[#737F90]">{bedrooms === 0 ? 'Any BHK' : `${bedrooms}+ BHK`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
                    className="w-7 h-7 rounded-lg bg-[#151C26] border border-[#303A49] flex items-center justify-center text-[#A1AAB8]"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">{bedrooms === 0 ? 'Any' : bedrooms}</span>
                  <button
                    type="button"
                    onClick={() => setBedrooms(bedrooms + 1)}
                    className="w-7 h-7 rounded-lg bg-[#151C26] border border-[#303A49] flex items-center justify-center text-[#A1AAB8]"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Amenities */}
          <div>
            <label className="text-xs font-semibold text-white uppercase tracking-wider block mb-2.5">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {amenityOptions.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      checked
                        ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                        : 'bg-[#1B222D] border-[#303A49] text-[#A1AAB8] hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center ${
                        checked ? 'bg-[#3B82F6] text-white' : 'border border-[#4B5563]'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-[#303A49] bg-[#101318] flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1B222D] text-[#A1AAB8] border border-[#303A49] text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-sm"
          >
            Apply Vizag Filters
          </button>
        </div>
      </div>
    </div>
  );
};
