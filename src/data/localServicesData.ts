
export interface LocalService {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website?: string;
  categories: string[];
  description: string;
  relevantFor: string[];
}

export const localServicesData: LocalService[] = [
  {
    id: "1",
    name: "Dallas Brain Injury Support Group",
    address: "2800 Live Oak St",
    city: "Dallas",
    state: "TX",
    zip: "75204",
    phone: "(214) 555-1234",
    website: "https://example.com/dbsg",
    categories: ["Support Group", "TBI", "ABI"],
    description: "Weekly support group for individuals with brain injuries and their families.",
    relevantFor: ["tbi", "abi", "caregiver"],
  },
  {
    id: "2",
    name: "Texas NeuroRehab Center",
    address: "6301 Gaston Ave",
    city: "Dallas",
    state: "TX",
    zip: "75214",
    phone: "(214) 555-2345",
    website: "https://example.com/tnrc",
    categories: ["Rehabilitation", "Medical", "TBI", "ABI"],
    description: "Comprehensive rehabilitation services for individuals with brain injuries.",
    relevantFor: ["tbi", "abi", "caregiver"],
  },
  {
    id: "3",
    name: "Mental Health Dallas",
    address: "4300 MacArthur Ave",
    city: "Dallas",
    state: "TX",
    zip: "75209",
    phone: "(214) 555-3456",
    website: "https://example.com/mhd",
    categories: ["Mental Health", "Counseling"],
    description: "Mental health services including counseling, therapy, and support groups.",
    relevantFor: ["tbi", "abi", "mental-health", "caregiver"],
  },
  {
    id: "4",
    name: "Dallas Caregiver Support Center",
    address: "5500 Greenville Ave",
    city: "Dallas",
    state: "TX",
    zip: "75206",
    phone: "(214) 555-4567",
    website: "https://example.com/dcsc",
    categories: ["Support Group", "Caregivers", "Respite"],
    description: "Support services and resources specifically for caregivers.",
    relevantFor: ["caregiver"],
  },
  {
    id: "5",
    name: "Parkland Hospital Neurology Department",
    address: "5200 Harry Hines Blvd",
    city: "Dallas",
    state: "TX",
    zip: "75235",
    phone: "(214) 555-5678",
    website: "https://example.com/phnd",
    categories: ["Medical", "Neurology", "TBI", "ABI"],
    description: "Comprehensive neurological care and services.",
    relevantFor: ["tbi", "abi", "caregiver"],
  },
  {
    id: "6",
    name: "Metrocare Services",
    address: "1380 River Bend Dr",
    city: "Dallas",
    state: "TX",
    zip: "75247",
    phone: "(214) 555-6789",
    website: "https://example.com/metrocare",
    categories: ["Mental Health", "Counseling", "Support"],
    description: "Mental health services and support for adults, children, and families.",
    relevantFor: ["mental-health", "caregiver"],
  },
];

export const getServicesByUserType = (userType: string | null) => {
  if (!userType) return localServicesData;
  return localServicesData.filter(service => service.relevantFor.includes(userType));
};

export const getServicesByCategory = (category: string | null) => {
  if (!category) return localServicesData;
  return localServicesData.filter(service => service.categories.includes(category));
};
