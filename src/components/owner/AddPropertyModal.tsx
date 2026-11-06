import React, { useState } from 'react';
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
  Upload,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Compass,
  FileText
} from 'lucide-react';
import { PropertyType, RentalPeriod, VIZAG_LOCALITIES, PropertyImage } from '../../types/index.ts';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'basic' | 'location' | 'pricing_specs' | 'rules_amenities' | 'images'>('basic');

  // Basic Details
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>('Monthly');
  const [description, setDescription] = useState('');
  const [ownerName, setOwnerName] = useState('Suresh Varma');
  const [ownerPhone, setOwnerPhone] = useState('+91 94401 23456');

  // Location (Visakhapatnam, Andhra Pradesh default)
  const [locality, setLocality] = useState<string>('MVP Colony');
  const [isCustomLocality, setIsCustomLocality] = useState(false);
  const [customLocalityText, setCustomLocalityText] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('530017');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState(17.7423);
  const [longitude, setLongitude] = useState(83.3338);

  // Property Details & Specs
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [balconies, setBalconies] = useState('1');
  const [areaSqFt, setAreaSqFt] = useState('1200');
  const [furnishingStatus, setFurnishingStatus] = useState<'Fully Furnished' | 'Semi Furnished' | 'Unfurnished'>('Semi Furnished');
  const [floorNumber, setFloorNumber] = useState('2');
  const [totalFloors, setTotalFloors] = useState('5');
  const [parkingAvailability, setParkingAvailability] = useState<'Car & 2-Wheeler' | '2-Wheeler Only' | 'Car Only' | 'None'>('Car & 2-Wheeler');
  const [liftAvailable, setLiftAvailable] = useState(true);
  const [propertyAge, setPropertyAge] = useState('1-5 years');

  // Pricing & Utilities
  const [monthlyRent, setMonthlyRent] = useState('18000');
  const [dailyRent, setDailyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('36000');
  const [maintenanceCharges, setMaintenanceCharges] = useState('1500');
  const [electricityCharges, setElectricityCharges] = useState('As per APEPDCL sub-meter');
  const [waterCharges, setWaterCharges] = useState('Included in rent');
  const [foodCharges, setFoodCharges] = useState('');

  // Accommodation Preferences
  const [bachelorsAllowed, setBachelorsAllowed] = useState(true);
  const [familiesAllowed, setFamiliesAllowed] = useState(true);
  const [studentsAllowed, setStudentsAllowed] = useState(true);
  const [professionalsAllowed, setProfessionalsAllowed] = useState(true);
  const [boysAllowed, setBoysAllowed] = useState(true);
  const [girlsAllowed, setGirlsAllowed] = useState(true);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [foodAvailable, setFoodAvailable] = useState(false);
  const [foodType, setFoodType] = useState<'Veg Only' | 'Veg & Non-Veg' | 'Self Cooking' | 'None'>('None');

  // Amenities
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
    'Attached bathroom',
    'Kitchen',
    'Furnished rooms'
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Wi-Fi',
    'Parking',
    'Security',
    'Power backup',
    'Water supply',
    'Attached bathroom'
  ]);

  // Multiple Property Photographs
  const [uploadedImages, setUploadedImages] = useState<PropertyImage[]>([
    {
      id: 'img-1',
      url: '/src/assets/images/stay_modern_apartment_1793966389648.jpg',
      tag: 'Living Room',
      caption: 'Main living hall with balcony ventilation'
    }
  ]);

  if (!isOpen) return null;

  // Handle local file upload (base64 Data URL so genuine user uploads work immediately)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg: PropertyImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            url: event.target.result as string,
            tag: 'Exterior',
            caption: file.name
          };
          setUploadedImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const updateImageTag = (id: string, tag: PropertyImage['tag']) => {
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, tag } : img))
    );
  };

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  // Locality change auto-populates coordinates and pincode
  const handleLocalitySelect = (locName: string) => {
    if (locName === '__custom__') {
      setIsCustomLocality(true);
      return;
    }
    setIsCustomLocality(false);
    setLocality(locName);
    const found = VIZAG_LOCALITIES.find((l) => l.name === locName);
    if (found) {
      setPincode(found.pincode);
      setLatitude(found.latitude);
      setLongitude(found.longitude);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocality = isCustomLocality ? customLocalityText.trim() : locality;

    if (!title.trim() || !address.trim() || !finalLocality || !monthlyRent) {
      setError('Please provide all mandatory fields: Property Title, Locality, Address, and Monthly Rent.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      title,
      description: description || `Well-maintained ${propertyType} in ${finalLocality}, Visakhapatnam.`,
      propertyType,
      rentalPeriod,
      price: Number(monthlyRent),
      dailyRent: dailyRent ? Number(dailyRent) : undefined,
      securityDeposit: securityDeposit ? Number(securityDeposit) : Number(monthlyRent) * 2,
      utilityCharges: {
        maintenanceCharges: Number(maintenanceCharges) || 0,
        electricityCharges,
        waterCharges,
        foodCharges: foodCharges ? Number(foodCharges) : undefined
      },
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      balconies: Number(balconies) || 0,
      totalRooms: (Number(bedrooms) || 1) + 1,
      areaSqFt: Number(areaSqFt) || 800,
      furnishingStatus,
      floorNumber: Number(floorNumber) || 1,
      totalFloors: Number(totalFloors) || 4,
      parkingAvailability,
      liftAvailable,
      propertyAge,
      genderPreference: 'All',
      tenantPreferences: {
        boysAllowed,
        girlsAllowed,
        familiesAllowed,
        studentsAllowed,
        professionalsAllowed,
        bachelorFriendly: bachelorsAllowed,
        petsAllowed,
        smokingAllowed
      },
      foodAvailable,
      foodType: foodAvailable ? foodType : 'None',
      thumbnailUrl: uploadedImages[0]?.url || '/src/assets/images/stay_modern_apartment_1793966389648.jpg',
      images: uploadedImages.map((img) => img.url),
      imageDetails: uploadedImages,
      location: {
        address,
        locality: finalLocality,
        city: 'Visakhapatnam',
        state: 'Andhra Pradesh',
        pincode,
        latitude,
        longitude,
        landmark: landmark || `Near ${finalLocality} center`
      },
      amenities: selectedAmenities,
      roomTypes: [
        {
          id: `rt-${Date.now()}`,
          name: `${bedrooms} BHK Unit`,
          type: 'Entire Flat',
          priceMonthly: Number(monthlyRent),
          securityDeposit: securityDeposit ? Number(securityDeposit) : Number(monthlyRent) * 2,
          capacity: (Number(bedrooms) || 1) * 2,
          totalRooms: 1,
          availableRooms: 1,
          hasAttachedBath: true,
          hasBalcony: Number(balconies) > 0,
          isAC: selectedAmenities.includes('Air conditioning')
        }
      ],
      houseRules: ['Standard Visakhapatnam residential bylaws apply', 'Notice period of 1 month']
    };

    const ok = await onSubmit(payload);
    setLoading(false);
    if (ok) {
      onClose();
    } else {
      setError('Failed to create property. Please verify your connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative w-full max-w-3xl bg-[#151A22] border border-[#303A49] rounded-2xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#303A49] bg-[#101318] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">List Rental Property</h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-[#60A5FA] border border-blue-500/30">
                  Vizag Launch Market
                </span>
              </div>
              <p className="text-xs text-[#737F90]">Visakhapatnam, Andhra Pradesh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1B222D] hover:bg-[#202936] text-[#A1AAB8] hover:text-white flex items-center justify-center border border-[#303A49]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="px-6 py-2 bg-[#12161D] border-b border-[#303A49] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'basic', label: '1. Basic Info' },
            { id: 'location', label: '2. Vizag Locality' },
            { id: 'pricing_specs', label: '3. Pricing & Specs' },
            { id: 'rules_amenities', label: '4. Preferences & Amenities' },
            { id: 'images', label: `5. Photos (${uploadedImages.length})` }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(s.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
                activeStep === s.id
                  ? 'bg-[#3B82F6] text-white shadow-sm'
                  : 'text-[#A1AAB8] hover:text-white hover:bg-[#1B222D]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: BASIC INFO */}
          {activeStep === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Property Title / Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. MVP Colony Sector 6 Spacious 2 BHK Corner Flat"
                  className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#737F90] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Property Category</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Individual Room">Individual Rental Room</option>
                    <option value="PG">PG Accommodation</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Boys Accommodation">Boys Accommodation</option>
                    <option value="Girls Accommodation">Girls Accommodation</option>
                    <option value="Family Accommodation">Family Accommodation</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Studio">Studio Apartment</option>
                    <option value="Co-living">Co-living Accommodation</option>
                    <option value="Short-term Stay">Short-term Rental</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Rental Period</label>
                  <select
                    value={rentalPeriod}
                    onChange={(e) => setRentalPeriod(e.target.value as RentalPeriod)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  >
                    <option value="Monthly">Monthly Rent</option>
                    <option value="Daily">Daily Rent (Short-term)</option>
                    <option value="Yearly">Yearly Lease</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">Property Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe ventilation, proximity to beach / IT SEZ / colleges, water supply, and society atmosphere..."
                  className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl p-3 text-xs text-white placeholder-[#737F90] focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Owner Contact Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Owner Phone</label>
                  <input
                    type="text"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep('location')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold"
                >
                  <span>Next: Locality</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VIZAG LOCALITY & LOCATION */}
          {activeStep === 'location' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-[#60A5FA] flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#3B82F6]" />
                <span>Primary Launch Market: Visakhapatnam (Vizag), Andhra Pradesh</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Visakhapatnam Locality <span className="text-rose-400">*</span>
                </label>
                {!isCustomLocality ? (
                  <div className="space-y-2">
                    <select
                      value={locality}
                      onChange={(e) => handleLocalitySelect(e.target.value)}
                      className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                    >
                      {VIZAG_LOCALITIES.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name} (Pin: {loc.pincode}) — {loc.description}
                        </option>
                      ))}
                      <option value="__custom__">+ Enter another Vizag locality / suburb...</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCustomLocality(true)}
                      className="text-[11px] text-[#3B82F6] hover:underline"
                    >
                      Can't find your area? Click to type custom locality
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={customLocalityText}
                      onChange={(e) => setCustomLocalityText(e.target.value)}
                      placeholder="Enter custom locality in Vizag (e.g. Endada, Sagar Nagar, Vepagunta)"
                      className="flex-1 bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomLocality(false)}
                      className="px-3 py-2 bg-[#202936] text-[#A1AAB8] text-xs rounded-xl hover:text-white"
                    >
                      Choose from list
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Street Address & House / Flat No. <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 302, Sai Balaji Enclave, Road No 4"
                  className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Postal Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Nearby Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite AS Raja College, Near Apollo"
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Geo-Coordinates (PostGIS) */}
              <div className="p-3 bg-[#1B222D] rounded-xl border border-[#303A49] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Geographic Coordinates (PostGIS Discovery)</span>
                  </span>
                  <span className="text-[11px] text-[#737F90]">Auto-mapped from locality</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-[#737F90] block mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#737F90] block mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep('basic')}
                  className="px-4 py-2 rounded-xl bg-[#1B222D] text-[#A1AAB8] text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('pricing_specs')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold"
                >
                  <span>Next: Pricing & Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRICING & SPECIFICATIONS */}
          {activeStep === 'pricing_specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">
                    Monthly Rent (₹ INR) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#737F90]">₹</span>
                    <input
                      type="number"
                      required
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Security Deposit (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#737F90]">₹</span>
                    <input
                      type="number"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(e.target.value)}
                      className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Maintenance Fee (₹/mo)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#737F90]">₹</span>
                    <input
                      type="number"
                      value={maintenanceCharges}
                      onChange={(e) => setMaintenanceCharges(e.target.value)}
                      className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Utility Charges Breakdown */}
              <div className="p-3.5 bg-[#1B222D] rounded-xl border border-[#303A49] space-y-3">
                <span className="text-xs font-semibold text-white block">Utilities Breakdown</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-[#A1AAB8] block mb-1">Electricity Billing</label>
                    <input
                      type="text"
                      value={electricityCharges}
                      onChange={(e) => setElectricityCharges(e.target.value)}
                      placeholder="e.g. As per APEPDCL sub-meter / Included"
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#A1AAB8] block mb-1">Water Supply Billing</label>
                    <input
                      type="text"
                      value={waterCharges}
                      onChange={(e) => setWaterCharges(e.target.value)}
                      placeholder="e.g. Included in rent / 24/7 GVMC supply"
                      className="w-full bg-[#151C26] border border-[#303A49] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Rooms & Built-up Specs */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Bedrooms</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Bathrooms</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Balconies</label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={balconies}
                    onChange={(e) => setBalconies(e.target.value)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Area (sq.ft.)</label>
                  <input
                    type="number"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(e.target.value)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-3 py-2 text-xs font-mono text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Floor, Parking & Lift */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Floor No. / Total</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={floorNumber}
                      onChange={(e) => setFloorNumber(e.target.value)}
                      placeholder="Floor"
                      className="w-1/2 bg-[#1B222D] border border-[#303A49] rounded-xl px-2 py-2 text-xs font-mono text-white"
                    />
                    <input
                      type="number"
                      value={totalFloors}
                      onChange={(e) => setTotalFloors(e.target.value)}
                      placeholder="Total"
                      className="w-1/2 bg-[#1B222D] border border-[#303A49] rounded-xl px-2 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Parking</label>
                  <select
                    value={parkingAvailability}
                    onChange={(e) => setParkingAvailability(e.target.value as any)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Car & 2-Wheeler">Car & 2-Wheeler</option>
                    <option value="2-Wheeler Only">2-Wheeler Only</option>
                    <option value="Car Only">Car Only</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white block mb-1">Furnishing</label>
                  <select
                    value={furnishingStatus}
                    onChange={(e) => setFurnishingStatus(e.target.value as any)}
                    className="w-full bg-[#1B222D] border border-[#303A49] rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs pt-1">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liftAvailable}
                    onChange={(e) => setLiftAvailable(e.target.checked)}
                    className="accent-[#3B82F6]"
                  />
                  <span>Lift / Elevator Available</span>
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep('location')}
                  className="px-4 py-2 rounded-xl bg-[#1B222D] text-[#A1AAB8] text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('rules_amenities')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold"
                >
                  <span>Next: Preferences</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERENCES & AMENITIES */}
          {activeStep === 'rules_amenities' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white uppercase tracking-wider block mb-2">
                  Tenant Suitability & Accommodation Rules
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Bachelors Allowed', val: bachelorsAllowed, set: setBachelorsAllowed },
                    { label: 'Families Allowed', val: familiesAllowed, set: setFamiliesAllowed },
                    { label: 'Students Allowed', val: studentsAllowed, set: setStudentsAllowed },
                    { label: 'Working Professionals', val: professionalsAllowed, set: setProfessionalsAllowed },
                    { label: 'Boys Allowed', val: boysAllowed, set: setBoysAllowed },
                    { label: 'Girls Allowed', val: girlsAllowed, set: setGirlsAllowed },
                    { label: 'Pets Allowed', val: petsAllowed, set: setPetsAllowed },
                    { label: 'Smoking Allowed', val: smokingAllowed, set: setSmokingAllowed }
                  ].map((pref) => (
                    <button
                      key={pref.label}
                      type="button"
                      onClick={() => pref.set(!pref.val)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                        pref.val
                          ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                          : 'bg-[#1B222D] border-[#303A49] text-[#737F90]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                            pref.val ? 'bg-[#3B82F6] text-white' : 'border border-[#4B5563]'
                          }`}
                        >
                          {pref.val && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{pref.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-xs font-semibold text-white uppercase tracking-wider block mb-2">
                  Provided Amenities
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {allAmenities.map((amenity) => {
                    const checked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                          checked
                            ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white'
                            : 'bg-[#1B222D] border-[#303A49] text-[#A1AAB8]'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
                            checked ? 'bg-[#3B82F6] text-white' : 'border border-[#4B5563]'
                          }`}
                        >
                          {checked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setActiveStep('pricing_specs')}
                  className="px-4 py-2 rounded-xl bg-[#1B222D] text-[#A1AAB8] text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep('images')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B82F6] text-white text-xs font-semibold"
                >
                  <span>Next: Genuine Photos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: GENUINE PROPERTY PHOTOGRAPHS (Multiple uploads & tags) */}
          {activeStep === 'images' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Upload Genuine Property Photographs
                </label>
                <p className="text-[11px] text-[#737F90] mb-3">
                  Upload actual photos of Exterior, Living Room, Bedrooms, Kitchen, and Balcony.
                </p>

                {/* Upload Trigger */}
                <label className="border-2 border-dashed border-[#303A49] hover:border-[#3B82F6] bg-[#1B222D] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                  <Upload className="w-8 h-8 text-[#737F90] group-hover:text-[#3B82F6] transition-colors mb-2" />
                  <span className="text-xs font-semibold text-white">Click to Upload Real Photos</span>
                  <span className="text-[10px] text-[#737F90] mt-0.5">JPEG, PNG, WebP supported</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploaded Photos Grid */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-white block">
                  Uploaded Photos ({uploadedImages.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={img.id}
                      className="bg-[#1B222D] border border-[#303A49] rounded-xl overflow-hidden relative group"
                    >
                      <img
                        src={img.url}
                        alt="Property preview"
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="p-2 space-y-1">
                        <select
                          value={img.tag}
                          onChange={(e) => updateImageTag(img.id, e.target.value as any)}
                          className="w-full bg-[#151C26] border border-[#303A49] rounded px-1.5 py-1 text-[10px] text-white focus:outline-none"
                        >
                          <option value="Exterior">Exterior</option>
                          <option value="Living Room">Living Room</option>
                          <option value="Bedroom">Bedroom</option>
                          <option value="Bathroom">Bathroom</option>
                          <option value="Kitchen">Kitchen</option>
                          <option value="Balcony">Balcony</option>
                          <option value="Common Area">Common Area</option>
                          <option value="Facilities">Facilities</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#303A49]">
                <button
                  type="button"
                  onClick={() => setActiveStep('rules_amenities')}
                  className="px-4 py-2 rounded-xl bg-[#1B222D] text-[#A1AAB8] text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {loading ? 'Submitting to Visakhapatnam Registry...' : 'Submit Property for Verification'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
