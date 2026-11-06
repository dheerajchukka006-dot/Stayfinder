import fs from 'fs';
import path from 'path';
import {
  Property,
  Booking,
  Review,
  RoommateProfile,
  HouseholdExpense,
  MaintenanceTicket,
  UserRole,
  Enquiry,
  VIZAG_LOCALITIES,
  PropertyReport,
  RentalOffer,
  AppUser
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'stayfinder.db.json');

// Strict Visakhapatnam geographic bounding box
export const VIZAG_BOUNDS = {
  minLat: 17.4000,
  maxLat: 18.2000,
  minLon: 83.0000,
  maxLon: 83.6000
};

export interface DatabaseSchema {
  properties: Property[];
  bookings: Booking[];
  reviews: Review[];
  roommates: RoommateProfile[];
  expenses: HouseholdExpense[];
  maintenanceTickets: MaintenanceTicket[];
  enquiries: Enquiry[];
  offers: RentalOffer[];
  reports: PropertyReport[];
  favourites: { userId: string; propertyId: string; createdAt: string }[];
  users: AppUser[];
}

// Haversine distance calculator between two GPS coordinates in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Initial Authentic Vizag Rental Properties
const INITIAL_VIZAG_PROPERTIES: Property[] = [
  {
    id: 'vizag-prop-1',
    title: 'MVP Colony Sector 6 Luxury 2 BHK Flat',
    description: 'Well-ventilated East-facing 2 BHK flat in MVP Colony Sector 6. 5 minutes from Apollo Clinic, AS Raja College, and Shivaji Park. 24/7 municipal water and power backup.',
    propertyType: 'Apartment',
    rentalPeriod: 'Monthly',
    status: 'Published',
    isVerified: true,
    price: 18500,
    pricePerUnit: '/mo',
    securityDeposit: 37000,
    utilityCharges: {
      maintenanceCharges: 1500,
      electricityCharges: 'Sub-meter billing at ₹8.5/unit',
      waterCharges: 'Included in rent',
      otherAdditionalFees: 0
    },
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    totalRooms: 4,
    areaSqFt: 1250,
    furnishingStatus: 'Semi Furnished',
    floorNumber: 3,
    totalFloors: 5,
    parkingAvailability: 'Car & 2-Wheeler',
    liftAvailable: true,
    propertyAge: '1-5 years',
    genderPreference: 'All',
    tenantPreferences: {
      boysAllowed: true,
      girlsAllowed: true,
      familiesAllowed: true,
      studentsAllowed: true,
      professionalsAllowed: true,
      bachelorFriendly: true,
      petsAllowed: false,
      smokingAllowed: false
    },
    foodAvailable: false,
    thumbnailUrl: '/src/assets/images/stay_modern_apartment_1793966389648.jpg',
    images: ['/src/assets/images/stay_modern_apartment_1793966389648.jpg'],
    location: {
      address: 'Plot 142, Sector 6, MVP Colony',
      locality: 'MVP Colony',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530017',
      latitude: 17.7423,
      longitude: 83.3338,
      landmark: 'Near AS Raja College Grounds',
      nearbyColleges: ['AS Raja College', 'Andhra University (10 mins)'],
      nearbyTechParks: ['IT SEZ Rushikonda (12 mins)']
    },
    amenities: ['Wi-Fi', 'Parking', 'Security', 'Power backup', 'Attached bathroom', 'Lift', 'Geyser', 'Wardrobe'],
    roomTypes: [
      {
        id: 'rt-mvp-1',
        name: 'Entire 2BHK Apartment',
        type: 'Entire Flat',
        priceMonthly: 18500,
        securityDeposit: 37000,
        capacity: 4,
        totalRooms: 1,
        availableRooms: 1,
        hasAttachedBath: true,
        hasBalcony: true,
        isAC: true
      }
    ],
    houseRules: ['Quiet hours after 10:30 PM', 'Family-friendly gated society', 'Timely rent payment by 5th'],
    ownerId: 'owner-vizag-1',
    ownerName: 'Suresh Varma',
    ownerPhone: '+91 94401 23456',
    ownerEmail: 'suresh.varma@stayfinder.in',
    rating: 4.9,
    reviewsCount: 14,
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-11-05T10:00:00.000Z'
  },
  {
    id: 'vizag-prop-2',
    title: 'Rushikonda IT Hills Techie & Student Co-living Studio',
    description: 'Modern sea-view studio apartment on Rushikonda IT SEZ road. Just 2 mins from Gitam University, Millenium Tower, and Rushikonda Beach. High-speed fibre internet included.',
    propertyType: 'Co-living',
    rentalPeriod: 'Monthly',
    status: 'Published',
    isVerified: true,
    price: 12000,
    pricePerUnit: '/mo',
    securityDeposit: 24000,
    utilityCharges: {
      maintenanceCharges: 1000,
      electricityCharges: 'As per individual meter',
      waterCharges: 'Included (24/7 RO water)',
      foodCharges: 3500
    },
    bedrooms: 1,
    bathrooms: 1,
    balconies: 1,
    totalRooms: 2,
    areaSqFt: 550,
    furnishingStatus: 'Fully Furnished',
    floorNumber: 4,
    totalFloors: 6,
    parkingAvailability: '2-Wheeler Only',
    liftAvailable: true,
    propertyAge: '0-1 year (Brand New)',
    genderPreference: 'All',
    tenantPreferences: {
      boysAllowed: true,
      girlsAllowed: true,
      familiesAllowed: false,
      studentsAllowed: true,
      professionalsAllowed: true,
      bachelorFriendly: true,
      petsAllowed: false,
      smokingAllowed: false
    },
    foodAvailable: true,
    foodType: 'Veg & Non-Veg',
    thumbnailUrl: '/src/assets/images/stay_coliving_room_1793966390947.jpg',
    images: ['/src/assets/images/stay_coliving_room_1793966390947.jpg'],
    location: {
      address: 'Hill No 2, IT SEZ Layout, Rushikonda',
      locality: 'Rushikonda',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530045',
      latitude: 17.7820,
      longitude: 83.3850,
      landmark: 'Behind Gitam University Campus Gate 3',
      nearbyColleges: ['Gitam Deemed University'],
      nearbyTechParks: ['Millenium IT Tower', 'Wipro IT SEZ', 'Tech Mahindra']
    },
    amenities: ['Wi-Fi', 'Air conditioning', 'Furnished', 'Attached bathroom', 'Food available', 'Laundry', 'Security', 'Power backup', 'CCTV'],
    roomTypes: [
      {
        id: 'rt-rushi-1',
        name: 'Private AC Tech Studio',
        type: 'Studio',
        priceMonthly: 12000,
        securityDeposit: 24000,
        capacity: 1,
        totalRooms: 6,
        availableRooms: 2,
        hasAttachedBath: true,
        hasBalcony: true,
        isAC: true
      }
    ],
    houseRules: ['Biometric night entry', 'Visitors permitted in lobby', 'Strict cleanliness protocol'],
    ownerId: 'owner-vizag-1',
    ownerName: 'Suresh Varma',
    ownerPhone: '+91 94401 23456',
    ownerEmail: 'suresh.varma@stayfinder.in',
    rating: 4.8,
    reviewsCount: 29,
    createdAt: '2026-09-28T11:30:00.000Z',
    updatedAt: '2026-11-04T16:20:00.000Z'
  },
  {
    id: 'vizag-prop-3',
    title: 'Madhurawada Mithilapuri 3 BHK Independent House',
    description: 'Spacious independent house with private car porch and garden in Mithilapuri VUDA Colony, Madhurawada. Peaceful residential surroundings, close to D-Mart, St. Ann’s School.',
    propertyType: 'Independent House',
    rentalPeriod: 'Monthly',
    status: 'Published',
    isVerified: true,
    price: 22000,
    pricePerUnit: '/mo',
    securityDeposit: 44000,
    utilityCharges: {
      maintenanceCharges: 0,
      electricityCharges: 'Government APEPDCL actual meter bill',
      waterCharges: 'Own borewell & GVMC connection',
      otherAdditionalFees: 0
    },
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    totalRooms: 6,
    areaSqFt: 1850,
    furnishingStatus: 'Semi Furnished',
    floorNumber: 1,
    totalFloors: 2,
    parkingAvailability: 'Car & 2-Wheeler',
    liftAvailable: false,
    propertyAge: '1-5 years',
    genderPreference: 'Family',
    tenantPreferences: {
      boysAllowed: false,
      girlsAllowed: false,
      familiesAllowed: true,
      studentsAllowed: false,
      professionalsAllowed: true,
      bachelorFriendly: false,
      petsAllowed: true,
      smokingAllowed: false
    },
    foodAvailable: false,
    thumbnailUrl: '/src/assets/images/stay_modern_apartment_1793966389648.jpg',
    images: ['/src/assets/images/stay_modern_apartment_1793966389648.jpg'],
    location: {
      address: 'House 84, Phase 2, Mithilapuri VUDA Colony',
      locality: 'Madhurawada',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530048',
      latitude: 17.8188,
      longitude: 83.3551,
      landmark: 'Near Cricket Stadium & D-Mart',
      nearbyColleges: ['Gayatri Vidya Parishad College (GVP)']
    },
    amenities: ['Parking', 'Security', 'Power backup', 'Water supply', 'Pet allowed', 'Attached bathroom', 'Kitchen', 'Geyser'],
    roomTypes: [
      {
        id: 'rt-madh-1',
        name: 'Entire 3 BHK Ground Floor House',
        type: 'Entire Flat',
        priceMonthly: 22000,
        securityDeposit: 44000,
        capacity: 6,
        totalRooms: 1,
        availableRooms: 1,
        hasAttachedBath: true,
        hasBalcony: true,
        isAC: false
      }
    ],
    houseRules: ['Pets welcome', 'Family lease agreement', 'Terrace access allowed'],
    ownerId: 'owner-vizag-2',
    ownerName: 'K. Lakshmi Prasad',
    ownerPhone: '+91 98852 98765',
    ownerEmail: 'lakshmi.prasad@stayfinder.in',
    rating: 4.9,
    reviewsCount: 8,
    createdAt: '2026-10-02T14:00:00.000Z',
    updatedAt: '2026-11-03T11:00:00.000Z'
  },
  {
    id: 'vizag-prop-4',
    title: 'Seethammadhara North Ext. Girls Hostel & PG',
    description: 'Safe and secure girls accommodation in Seethammadhara North Extension. Homemade Andhra meals included, biometric access, warden on site, and study tables.',
    propertyType: 'Girls Accommodation',
    rentalPeriod: 'Monthly',
    status: 'Published',
    isVerified: true,
    price: 8500,
    pricePerUnit: '/mo',
    securityDeposit: 15000,
    utilityCharges: {
      maintenanceCharges: 500,
      electricityCharges: 'Included in rent',
      waterCharges: 'Included (24/7 hot water)',
      foodCharges: 0
    },
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    totalRooms: 8,
    areaSqFt: 2100,
    furnishingStatus: 'Fully Furnished',
    floorNumber: 2,
    totalFloors: 4,
    parkingAvailability: '2-Wheeler Only',
    liftAvailable: true,
    propertyAge: '1-5 years',
    genderPreference: 'Female Only',
    tenantPreferences: {
      boysAllowed: false,
      girlsAllowed: true,
      familiesAllowed: false,
      studentsAllowed: true,
      professionalsAllowed: true,
      bachelorFriendly: true,
      petsAllowed: false,
      smokingAllowed: false
    },
    foodAvailable: true,
    foodType: 'Veg & Non-Veg',
    thumbnailUrl: '/src/assets/images/stay_student_pg_1793966391009.jpg',
    images: ['/src/assets/images/stay_student_pg_1793966391009.jpg'],
    location: {
      address: 'Plot 31, North Extension, Seethammadhara',
      locality: 'Seethammadhara',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530013',
      latitude: 17.7380,
      longitude: 83.3150,
      landmark: 'Near Satyam Junction & HB Colony',
      nearbyColleges: ['St. Joseph College for Women', 'Andhra University']
    },
    amenities: ['Wi-Fi', 'Food available', 'Laundry', 'Security', 'CCTV', 'Power backup', 'Attached bathroom', 'Geyser', 'Bed', 'Wardrobe'],
    roomTypes: [
      {
        id: 'rt-seetha-1',
        name: 'Twin Sharing Room with AC',
        type: 'Double',
        priceMonthly: 8500,
        securityDeposit: 15000,
        capacity: 2,
        totalRooms: 8,
        availableRooms: 3,
        hasAttachedBath: true,
        hasBalcony: true,
        isAC: true
      }
    ],
    houseRules: ['Entry before 9:30 PM', 'No male visitors inside rooms', 'Wholesome atmosphere'],
    ownerId: 'owner-vizag-3',
    ownerName: 'Radha Devi',
    ownerPhone: '+91 891 275 4321',
    ownerEmail: 'radha.devi@stayfinder.in',
    rating: 4.7,
    reviewsCount: 36,
    createdAt: '2026-08-14T08:00:00.000Z',
    updatedAt: '2026-10-30T15:45:00.000Z'
  },
  {
    id: 'vizag-prop-5',
    title: 'Beach Road Pandurangapuram Sea-Facing 3 BHK Flat',
    description: 'Unobstructed panoramic Bay of Bengal sea views from every room. Premium high-rise on Beach Road, walking distance to Submarine Museum, RK Beach, and Novotel Hotel.',
    propertyType: 'Apartment',
    rentalPeriod: 'Monthly',
    status: 'Published',
    isVerified: true,
    price: 42000,
    pricePerUnit: '/mo',
    securityDeposit: 120000,
    utilityCharges: {
      maintenanceCharges: 3500,
      electricityCharges: 'As per APEPDCL meter',
      waterCharges: 'Included',
      otherAdditionalFees: 0
    },
    bedrooms: 3,
    bathrooms: 3,
    balconies: 3,
    totalRooms: 6,
    areaSqFt: 2250,
    furnishingStatus: 'Fully Furnished',
    floorNumber: 7,
    totalFloors: 12,
    parkingAvailability: 'Car & 2-Wheeler',
    liftAvailable: true,
    propertyAge: '1-5 years',
    genderPreference: 'All',
    tenantPreferences: {
      boysAllowed: true,
      girlsAllowed: true,
      familiesAllowed: true,
      studentsAllowed: false,
      professionalsAllowed: true,
      bachelorFriendly: true,
      petsAllowed: true,
      smokingAllowed: false
    },
    foodAvailable: false,
    thumbnailUrl: '/src/assets/images/stay_urban_studio_1793966392045.jpg',
    images: ['/src/assets/images/stay_urban_studio_1793966392045.jpg'],
    location: {
      address: 'Tower 2, Ocean Crest, Beach Road, Pandurangapuram',
      locality: 'Beach Road',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530003',
      latitude: 17.7180,
      longitude: 83.3270,
      landmark: 'Near Kurusura Submarine Museum',
      nearbyColleges: ['Andhra University South Campus']
    },
    amenities: ['Wi-Fi', 'Air conditioning', 'Parking', 'Security', 'Power backup', 'Lift', 'Pet allowed', 'CCTV', 'Attached bathroom', 'Kitchen'],
    roomTypes: [
      {
        id: 'rt-beach-1',
        name: 'Entire 3 BHK Sea-View Suite',
        type: 'Entire Flat',
        priceMonthly: 42000,
        securityDeposit: 120000,
        capacity: 6,
        totalRooms: 1,
        availableRooms: 1,
        hasAttachedBath: true,
        hasBalcony: true,
        isAC: true
      }
    ],
    houseRules: ['Residential bylaws apply', 'Pets allowed with prior deposit'],
    ownerId: 'owner-vizag-1',
    ownerName: 'Suresh Varma',
    ownerPhone: '+91 94401 23456',
    ownerEmail: 'suresh.varma@stayfinder.in',
    rating: 5.0,
    reviewsCount: 18,
    createdAt: '2026-09-10T12:00:00.000Z',
    updatedAt: '2026-11-04T12:00:00.000Z'
  },
  {
    id: 'vizag-prop-6',
    title: 'Gajuwaka Steel Plant Junction 2 BHK Flat',
    description: 'Convenient 2 BHK rental home in Gajuwaka near Old Post Office road. Ideal for employees of Vizag Steel Plant (RINL), NTPC, BHEL, and coastal industries.',
    propertyType: 'Apartment',
    rentalPeriod: 'Monthly',
    status: 'Published',
    isVerified: true,
    price: 13500,
    pricePerUnit: '/mo',
    securityDeposit: 27000,
    utilityCharges: {
      maintenanceCharges: 800,
      electricityCharges: 'As per meter',
      waterCharges: 'Included',
      otherAdditionalFees: 0
    },
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    totalRooms: 4,
    areaSqFt: 1100,
    furnishingStatus: 'Semi Furnished',
    floorNumber: 2,
    totalFloors: 4,
    parkingAvailability: 'Car & 2-Wheeler',
    liftAvailable: true,
    propertyAge: '5-10 years',
    genderPreference: 'All',
    tenantPreferences: {
      boysAllowed: true,
      girlsAllowed: true,
      familiesAllowed: true,
      studentsAllowed: true,
      professionalsAllowed: true,
      bachelorFriendly: true,
      petsAllowed: false,
      smokingAllowed: false
    },
    foodAvailable: false,
    thumbnailUrl: '/src/assets/images/stay_modern_apartment_1793966389648.jpg',
    images: ['/src/assets/images/stay_modern_apartment_1793966389648.jpg'],
    location: {
      address: 'Main Road, Old Post Office, Gajuwaka',
      locality: 'Gajuwaka',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530026',
      latitude: 17.6908,
      longitude: 83.2100,
      landmark: 'Near Steel Plant Main Arch',
      nearbyTechParks: ['Vizag Steel Plant (RINL)', 'Pharma City (20 mins)']
    },
    amenities: ['Parking', 'Lift', 'Security', 'Power backup', 'Attached bathroom', 'Wardrobe'],
    roomTypes: [
      {
        id: 'rt-gaju-1',
        name: 'Standard 2 BHK Unit',
        type: 'Entire Flat',
        priceMonthly: 13500,
        securityDeposit: 27000,
        capacity: 4,
        totalRooms: 1,
        availableRooms: 1,
        hasAttachedBath: true,
        hasBalcony: true,
        isAC: false
      }
    ],
    houseRules: ['Standard society rules', 'Notice period of 1 month'],
    ownerId: 'owner-vizag-2',
    ownerName: 'K. Lakshmi Prasad',
    ownerPhone: '+91 98852 98765',
    ownerEmail: 'lakshmi.prasad@stayfinder.in',
    rating: 4.6,
    reviewsCount: 11,
    createdAt: '2026-10-18T10:00:00.000Z',
    updatedAt: '2026-11-05T09:00:00.000Z'
  },
  {
    id: 'vizag-prop-7',
    title: 'Siripuram Central Executive 1 BHK Studio',
    description: 'Located in the heart of Vizag at Siripuram. Walkable to Dutt Island shopping complex, VIP Road cafes, and Andhra University. Tastefully furnished with compact kitchen.',
    propertyType: 'Studio',
    rentalPeriod: 'Monthly',
    status: 'Published',
    isVerified: true,
    price: 16000,
    pricePerUnit: '/mo',
    securityDeposit: 32000,
    utilityCharges: {
      maintenanceCharges: 1200,
      electricityCharges: 'Sub-meter at actuals',
      waterCharges: 'Included',
      otherAdditionalFees: 0
    },
    bedrooms: 1,
    bathrooms: 1,
    balconies: 1,
    totalRooms: 2,
    areaSqFt: 620,
    furnishingStatus: 'Fully Furnished',
    floorNumber: 3,
    totalFloors: 5,
    parkingAvailability: '2-Wheeler Only',
    liftAvailable: true,
    propertyAge: '1-5 years',
    genderPreference: 'All',
    tenantPreferences: {
      boysAllowed: true,
      girlsAllowed: true,
      familiesAllowed: false,
      studentsAllowed: true,
      professionalsAllowed: true,
      bachelorFriendly: true,
      petsAllowed: false,
      smokingAllowed: false
    },
    foodAvailable: false,
    thumbnailUrl: '/src/assets/images/stay_coliving_room_1793966390947.jpg',
    images: ['/src/assets/images/stay_coliving_room_1793966390947.jpg'],
    location: {
      address: 'Opp. Dutt Island, VIP Road, Siripuram',
      locality: 'Siripuram',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530003',
      latitude: 17.7240,
      longitude: 83.3180,
      landmark: 'Next to Dutt Island Mall',
      nearbyColleges: ['Andhra University Main Campus (3 mins)']
    },
    amenities: ['Wi-Fi', 'Air conditioning', 'Furnished', 'Attached bathroom', 'Lift', 'Security', 'Power backup', 'Geyser'],
    roomTypes: [
      {
        id: 'rt-siri-1',
        name: 'Executive Studio Unit',
        type: 'Studio',
        priceMonthly: 16000,
        securityDeposit: 32000,
        capacity: 2,
        totalRooms: 2,
        availableRooms: 1,
        hasAttachedBath: true,
        hasBalcony: true,
        isAC: true
      }
    ],
    houseRules: ['ID verification mandatory', 'Quiet professional living'],
    ownerId: 'owner-vizag-1',
    ownerName: 'Suresh Varma',
    ownerPhone: '+91 94401 23456',
    ownerEmail: 'suresh.varma@stayfinder.in',
    rating: 4.9,
    reviewsCount: 22,
    createdAt: '2026-10-05T07:30:00.000Z',
    updatedAt: '2026-11-02T13:15:00.000Z'
  },
  {
    id: 'vizag-prop-8',
    title: 'Yendada Sea-Breeze 2 BHK Corner Apartment',
    description: 'Located in scenic Yendada near Sagar Nagar beach road junction. Beautiful valley and sea breezes, quiet gated community, and fast commute to both Siripuram and IT SEZ.',
    propertyType: 'Apartment',
    rentalPeriod: 'Monthly',
    status: 'Pending verification',
    isVerified: false,
    price: 15000,
    pricePerUnit: '/mo',
    securityDeposit: 30000,
    utilityCharges: {
      maintenanceCharges: 1200,
      electricityCharges: 'As per meter',
      waterCharges: 'Included',
      otherAdditionalFees: 0
    },
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    totalRooms: 4,
    areaSqFt: 1180,
    furnishingStatus: 'Semi Furnished',
    floorNumber: 2,
    totalFloors: 5,
    parkingAvailability: 'Car & 2-Wheeler',
    liftAvailable: true,
    propertyAge: '1-5 years',
    genderPreference: 'All',
    tenantPreferences: {
      boysAllowed: true,
      girlsAllowed: true,
      familiesAllowed: true,
      studentsAllowed: true,
      professionalsAllowed: true,
      bachelorFriendly: true,
      petsAllowed: true,
      smokingAllowed: false
    },
    foodAvailable: false,
    thumbnailUrl: '/src/assets/images/stay_urban_studio_1793966392045.jpg',
    images: ['/src/assets/images/stay_urban_studio_1793966392045.jpg'],
    location: {
      address: 'Road No 4, Law College Road, Yendada',
      locality: 'Yendada',
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      pincode: '530045',
      latitude: 17.7690,
      longitude: 83.3590,
      landmark: 'Near DBR Enclave',
      nearbyColleges: ['DSNLU Law University', 'Gitam University']
    },
    amenities: ['Parking', 'Security', 'Lift', 'Power backup', 'Attached bathroom', 'Pet allowed'],
    roomTypes: [
      {
        id: 'rt-yen-1',
        name: '2 BHK Corner Flat',
        type: 'Entire Flat',
        priceMonthly: 15000,
        securityDeposit: 30000,
        capacity: 4,
        totalRooms: 1,
        availableRooms: 1,
        hasAttachedBath: true,
        hasBalcony: true,
        isAC: false
      }
    ],
    houseRules: ['Pets allowed', 'Family / Working professional preferred'],
    ownerId: 'owner-vizag-1',
    ownerName: 'Suresh Varma',
    ownerPhone: '+91 94401 23456',
    ownerEmail: 'suresh.varma@stayfinder.in',
    rating: 4.7,
    reviewsCount: 5,
    createdAt: '2026-11-04T10:00:00.000Z',
    updatedAt: '2026-11-06T08:00:00.000Z'
  }
];

