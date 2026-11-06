/**
 * StayFinder — Types & Data Contracts
 * Primary Market: Visakhapatnam (Vizag), Andhra Pradesh, India
 * Currency: INR (₹)
 */

export type PropertyType =
  | 'Apartment'
  | 'Independent House'
  | 'Individual Room'
  | 'PG'
  | 'Hostel'
  | 'Boys Accommodation'
  | 'Girls Accommodation'
  | 'Family Accommodation'
  | 'Shared Room'
  | 'Private Room'
  | 'Studio'
  | 'Co-living'
  | 'Short-term Stay'
  | 'Commercial'
  | 'Land / Plot';

export type RentalPeriod = 'Monthly' | 'Daily' | 'Yearly';

export type PropertyStatus =
  | 'Draft'
  | 'Pending verification'
  | 'Approved'
  | 'Published'
  | 'Rejected'
  | 'Suspended'
  | 'Archived'
  | 'Active'
  | 'Under Offer';

export type BookingStatus =
  | 'Pending'
  | 'Awaiting Payment'
  | 'Confirmed'
  | 'Rejected'
  | 'Cancelled'
  | 'Completed'
  | 'Refund Pending'
  | 'Refunded';

export type UserRole = 'owner' | 'customer' | 'admin';

export interface Location {
  address: string;
  locality: string;
  city: string; // Default: 'Visakhapatnam'
  state: string; // Default: 'Andhra Pradesh'
  pincode: string;
  latitude: number;
  longitude: number;
  landmark?: string;
  nearbyColleges?: string[];
  nearbyTechParks?: string[];
  distanceKm?: number; // Calculated dynamically in nearby queries
}

export interface PropertyImage {
  id: string;
  url: string;
  tag: 'Exterior' | 'Living Room' | 'Bedroom' | 'Bathroom' | 'Kitchen' | 'Balcony' | 'Common Area' | 'Facilities';
  caption?: string;
}

export interface RoomTypeOption {
  id: string;
  name: string;
  type: 'Single' | 'Double' | 'Triple' | 'Entire Flat' | 'Studio' | 'Shared';
  priceMonthly: number; // in INR
  priceDaily?: number; // in INR
  securityDeposit: number; // in INR
  capacity: number;
  totalRooms: number;
  availableRooms: number;
  hasAttachedBath: boolean;
  hasBalcony: boolean;
  isAC: boolean;
}

export interface TenantPreferences {
  boysAllowed: boolean;
  girlsAllowed: boolean;
  familiesAllowed: boolean;
  studentsAllowed: boolean;
  professionalsAllowed: boolean;
  bachelorFriendly: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
}

export interface UtilityCharges {
  maintenanceCharges: number;
  electricityCharges: string; // e.g. "As per sub-meter (₹9/unit)" or "Included"
  waterCharges: string; // e.g. "Included in rent" or "₹500/month"
  foodCharges?: number;
  otherAdditionalFees?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  rentalPeriod: RentalPeriod;
  status: PropertyStatus;
  isVerified: boolean;
  
  // Pricing in INR
  price: number; // monthly rent
  pricePerUnit: string; // e.g. "/mo", "/day"
  dailyRent?: number;
  securityDeposit: number;
  utilityCharges: UtilityCharges;
  
  // Specifications
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  totalRooms: number;
  areaSqFt: number;
  furnishingStatus: 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';
  floorNumber: number;
  totalFloors: number;
  parkingAvailability: 'Car & 2-Wheeler' | '2-Wheeler Only' | 'Car Only' | 'None';
  liftAvailable: boolean;
  propertyAge: string; // e.g. "0-1 year (Brand New)", "1-5 years", "5-10 years"
  
  // Preferences & Food
  genderPreference: 'All' | 'Male Only' | 'Female Only' | 'Family';
  tenantPreferences: TenantPreferences;
  foodAvailable: boolean;
  foodType?: 'Veg Only' | 'Veg & Non-Veg' | 'Self Cooking' | 'None';
  
  // Media & Images
  thumbnailUrl: string;
  images: string[];
  imageDetails?: PropertyImage[];
  
