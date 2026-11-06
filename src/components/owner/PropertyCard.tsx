import React, { useState } from 'react';
import { MapPin, ArrowUpRight, MoreVertical, Edit2, Trash2, Eye, ShieldCheck, Heart } from 'lucide-react';
import { Property } from '../../types/index.ts';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (id: string) => void;
  onToggleFavourite?: (id: string) => void;
  isFavourite?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavourite,
  isFavourite = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [faved, setFaved] = useState(isFavourite);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = () => {
    if (property.status === 'Pending verification') {
      return { text: 'Pending Verification', bg: 'bg-amber-500/80 text-white' };
    }
    if (property.status === 'Approved' || property.status === 'Published' || property.status === 'Active') {
      return { text: 'For Rent', bg: 'bg-black/60 text-white backdrop-blur-sm' };
    }
    if (property.status === 'Under Offer') {
      return { text: 'Under Offer', bg: 'bg-rose-500/80 text-white' };
    }
    return { text: property.status, bg: 'bg-black/60 text-white' };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="bg-[#1B222D] border border-[#303A49] rounded-2xl overflow-hidden hover:border-[#3B82F6]/60 transition-all duration-200 group flex flex-col justify-between shadow-sm hover:shadow-md">
      {/* Top Media Area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#151C26]">
        <img
          src={property.thumbnailUrl}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              '/src/assets/images/stay_modern_apartment_1793966389648.jpg';
          }}
        />

        {/* Top-Left Status Pill Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10 ${statusBadge.bg}`}>
            {statusBadge.text}
          </span>
        </div>

        {/* Top-Right Action Controls (Favourite + Quick View) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFaved(!faved);
              if (onToggleFavourite) onToggleFavourite(property.id);
            }}
            className={`w-8 h-8 rounded-full border border-white/15 flex items-center justify-center transition-colors backdrop-blur-sm ${
              faved ? 'bg-rose-500 text-white' : 'bg-black/50 hover:bg-black/80 text-white'
            }`}
            title="Save to Favourites"
          >
            <Heart className={`w-3.5 h-3.5 ${faved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(property);
            }}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-[#3B82F6] text-white border border-white/15 flex items-center justify-center transition-colors backdrop-blur-sm"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Genuine Verified Badge */}
        {property.isVerified && (
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 bg-[#101318]/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-semibold text-[#60A5FA] border border-[#3B82F6]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Verified in Vizag</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Actions */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onSelect(property)}
              className="text-sm font-semibold text-white tracking-tight hover:text-[#60A5FA] cursor-pointer line-clamp-1 transition-colors"
            >
              {property.title}
            </h3>

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="text-[#737F90] hover:text-white p-1 rounded-md"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 w-36 bg-[#151C26] border border-[#303A49] rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onSelect(property);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-[#A1AAB8] hover:text-white hover:bg-[#202936] flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Listing</span>
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(property);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-[#A1AAB8] hover:text-white hover:bg-[#202936] flex items-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (confirm(`Archive ${property.title}?`)) {
                          onDelete(property.id);
                        }
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs text-rose-400 hover:bg-[#202936] flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Locality, Visakhapatnam */}
          <div className="flex items-center gap-1.5 text-xs text-[#737F90] mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#3B82F6]" />
            <span className="truncate font-medium text-[#A1AAB8]">
              {property.location.locality}, Visakhapatnam
            </span>
            {property.location.distanceKm !== undefined && (
              <span className="text-[10px] text-[#60A5FA] font-mono">
                ({property.location.distanceKm} km away)
              </span>
            )}
          </div>

          {/* Specs pills: Bedrooms | Bathrooms | Furnishing */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px] text-[#A1AAB8]">
            <span className="px-2 py-0.5 rounded-md bg-[#151C26] border border-[#303A49]/70 font-mono">
              {property.bedrooms} Beds
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#151C26] border border-[#303A49]/70 font-mono">
              {property.bathrooms} Baths
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#151C26] border border-[#303A49]/70">
              {property.furnishingStatus}
            </span>
          </div>
        </div>

        {/* Bottom Price & Category Tag */}
        <div className="pt-3 border-t border-[#303A49]/50 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-white font-mono tracking-tight">
              {formatINR(property.price)}
            </span>
            <span className="text-[11px] text-[#737F90] ml-1 font-mono">
              {property.pricePerUnit}
            </span>
          </div>

          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-[#202936] text-[#A1AAB8] border border-[#303A49] truncate max-w-[110px]">
            {property.propertyType}
          </span>
        </div>
      </div>
    </div>
  );
};
