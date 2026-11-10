import clinicImg from "@/assets/provider-clinic.jpg";
import boardingImg from "@/assets/provider-boarding.jpg";
import diagnosticsImg from "@/assets/provider-diagnostics.jpg";
import ambulanceImg from "@/assets/provider-ambulance.jpg";
import ngoImg from "@/assets/provider-ngo.jpg";
import exoticImg from "@/assets/provider-exotic.jpg";

export const CATEGORIES = [
  "Veterinary Clinics",
  "Emergency Hospitals",
  "Boarding & Daycare",
  "Diagnostics & Labs",
  "Pet Ambulance",
  "Rescue NGOs",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const PET_TYPES = ["Dogs", "Cats", "Exotic/Birds"] as const;
export type PetType = (typeof PET_TYPES)[number];

export const FILTER_TAGS = [
  "Open 24/7",
  "Home Visits Available",
  "ICU Facility",
  "Verified NGO",
  "Rating 4.0+",
] as const;
export type FilterTag = (typeof FILTER_TAGS)[number];

export type Provider = {
  id: string;
  name: string;
  category: Category;
  area: string;
  address: string;
  phone: string;
  image: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  openNow: boolean;
  hours: string;
  open247: boolean;
  homeVisits: boolean;
  icu: boolean;
  verifiedNgo: boolean;
  pets: PetType[];
  services: string[];
  fee?: string;
};

// Sample directory for the prototype (names, numbers and addresses are illustrative).
export const PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "Sanjivani Pet Hospital",
    category: "Emergency Hospitals",
    area: "Thaltej",
    address: "Near Thaltej Cross Roads, SG Highway, Ahmedabad",
    phone: "+917940001101",
    image: clinicImg,
    distanceKm: 0.8,
    rating: 4.8,
    reviews: 1240,
    openNow: true,
    hours: "Open 24 hours",
    open247: true,
    homeVisits: false,
    icu: true,
    verifiedNgo: false,
    pets: ["Dogs", "Cats"],
    services: ["Emergency", "Surgery", "ICU"],
    fee: "₹600 consult",
  },
  {
    id: "p2",
    name: "Pawsitive Vet Clinic",
    category: "Veterinary Clinics",
    area: "Bodakdev",
    address: "Judges Bungalow Rd, Bodakdev, Ahmedabad",
    phone: "+917940001102",
    image: clinicImg,
    distanceKm: 1.9,
    rating: 4.6,
    reviews: 486,
    openNow: true,
    hours: "9:00 AM – 9:00 PM",
    open247: false,
    homeVisits: true,
    icu: false,
    verifiedNgo: false,
    pets: ["Dogs", "Cats"],
    services: ["Vaccination", "Dental", "Grooming"],
    fee: "₹450 consult",
  },
  {
    id: "p3",
    name: "Wings & Scales Exotic Care",
    category: "Veterinary Clinics",
    area: "Vastrapur",
    address: "Vastrapur Lake Rd, Ahmedabad",
    phone: "+917940001103",
    image: exoticImg,
    distanceKm: 3.2,
    rating: 4.7,
    reviews: 212,
    openNow: false,
    hours: "Opens 10:00 AM",
    open247: false,
    homeVisits: true,
    icu: false,
    verifiedNgo: false,
    pets: ["Exotic/Birds"],
    services: ["Avian", "Reptiles", "Rabbits"],
    fee: "₹700 consult",
  },
  {
    id: "p4",
    name: "Happy Tails Boarding & Daycare",
    category: "Boarding & Daycare",
    area: "Science City",
    address: "Science City Rd, Sola, Ahmedabad",
    phone: "+917940001104",
    image: boardingImg,
    distanceKm: 4.1,
    rating: 4.5,
    reviews: 338,
    openNow: true,
    hours: "7:00 AM – 10:00 PM",
    open247: false,
    homeVisits: false,
    icu: false,
    verifiedNgo: false,
    pets: ["Dogs", "Cats"],
    services: ["Daycare", "Overnight", "Live cam"],
    fee: "₹900 / night",
  },
  {
    id: "p5",
    name: "VetLab Diagnostics",
    category: "Diagnostics & Labs",
    area: "Prahlad Nagar",
    address: "Corporate Rd, Prahlad Nagar, Ahmedabad",
    phone: "+917940001105",
    image: diagnosticsImg,
    distanceKm: 5.6,
    rating: 4.4,
    reviews: 174,
    openNow: true,
    hours: "8:00 AM – 8:00 PM",
    open247: false,
    homeVisits: true,
    icu: false,
    verifiedNgo: false,
    pets: ["Dogs", "Cats", "Exotic/Birds"],
    services: ["Blood tests", "X-ray", "Ultrasound"],
    fee: "Home sample ₹250",
  },
  {
    id: "p6",
    name: "Rapid Paws Pet Ambulance",
    category: "Pet Ambulance",
    area: "Citywide",
    address: "Dispatch hub: Memnagar, Ahmedabad",
    phone: "+917940001106",
    image: ambulanceImg,
    distanceKm: 2.4,
    rating: 4.9,
    reviews: 902,
    openNow: true,
    hours: "Open 24 hours",
    open247: true,
    homeVisits: true,
    icu: false,
    verifiedNgo: false,
    pets: ["Dogs", "Cats", "Exotic/Birds"],
    services: ["Oxygen", "Stretcher", "Trained paramedic"],
    fee: "From ₹800",
  },
  {
    id: "p7",
    name: "Second Chance Animal Rescue",
    category: "Rescue NGOs",
    area: "Gota",
    address: "Gota Village Rd, Ahmedabad",
    phone: "+917940001107",
    image: ngoImg,
    distanceKm: 6.8,
    rating: 4.8,
    reviews: 655,
    openNow: true,
    hours: "Helpline 24 hours",
    open247: true,
    homeVisits: false,
    icu: false,
    verifiedNgo: true,
    pets: ["Dogs", "Cats"],
    services: ["Street rescue", "Adoption", "Sterilisation"],
  },
  {
    id: "p8",
    name: "CityCare Veterinary Hospital",
    category: "Emergency Hospitals",
    area: "Satellite",
    address: "Satellite Rd, Jodhpur, Ahmedabad",
    phone: "+917940001108",
    image: clinicImg,
    distanceKm: 4.9,
    rating: 3.9,
    reviews: 268,
    openNow: true,
    hours: "Open 24 hours",
    open247: true,
    homeVisits: false,
    icu: true,
    verifiedNgo: false,
    pets: ["Dogs", "Cats"],
    services: ["Emergency", "ICU", "Orthopaedics"],
    fee: "₹500 consult",
  },
  {
    id: "p9",
    name: "Jivdaya Bird Hospital",
    category: "Rescue NGOs",
    area: "Paldi",
    address: "Paldi Cross Roads, Ahmedabad",
    phone: "+917940001109",
    image: exoticImg,
    distanceKm: 8.3,
    rating: 4.6,
    reviews: 421,
    openNow: false,
    hours: "Opens 8:00 AM",
    open247: false,
    homeVisits: false,
    icu: true,
    verifiedNgo: true,
    pets: ["Exotic/Birds"],
    services: ["Bird rescue", "Kite-string injuries", "Rehab"],
  },
  {
    id: "p10",
    name: "Furry Friends Home Vet",
    category: "Veterinary Clinics",
    area: "Ghatlodia",
    address: "Home visits across west Ahmedabad",
    phone: "+917940001110",
    image: clinicImg,
    distanceKm: 2.9,
    rating: 4.3,
    reviews: 129,
    openNow: false,
    hours: "Opens 9:00 AM",
    open247: false,
    homeVisits: true,
    icu: false,
    verifiedNgo: false,
    pets: ["Dogs", "Cats"],
    services: ["Home consult", "Vaccination", "Elder care"],
    fee: "₹800 home visit",
  },
];