  // Location
  location: Location;
  
  // Amenities list
  amenities: string[];
  
  // Rooms inventory
  roomTypes: RoomTypeOption[];
  
  // House Rules
  houseRules: string[];
  
  // Owner & Meta
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilterParams {
  search?: string;
  locality?: string;
  city?: string;
  propertyType?: PropertyType | 'All';
  rentalPeriod?: RentalPeriod | 'All';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  furnishingStatus?: string;
  genderPreference?: string;
  familySuitable?: boolean;
  bachelorFriendly?: boolean;
  foodAvailable?: boolean;
  amenities?: string[];
  status?: PropertyStatus | 'All';
  verifiedOnly?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  page?: number;
  pageSize?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'distance';
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocality: string;
  ownerId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tenantType: 'Working Professional' | 'Student' | 'Family' | 'Relocating' | 'Other';
  expectedMoveInDate: string;
  occupancyCount: number;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyThumbnail: string;
  propertyLocation: string;
  roomTypeId: string;
  roomTypeName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkInDate: string;
  checkOutDate?: string;
  stayDurationMonths?: number;
  guestsCount: number;
  
  // Financial snapshot
  monthlyRent: number;
  securityDeposit: number;
  platformFee: number;
  totalAmountDue: number;
  currency: 'INR';
  
  status: BookingStatus;
  paymentId?: string;
  paymentStatus: 'Unpaid' | 'Paid' | 'Refunded';
  createdAt: string;
  statusHistory: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number; // in INR
  currency: 'INR';
  status: 'Created' | 'Authorized' | 'Captured' | 'Failed' | 'Refunded';
  method?: 'UPI' | 'Card' | 'NetBanking';
  createdAt: string;
  receiptNumber: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  cleanlinessRating: number;
  locationRating: number;
  facilitiesRating: number;
  comment: string;
  ownerReply?: string;
  createdAt: string;
}

export interface RoommateProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  occupation: string;
  city: string;
  preferredLocality: string;
  budgetMin: number;
  budgetMax: number;
  lifestyle: {
    earlyBird: boolean;
    smoker: boolean;
    petsAllowed: boolean;
    dietary: 'Veg' | 'Non-Veg' | 'Any';
  };
  bio: string;
  avatarUrl: string;
  lookingForGender: 'Male' | 'Female' | 'Any';
}

export interface HouseholdExpense {
  id: string;
  householdName: string;
  title: string;
  amount: number;
  category: 'Rent' | 'Groceries' | 'Electricity' | 'Wi-Fi' | 'Cook/Maid' | 'Other';
  paidBy: string;
  splitWith: string[];
  date: string;
  isSettled: boolean;
}

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  propertyTitle: string;
  roomNumber?: string;
  tenantName: string;
  category: 'Plumbing' | 'Electrical' | 'Air Conditioning' | 'Wi-Fi' | 'Carpentry' | 'Cleaning';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Reported' | 'In Progress' | 'Resolved';
  description: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterName: string;
  reporterEmail: string;
  reason: 'Inaccurate Rent' | 'Fake Photos' | 'Property Not Available' | 'Owner Unresponsive' | 'Other';
  details: string;
  createdAt: string;
  status: 'Pending Review' | 'Investigated' | 'Resolved';
}

export interface RentalOffer {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocality: string;
  ownerId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  offeredMonthlyRent: number;
  originalMonthlyRent: number;
  proposedTenancyMonths: number;
  proposedMoveInDate: string;
  notes?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Countered';
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone: string;
  isVerifiedOwner: boolean;
  address?: string;
  bankAccount?: string;
  upiId?: string;
}