const INITIAL_USERS = [
  {
    id: 'owner-vizag-1',
    name: 'Suresh Varma',
    email: 'suresh.varma@stayfinder.in',
    role: 'owner' as UserRole,
    avatarUrl: '/src/assets/images/avatar_property_owner_1793966391994.jpg',
    phone: '+91 94401 23456',
    isVerifiedOwner: true
  },
  {
    id: 'cust-vizag-1',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    role: 'customer' as UserRole,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+91 99887 66554',
    isVerifiedOwner: false
  },
  {
    id: 'admin-vizag-1',
    name: 'StayFinder Admin',
    email: 'admin@stayfinder.in',
    role: 'admin' as UserRole,
    avatarUrl: '/src/assets/images/avatar_property_owner_1793966391994.jpg',
    phone: '+91 891 400 0000',
    isVerifiedOwner: true
  }
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    propertyId: 'vizag-prop-1',
    propertyTitle: 'MVP Colony Sector 6 Luxury 2 BHK Flat',
    propertyLocality: 'MVP Colony',
    ownerId: 'owner-vizag-1',
    customerId: 'cust-vizag-1',
    customerName: 'Rohan Sharma',
    customerPhone: '+91 99887 66554',
    customerEmail: 'rohan.sharma@example.com',
    tenantType: 'Working Professional',
    expectedMoveInDate: '2026-12-01',
    occupancyCount: 2,
    message: 'Hello Mr. Varma, my colleague and I are working at Wipro IT SEZ. We love the MVP Sector 6 location and would like to schedule a physical visit this Saturday afternoon.',
    status: 'New',
    createdAt: '2026-11-05T14:30:00.000Z'
  }
];