export type ProviderQuery = {
  category: Category | "All";
  pet: PetType | "All";
  tags: FilterTag[];
  text: string;
  sort: "distance" | "rating";
};

export const DEFAULT_QUERY: ProviderQuery = {
  category: "All",
  pet: "All",
  tags: [],
  text: "",
  sort: "distance",
};

/** Every selected tag must match (AND). "Rating 4.0+" keeps providers rated 4.0 or higher. */
export function filterProviders(list: Provider[], q: ProviderQuery): Provider[] {
  const text = q.text.trim().toLowerCase();
  const out = list.filter((p) => {
    if (q.category !== "All" && p.category !== q.category) return false;
    if (q.pet !== "All" && !p.pets.includes(q.pet)) return false;
    for (const tag of q.tags) {
      if (tag === "Open 24/7" && !p.open247) return false;
      if (tag === "Home Visits Available" && !p.homeVisits) return false;
      if (tag === "ICU Facility" && !p.icu) return false;
      if (tag === "Verified NGO" && !p.verifiedNgo) return false;
      if (tag === "Rating 4.0+" && p.rating < 4.0) return false;
    }
    if (text) {
      const hay = `${p.name} ${p.area} ${p.address} ${p.services.join(" ")}`.toLowerCase();
      if (!hay.includes(text)) return false;
    }
    return true;
  });
  return out.sort((a, b) => (q.sort === "rating" ? b.rating - a.rating : a.distanceKm - b.distanceKm));
}

/** Nearest providers that can take an emergency right now. */
export function nearestEmergency(list: Provider[], limit = 3): Provider[] {
  return list
    .filter((p) => p.open247 && p.openNow && (p.category === "Emergency Hospitals" || p.category === "Pet Ambulance"))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export const SOS_PHONE = "+917940009999";

export function directionsUrl(p: Pick<Provider, "name" | "address">) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.name}, ${p.address}`)}`;
}