// 25 Primary Visakhapatnam Localities with authentic geo-coordinates
export const VIZAG_LOCALITIES = [
  { name: 'MVP Colony', pincode: '530017', latitude: 17.7423, longitude: 83.3338, description: 'Prime residential hub, close to AS Raja College & Apollo Clinic' },
  { name: 'Madhurawada', pincode: '530048', latitude: 17.8188, longitude: 83.3551, description: 'Rapidly growing IT corridor near ACA-VDCA Cricket Stadium' },
  { name: 'Rushikonda', pincode: '530045', latitude: 17.7820, longitude: 83.3850, description: 'IT SEZ hub, Gitam University campus, beachfront scenic living' },
  { name: 'Yendada', pincode: '530045', latitude: 17.7690, longitude: 83.3590, description: 'Quiet coastal locality midway between city and IT Hills' },
  { name: 'Gajuwaka', pincode: '530026', latitude: 17.6908, longitude: 83.2100, description: 'Industrial and commercial hub near Vizag Steel Plant' },
  { name: 'Seethammadhara', pincode: '530013', latitude: 17.7380, longitude: 83.3150, description: 'Upscale peaceful residential neighbourhood near HB Colony' },
  { name: 'Dwaraka Nagar', pincode: '530016', latitude: 17.7245, longitude: 83.3050, description: 'Central business district with RTC Complex & shopping malls' },
  { name: 'Akkayyapalem', pincode: '530016', latitude: 17.7310, longitude: 83.2980, description: 'Central residential locality with easy access to Highway 16' },
  { name: 'Pendurthi', pincode: '531173', latitude: 17.8280, longitude: 83.1990, description: 'Junction connecting north coastal AP with train station' },
  { name: 'NAD Junction', pincode: '530009', latitude: 17.7460, longitude: 83.2290, description: 'Key transit junction near Vizag Airport with iconic flyover' },
  { name: 'Gopalapatnam', pincode: '530027', latitude: 17.7550, longitude: 83.2350, description: 'Established locality close to Simhachalam railway station' },
  { name: 'Simhachalam', pincode: '530028', latitude: 17.7667, longitude: 83.2500, description: 'Historic temple town with green hillscapes and peaceful living' },
  { name: 'Murali Nagar', pincode: '530007', latitude: 17.7510, longitude: 83.2650, description: 'Quiet residential colony between NAD and Birla Junction' },
  { name: 'Kurmannapalem', pincode: '530046', latitude: 17.6880, longitude: 83.1750, description: 'Entry gate to Visakhapatnam Steel Plant township (Ukkunagaram)' },
  { name: 'Sheela Nagar', pincode: '530012', latitude: 17.7120, longitude: 83.2320, description: 'Commercial-residential node near port bypass & BHPV' },
  { name: 'Kommadi', pincode: '530048', latitude: 17.8340, longitude: 83.3640, description: 'Near engineering colleges and NH16 bypass' },
  { name: 'PM Palem', pincode: '530041', latitude: 17.8050, longitude: 83.3510, description: 'Pothinamallayya Palem, adjacent to international cricket stadium' },
  { name: 'Bheemili', pincode: '531163', latitude: 17.8910, longitude: 83.4540, description: 'Historic Dutch heritage town with serene Bheemunipatnam beach' },
  { name: 'Beach Road', pincode: '530003', latitude: 17.7180, longitude: 83.3270, description: 'Prestigious sea-facing stretch from RK Beach to Kailasagiri' },
  { name: 'Siripuram', pincode: '530003', latitude: 17.7240, longitude: 83.3180, description: 'Vibrant cultural center near Andhra University campus' },
  { name: 'Jagadamba Junction', pincode: '530002', latitude: 17.7120, longitude: 83.3030, description: 'Heritage retail district famous for theatres and traditional markets' },
  { name: 'Railway New Colony', pincode: '530016', latitude: 17.7260, longitude: 83.2920, description: 'Prime colony within walking distance to Visakhapatnam Railway Station' },
  { name: 'Maddilapalem', pincode: '530013', latitude: 17.7350, longitude: 83.3250, description: 'Major transit hub with BRTS terminal & AU Engineering College' },
  { name: 'Arilova', pincode: '530040', latitude: 17.7710, longitude: 83.3220, description: 'Nestled between hills near Vizag Central Health City & Apollo' },
  { name: 'Anandapuram', pincode: '530052', latitude: 17.9120, longitude: 83.3980, description: 'Northern gateway node with universities and logistics parks' }
] as const;