const INITIAL_OFFERS: RentalOffer[] = [
  {
    id: 'off-101',
    propertyId: 'vizag-prop-1',
    propertyTitle: 'MVP Colony Sector 6 Luxury 2 BHK Flat',
    propertyLocality: 'MVP Colony',
    ownerId: 'owner-vizag-1',
    customerId: 'cust-vizag-1',
    customerName: 'Rohan Sharma',
    customerPhone: '+91 99887 66554',
    offeredMonthlyRent: 17500,
    originalMonthlyRent: 18500,
    proposedTenancyMonths: 11,
    proposedMoveInDate: '2026-12-01',
    notes: 'Offering 1-year continuous lease with 2 months upfront deposit.',
    status: 'Pending',
    createdAt: '2026-11-05T15:00:00.000Z'
  }
];

export class DatabaseStore {
  private data: DatabaseSchema;
  private currentActiveUserId: string = 'owner-vizag-1';

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.properties && parsed.properties.some((p: Property) => p.location.city === 'Visakhapatnam')) {
          if (!parsed.enquiries) parsed.enquiries = INITIAL_ENQUIRIES;
          if (!parsed.offers) parsed.offers = INITIAL_OFFERS;
          if (!parsed.reports) parsed.reports = [];
          if (!parsed.favourites) parsed.favourites = [];
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading database file, initializing seeds:', err);
    }

    const initialDb: DatabaseSchema = {
      properties: INITIAL_VIZAG_PROPERTIES,
      bookings: [],
      reviews: [],
      roommates: [],
      expenses: [],
      maintenanceTickets: [],
      enquiries: INITIAL_ENQUIRIES,
      offers: INITIAL_OFFERS,
      reports: [],
      favourites: [],
      users: INITIAL_USERS
    };

    this.saveDatabase(initialDb);
    return initialDb;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public getCurrentUser() {
    return this.data.users.find(u => u.id === this.currentActiveUserId) || this.data.users[0];
  }

  public switchUser(userId: string) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      this.currentActiveUserId = user.id;
      return user;
    }
    return null;
  }

  public updateUserProfile(userId: string, updates: Partial<AppUser>): AppUser | null {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return null;
    Object.assign(user, updates);
    this.saveDatabase();
    return user;
  }

  // --- STRICT VISAKHAPATNAM CITY & LOCALITIES ---
  public getCities() {
    // Strictly Vizag launch market
    return [
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', isPrimaryLaunch: true }
    ];
  }

  public getLocalities(city: string = 'Visakhapatnam') {
    if (city.toLowerCase() === 'visakhapatnam' || city.toLowerCase() === 'vizag') {
      return VIZAG_LOCALITIES;
    }
    return [];
  }

  // --- PROPERTIES CRUD & ADVANCED SEARCH ---
  public getProperties(filters: {
    ownerId?: string;
    search?: string;
    locality?: string;
    city?: string;
    propertyType?: string;
    rentalPeriod?: string;
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
    status?: string;
    verifiedOnly?: boolean;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    page?: number;
    pageSize?: number;
    sortBy?: string;
  }) {
    // Strictly filter to Visakhapatnam properties only
    let list = this.data.properties.filter(p =>
      p.location.city.toLowerCase() === 'visakhapatnam' || p.location.city.toLowerCase() === 'vizag'
    );

    // Filter by Owner if specified (owner dashboard)
    if (filters.ownerId) {
      list = list.filter(p => p.ownerId === filters.ownerId);
    }

    // Locality filter
    if (filters.locality && filters.locality !== 'All') {
      const targetLocality = filters.locality.toLowerCase().trim();
      list = list.filter(p => p.location.locality.toLowerCase().includes(targetLocality));
    }

    // Search query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.locality.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q) ||
        (p.location.landmark && p.location.landmark.toLowerCase().includes(q)) ||
        p.propertyType.toLowerCase().includes(q)
      );
    }

    // Property Type
    if (filters.propertyType && filters.propertyType !== 'All') {
      list = list.filter(p => p.propertyType.toLowerCase() === filters.propertyType!.toLowerCase());
    }

    // Rental Period
    if (filters.rentalPeriod && filters.rentalPeriod !== 'All') {
      list = list.filter(p => p.rentalPeriod.toLowerCase() === filters.rentalPeriod!.toLowerCase());
    }

    // Status filter
    if (filters.status && filters.status !== 'All') {
      const s = filters.status.toLowerCase();
      if (s === 'for rent') {
        list = list.filter(p => p.rentalPeriod === 'Monthly' || p.rentalPeriod === 'Daily');
      } else if (s === 'for sale') {
        list = list.filter(p => p.rentalPeriod === 'Yearly' || p.price > 100000);
      } else if (s === 'sold') {
        list = list.filter(p => p.status === 'Under Offer' || p.status === 'Archived');
      } else {
        list = list.filter(p => p.status.toLowerCase() === s);
      }
    }

    // Verified only filter
    if (filters.verifiedOnly) {
      list = list.filter(p => p.isVerified);
    }

    // Price range
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      list = list.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      list = list.filter(p => p.price <= filters.maxPrice!);
    }

    // Bedrooms
    if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
      list = list.filter(p => p.bedrooms >= filters.bedrooms!);
    }

    // Bathrooms
    if (filters.bathrooms !== undefined && filters.bathrooms > 0) {
      list = list.filter(p => p.bathrooms >= filters.bathrooms!);
    }

    // Area sq.ft
    if (filters.minArea !== undefined && filters.minArea > 0) {
      list = list.filter(p => p.areaSqFt >= filters.minArea!);
    }
    if (filters.maxArea !== undefined && filters.maxArea > 0) {
      list = list.filter(p => p.areaSqFt <= filters.maxArea!);
    }

    // Furnishing status
    if (filters.furnishingStatus && filters.furnishingStatus !== 'All') {
      list = list.filter(p => p.furnishingStatus.toLowerCase() === filters.furnishingStatus!.toLowerCase());
    }

    // Preferences
    if (filters.bachelorFriendly) {
      list = list.filter(p => p.tenantPreferences?.bachelorFriendly || p.genderPreference !== 'Family');
    }
    if (filters.familySuitable) {
      list = list.filter(p => p.tenantPreferences?.familiesAllowed || p.genderPreference === 'Family' || p.genderPreference === 'All');
    }
    if (filters.foodAvailable) {
      list = list.filter(p => p.foodAvailable);
    }

    // Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      list = list.filter(p =>
        filters.amenities!.every(reqAmenity =>
          p.amenities.some(a => a.toLowerCase() === reqAmenity.toLowerCase())
        )
      );
    }

    // Distance calculation
    if (filters.latitude && filters.longitude) {
      const userLat = Number(filters.latitude);
      const userLon = Number(filters.longitude);
      const radius = filters.radiusKm || 15;

      list = list.map(p => ({
        ...p,
        location: {
          ...p.location,
          distanceKm: calculateDistanceKm(userLat, userLon, p.location.latitude, p.location.longitude)
        }
      }));

      if (filters.radiusKm) {
        list = list.filter(p => (p.location.distanceKm || 0) <= radius);
      }
    }

    // Sorting
    if (filters.sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'distance' && filters.latitude && filters.longitude) {
      list.sort((a, b) => (a.location.distanceKm || 999) - (b.location.distanceKm || 999));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = list.length;
    const page = Math.max(1, filters.page || 1);
    const pageSize = Math.max(1, filters.pageSize || 8);
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = list.slice(startIndex, startIndex + pageSize);

    return {
      properties: paginatedItems,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  public getNearbyProperties(lat: number, lon: number, radiusKm: number = 10, limit: number = 6) {
    const list = this.data.properties
      .filter(p => p.status === 'Published' || p.status === 'Active' || p.status === 'Approved')
      .map(p => ({
        ...p,
        location: {
          ...p.location,
          distanceKm: calculateDistanceKm(lat, lon, p.location.latitude, p.location.longitude)
        }
      }))
      .filter(p => (p.location.distanceKm || 0) <= radiusKm)
      .sort((a, b) => (a.location.distanceKm || 0) - (b.location.distanceKm || 0))
      .slice(0, limit);

    return list;
  }

  public getPropertyById(id: string): Property | undefined {
    return this.data.properties.find(p => p.id === id);
  }

  public createProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): { success: boolean; data?: Property; error?: string } {
    // Strict Vizag boundary check
    const lat = property.location.latitude;
    const lon = property.location.longitude;

    if (lat < VIZAG_BOUNDS.minLat || lat > VIZAG_BOUNDS.maxLat || lon < VIZAG_BOUNDS.minLon || lon > VIZAG_BOUNDS.maxLon) {
      return {
        success: false,
        error: `Property location (${lat.toFixed(4)}, ${lon.toFixed(4)}) is outside the authorized Visakhapatnam service boundary.`
      };
    }

    if (property.location.city.toLowerCase() !== 'visakhapatnam' && property.location.city.toLowerCase() !== 'vizag') {
      return {
        success: false,
        error: 'StayFinder is currently launched strictly for Visakhapatnam (Vizag), Andhra Pradesh.'
      };
    }

    const newProperty: Property = {
      ...property,
      id: `vizag-prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.properties.unshift(newProperty);
    this.saveDatabase();
    return { success: true, data: newProperty };
  }

  public updateProperty(id: string, updates: Partial<Property>): Property | null {
    const idx = this.data.properties.findIndex(p => p.id === id);
    if (idx === -1) return null;

    this.data.properties[idx] = {
      ...this.data.properties[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveDatabase();
    return this.data.properties[idx];
  }

  public deleteProperty(id: string): boolean {
    const initialLen = this.data.properties.length;
    this.data.properties = this.data.properties.filter(p => p.id !== id);
    if (this.data.properties.length !== initialLen) {
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // --- ENQUIRIES ---
  public createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
    const newEnq: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    if (!this.data.enquiries) this.data.enquiries = [];
    this.data.enquiries.unshift(newEnq);
    this.saveDatabase();
    return newEnq;
  }

  public getEnquiries(ownerId?: string, customerId?: string): Enquiry[] {
    let list = this.data.enquiries || [];
    if (ownerId) list = list.filter(e => e.ownerId === ownerId);
    if (customerId) list = list.filter(e => e.customerId === customerId);
    return list;
  }

  public updateEnquiryStatus(enquiryId: string, status: 'New' | 'Contacted' | 'Closed'): Enquiry | null {
    const enq = (this.data.enquiries || []).find(e => e.id === enquiryId);
    if (!enq) return null;
    enq.status = status;
    this.saveDatabase();
    return enq;
  }

  // --- OFFERS ---
  public getOffers(ownerId?: string, customerId?: string): RentalOffer[] {
    let list = this.data.offers || [];
    if (ownerId) list = list.filter(o => o.ownerId === ownerId);
    if (customerId) list = list.filter(o => o.customerId === customerId);
    return list;
  }

  public createOffer(offer: Omit<RentalOffer, 'id' | 'createdAt' | 'status'>): RentalOffer {
    const newOffer: RentalOffer = {
      ...offer,
      id: `off-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    if (!this.data.offers) this.data.offers = [];
    this.data.offers.unshift(newOffer);
    this.saveDatabase();
    return newOffer;
  }

  public updateOfferStatus(offerId: string, status: 'Accepted' | 'Rejected' | 'Countered'): RentalOffer | null {
    const off = (this.data.offers || []).find(o => o.id === offerId);
    if (!off) return null;
    off.status = status;
    this.saveDatabase();
    return off;
  }

  // --- REPORTS ---
  public createReport(report: Omit<PropertyReport, 'id' | 'createdAt' | 'status'>): PropertyReport {
    const newReport: PropertyReport = {
      ...report,
      id: `rep-${Date.now()}`,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };
    if (!this.data.reports) this.data.reports = [];
    this.data.reports.unshift(newReport);
    this.saveDatabase();
    return newReport;
  }

  public getReports(): PropertyReport[] {
    return this.data.reports || [];
  }

  // --- FAVOURITES ---
  public getFavourites(userId: string): string[] {
    return (this.data.favourites || []).filter(f => f.userId === userId).map(f => f.propertyId);
  }

  public toggleFavourite(userId: string, propertyId: string): boolean {
    if (!this.data.favourites) this.data.favourites = [];
    const idx = this.data.favourites.findIndex(f => f.userId === userId && f.propertyId === propertyId);
    if (idx >= 0) {
      this.data.favourites.splice(idx, 1);
      this.saveDatabase();
      return false; // Removed
    } else {
      this.data.favourites.push({
        userId,
        propertyId,
        createdAt: new Date().toISOString()
      });
      this.saveDatabase();
      return true; // Added
    }
  }

  // --- BOOKING WORKFLOW WITH DOUBLE-BOOKING PROTECTION ---
  public createBooking(bookingReq: {
    propertyId: string;
    roomTypeId: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    checkInDate: string;
    stayDurationMonths?: number;
    guestsCount: number;
  }): { success: boolean; booking?: Booking; error?: string } {
    const property = this.getPropertyById(bookingReq.propertyId);
    if (!property) {
      return { success: false, error: 'Property not found' };
    }

    const roomType = property.roomTypes.find(rt => rt.id === bookingReq.roomTypeId);
    if (!roomType) {
      return { success: false, error: 'Selected room type does not exist' };
    }

    if (roomType.availableRooms <= 0) {
      return { success: false, error: 'No inventory available for the selected room type' };
    }

    roomType.availableRooms -= 1;

    const monthlyRent = roomType.priceMonthly;
    const securityDeposit = roomType.securityDeposit;
    const platformFee = 999;
    const totalAmountDue = monthlyRent + securityDeposit + platformFee;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyThumbnail: property.thumbnailUrl,
      propertyLocation: `${property.location.locality}, ${property.location.city}`,
      roomTypeId: roomType.id,
      roomTypeName: roomType.name,
      customerId: bookingReq.customerId,
      customerName: bookingReq.customerName,
      customerEmail: bookingReq.customerEmail,
      customerPhone: bookingReq.customerPhone,
      checkInDate: bookingReq.checkInDate,
      stayDurationMonths: bookingReq.stayDurationMonths || 1,
      guestsCount: bookingReq.guestsCount,
      monthlyRent,
      securityDeposit,
      platformFee,
      totalAmountDue,
      currency: 'INR',
      status: 'Awaiting Payment',
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Reservation lock acquired; awaiting payment verification'
        }
      ]
    };

    this.data.bookings.unshift(newBooking);
    this.saveDatabase();

    return { success: true, booking: newBooking };
  }

  public getBookings(customerId?: string, ownerId?: string): Booking[] {
    if (customerId) {
      return this.data.bookings.filter(b => b.customerId === customerId);
    }
    if (ownerId) {
      const ownerPropIds = new Set(this.data.properties.filter(p => p.ownerId === ownerId).map(p => p.id));
      return this.data.bookings.filter(b => ownerPropIds.has(b.propertyId));
    }
    return this.data.bookings;
  }

  public cancelBooking(bookingId: string, reason?: string): Booking | null {
    const booking = this.data.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = 'Cancelled';
    booking.statusHistory.push({
      status: 'Cancelled',
      timestamp: new Date().toISOString(),
      note: reason || 'Booking cancelled by user request'
    });

    // Restore room inventory
    const property = this.getPropertyById(booking.propertyId);
    if (property) {
      const room = property.roomTypes.find(rt => rt.id === booking.roomTypeId);
      if (room) {
        room.availableRooms = Math.min(room.totalRooms, room.availableRooms + 1);
      }
    }

    this.saveDatabase();
    return booking;
  }

  public confirmBookingPayment(bookingId: string, paymentId: string): Booking | null {
    const booking = this.data.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = 'Confirmed';
    booking.paymentStatus = 'Paid';
    booking.paymentId = paymentId;
    booking.statusHistory.push({
      status: 'Confirmed',
      timestamp: new Date().toISOString(),
      note: `Razorpay payment captured successfully (${paymentId})`
    });

    this.saveDatabase();
    return booking;
  }

  // --- OWNER ANALYTICS CALCULATION ---
  public getOwnerAnalytics(ownerId: string) {
    const properties = this.data.properties.filter(p => p.ownerId === ownerId);
    const bookings = this.getBookings(undefined, ownerId);
    const enquiries = this.getEnquiries(ownerId);
    const offers = this.getOffers(ownerId);

    const totalRooms = properties.reduce((sum, p) => sum + p.totalRooms, 0);
    const occupiedRooms = bookings.filter(b => b.status === 'Confirmed').length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    const monthlyGrossRevenue = bookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.monthlyRent, 0);

    // Calculate average rent by Vizag locality
    const localityBreakdown: Record<string, { count: number; avgRent: number }> = {};
    properties.forEach(p => {
      const loc = p.location.locality;
      if (!localityBreakdown[loc]) {
        localityBreakdown[loc] = { count: 0, avgRent: 0 };
      }
      localityBreakdown[loc].count += 1;
      localityBreakdown[loc].avgRent += p.price;
    });

    Object.keys(localityBreakdown).forEach(k => {
      localityBreakdown[k].avgRent = Math.round(localityBreakdown[k].avgRent / localityBreakdown[k].count);
    });

    return {
      totalProperties: properties.length,
      publishedProperties: properties.filter(p => p.status === 'Published').length,
      pendingProperties: properties.filter(p => p.status === 'Pending verification').length,
      totalRooms,
      occupiedRooms,
      occupancyRate,
      monthlyGrossRevenue,
      totalEnquiries: enquiries.length,
      activeOffers: offers.filter(o => o.status === 'Pending').length,
      localityBreakdown
    };
  }

  // --- ROOMMATE PROFILES ---
  public getRoommates(city: string = 'Visakhapatnam'): RoommateProfile[] {
    if (city && city !== 'All') {
      return this.data.roommates.filter(r => r.city.toLowerCase() === city.toLowerCase());
    }
    return this.data.roommates;
  }

  // --- HOUSEHOLD EXPENSES ---
  public getExpenses(): HouseholdExpense[] {
    return this.data.expenses;
  }

  public addExpense(expense: Omit<HouseholdExpense, 'id'>): HouseholdExpense {
    const newExp: HouseholdExpense = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    this.data.expenses.unshift(newExp);
    this.saveDatabase();
    return newExp;
  }

  // --- MAINTENANCE TICKETS ---
  public getMaintenanceTickets(propertyId?: string): MaintenanceTicket[] {
    if (propertyId) {
      return this.data.maintenanceTickets.filter(m => m.propertyId === propertyId);
    }
    return this.data.maintenanceTickets;
  }

  public createMaintenanceTicket(ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>): MaintenanceTicket {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `mnt-${Date.now()}`,
      status: 'Reported',
      createdAt: new Date().toISOString()
    };
    this.data.maintenanceTickets.unshift(newTicket);
    this.saveDatabase();
    return newTicket;
  }
}

export const db = new DatabaseStore();
