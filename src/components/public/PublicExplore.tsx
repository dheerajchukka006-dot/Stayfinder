import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Map as MapIcon,
  List,
  Filter,
  Navigation,
  Compass,
  ArrowUpRight,
  Send
} from 'lucide-react';
import { Property, VIZAG_LOCALITIES } from '../../types/index.ts';
import { apiClient } from '../../services/apiClient.ts';

interface PublicExploreProps {
  onSelectProperty: (property: Property) => void;
  onBookProperty: (property: Property) => void;
}

export const PublicExplore: React.FC<PublicExploreProps> = ({
  onSelectProperty,
  onBookProperty
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters (Visakhapatnam default launch location)
  const [selectedCity, setSelectedCity] = useState('Visakhapatnam');
  const [selectedLocality, setSelectedLocality] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [familyFilter, setFamilyFilter] = useState(false);
  const [bachelorFilter, setBachelorFilter] = useState(false);

  // View mode: 'list' or 'map'
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activePinProperty, setActivePinProperty] = useState<Property | null>(null);

  const categories = [
    'All',
    'Apartment',
    'Independent House',
    'Individual Room',
    'PG',
    'Hostel',
    'Boys Accommodation',
    'Girls Accommodation',
    'Family Accommodation',
    'Studio',
    'Co-living',
    'Short-term Stay'
  ];

  useEffect(() => {
    loadPublicProperties();
  }, [selectedCity, selectedLocality, selectedType, searchQuery, sortBy, verifiedOnly, familyFilter, bachelorFilter]);

  const loadPublicProperties = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getPublicProperties({
        city: selectedCity,
        locality: selectedLocality === 'All' ? undefined : selectedLocality,
        propertyType: selectedType === 'All' ? undefined : selectedType,
        search: searchQuery,
        sortBy,
        verifiedOnly: verifiedOnly ? 'true' : undefined,
        familySuitable: familyFilter ? 'true' : undefined,
        bachelorFriendly: bachelorFilter ? 'true' : undefined
      });
      if (res.success) {
        setProperties(res.data);
      }
    } catch (err) {
      console.error('Error searching public properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Hero Search Section focused on Visakhapatnam */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1B222D] via-[#151C26] to-[#12161D] border border-[#303A49] p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#3B82F6]">
              Visakhapatnam (Vizag) Launch Edition
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Discover Verified Rental Homes & PGs Across Visakhapatnam
          </h2>
          <p className="text-xs sm:text-sm text-[#A1AAB8] mt-2 leading-relaxed">
            From MVP Colony, Rushikonda IT SEZ, and Seethammadhara to Madhurawada and Beach Road.
            Direct owner listings, zero brokerage, transparent utility charges, and verified trust badges.
          </p>
        </div>

        {/* Global Vizag Search Bar Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-2 max-w-4xl bg-[#101318] p-2.5 rounded-2xl border border-[#303A49]">
          <div className="flex-1 flex items-center gap-2 px-3 py-1">
            <Search className="w-4 h-4 text-[#737F90] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by locality, landmark, Gitam, IT SEZ, AU campus (e.g. MVP Colony, Gitam)"
              className="w-full bg-transparent text-xs text-white placeholder-[#737F90] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Vizag Locality Dropdown */}
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="bg-[#1B222D] border border-[#303A49] text-xs text-white rounded-xl px-3 py-2 focus:outline-none cursor-pointer max-w-[200px]"
            >
              <option value="All">All Vizag Localities ({VIZAG_LOCALITIES.length})</option>
              {VIZAG_LOCALITIES.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>

            {/* City Selector */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#1B222D] border border-[#303A49] text-xs text-white rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="Visakhapatnam">Visakhapatnam (Vizag)</option>
              <option value="Vijayawada">Vijayawada</option>
              <option value="Guntur">Guntur</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="All">All Andhra Pradesh</option>
            </select>
          </div>
        </div>

        {/* Popular Vizag Localities Quick Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[#737F90] text-[11px] mr-1">Popular Vizag Hubs:</span>
          {['MVP Colony', 'Rushikonda', 'Madhurawada', 'Seethammadhara', 'Siripuram', 'Gajuwaka', 'Beach Road'].map((hub) => (
            <button
              key={hub}
              onClick={() => setSelectedLocality(selectedLocality === hub ? 'All' : hub)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                selectedLocality === hub
                  ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                  : 'bg-[#151C26]/80 text-[#A1AAB8] border-[#303A49] hover:text-white'
              }`}
            >
              {hub}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Category Pills + View Mode + Sorting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-4xl scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedType(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                selectedType === cat
                  ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm'
                  : 'bg-[#151C26] text-[#A1AAB8] border-[#303A49] hover:text-white'
              }`}
            >
              {cat === 'All' ? 'All Stays' : cat}
            </button>
          ))}
        </div>

        {/* View Mode Toggle & Sort */}
        <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
          {/* List / Map Switcher */}
          <div className="flex items-center p-1 bg-[#151C26] border border-[#303A49] rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list' ? 'bg-[#3B82F6] text-white' : 'text-[#A1AAB8] hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'map' ? 'bg-[#3B82F6] text-white' : 'text-[#A1AAB8] hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map Pins</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#151C26] border border-[#303A49] text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="newest">Recently Added</option>
            <option value="price_asc">Lowest Rent</option>
            <option value="price_desc">Highest Rent</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Quick Filters Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-all ${
            verifiedOnly
              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-medium'
              : 'bg-[#151C26] border-[#303A49] text-[#A1AAB8] hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Listings Only</span>
        </button>

        <button
          onClick={() => setFamilyFilter(!familyFilter)}
          className={`px-3 py-1 rounded-lg border transition-all ${
            familyFilter
              ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white font-medium'
              : 'bg-[#151C26] border-[#303A49] text-[#A1AAB8] hover:text-white'
          }`}
        >
          Family Accommodation
        </button>

        <button
          onClick={() => setBachelorFilter(!bachelorFilter)}
          className={`px-3 py-1 rounded-lg border transition-all ${
            bachelorFilter
              ? 'bg-[#3B82F6]/15 border-[#3B82F6] text-white font-medium'
              : 'bg-[#151C26] border-[#303A49] text-[#A1AAB8] hover:text-white'
          }`}
        >
          Bachelor Friendly
        </button>

        {(selectedLocality !== 'All' || selectedType !== 'All' || verifiedOnly || familyFilter || bachelorFilter || searchQuery) && (
          <button
            onClick={() => {
              setSelectedLocality('All');
              setSelectedType('All');
              setVerifiedOnly(false);
              setFamilyFilter(false);
              setBachelorFilter(false);
              setSearchQuery('');
            }}
            className="text-[11px] text-rose-400 hover:underline ml-2"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* MAP VIEW */}
      {viewMode === 'map' && (
        <div className="bg-[#151A22] border border-[#303A49] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#3B82F6]" />
                <span>Visakhapatnam Map-Based Discovery</span>
              </h3>
              <p className="text-xs text-[#737F90]">
                Interactive geographic distribution across MVP Colony, Rushikonda, Madhurawada, and Beach Road
              </p>
            </div>
            <span className="text-xs text-[#60A5FA] font-mono font-medium">
              {properties.length} Active Pins in Vizag
            </span>
          </div>

          {/* Interactive Simulated Map Canvas */}
          <div className="relative w-full h-96 bg-[#0E1218] border border-[#303A49] rounded-xl overflow-hidden shadow-inner flex items-center justify-center p-4">
            {/* Visual representation of Vizag coastline & topography */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-950/20 border-l border-blue-500/10 flex items-center justify-center">
              <span className="text-[11px] font-bold tracking-widest text-blue-500/40 uppercase rotate-90">
                Bay of Bengal (Coastline)
              </span>
            </div>

            {/* Pins overlay */}
            <div className="relative w-full h-full">
              {properties.map((p, idx) => {
                // Map coordinates approximately to container percentage
                const topPercent = Math.max(10, Math.min(85, ((17.85 - p.location.latitude) / 0.2) * 100));
                const leftPercent = Math.max(10, Math.min(75, ((p.location.longitude - 83.2) / 0.25) * 100));

                const isSelected = activePinProperty?.id === p.id;

                return (
                  <div
                    key={p.id}
                    style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                    onClick={() => setActivePinProperty(p)}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1 shadow-lg border transition-all ${
                        isSelected
                          ? 'bg-[#3B82F6] text-white border-white scale-110 z-30'
                          : 'bg-[#1B222D] text-[#60A5FA] border-[#303A49] hover:bg-[#3B82F6] hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{formatINR(p.price)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Pin Callout Card */}
            {activePinProperty && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-[#1B222D] border border-[#303A49] rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#3B82F6]">{activePinProperty.propertyType}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{activePinProperty.title}</h4>
                    <p className="text-[11px] text-[#737F90]">{activePinProperty.location.locality}, Visakhapatnam</p>
                  </div>
                  <button
                    onClick={() => setActivePinProperty(null)}
                    className="text-[#737F90] hover:text-white text-xs p-1"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#303A49]">
                  <span className="text-xs font-mono font-bold text-white">{formatINR(activePinProperty.price)}/mo</span>
                  <button
                    onClick={() => onSelectProperty(activePinProperty)}
                    className="px-3 py-1 rounded-lg bg-[#3B82F6] text-white text-xs font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIST VIEW (Property Cards Grid) */}
      {viewMode === 'list' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-[#1B222D] animate-pulse rounded-2xl border border-[#303A49]" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-[#151A22] rounded-2xl border border-[#303A49]">
              <p className="text-sm text-white font-medium">No verified listings found in Visakhapatnam matching this filter</p>
              <p className="text-xs text-[#737F90] mt-1">Try selecting "All Vizag Localities" or expanding your budget range.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#1B222D] border border-[#303A49] rounded-2xl overflow-hidden hover:border-[#3B82F6]/60 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] bg-[#101318]">
                    <img
                      src={p.thumbnailUrl}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/70 text-white backdrop-blur-sm border border-white/10">
                      {p.propertyType}
                    </span>
                    {p.isVerified && (
                      <span className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#3B82F6]/90 text-white flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        onClick={() => onSelectProperty(p)}
                        className="text-sm font-semibold text-white hover:text-[#60A5FA] cursor-pointer line-clamp-1"
                      >
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-[#737F90] mt-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                        <span className="truncate">{p.location.locality}, Visakhapatnam</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-[#A1AAB8] mb-4">
                        <span className="px-2 py-0.5 rounded bg-[#151C26] font-mono border border-[#303A49]/70">
                          {p.bedrooms} Beds
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#151C26] font-mono border border-[#303A49]/70">
                          {p.bathrooms} Baths
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#151C26] border border-[#303A49]/70">
                          {p.furnishingStatus}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#303A49]/60 flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-white font-mono">{formatINR(p.price)}</span>
                        <span className="text-[11px] text-[#737F90] ml-1">{p.pricePerUnit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectProperty(p)}
                          className="px-3 py-1.5 rounded-xl bg-[#202936] hover:bg-[#2A3444] text-[#A1AAB8] hover:text-white text-xs font-medium border border-[#303A49]"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onBookProperty(p)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow"
                        >
                          Book Stay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
