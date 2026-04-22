import p1 from "@/assets/property-1.jpg";
import p2 from "@/assets/property-2.jpg";
import p3 from "@/assets/property-3.jpg";
import p4 from "@/assets/property-4.jpg";
import p5 from "@/assets/property-5.jpg";
import p6 from "@/assets/property-6.jpg";

export type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  type: "Apartment" | "Villa" | "Penthouse" | "Townhouse" | "Chalet";
  beds: number;
  baths: number;
  area: number; // sqft
  image: string;
  description: string;
  features: string[];
};

export const properties: Property[] = [
  {
    id: "skyline-residence",
    title: "Skyline Residence",
    location: "Downtown, Dubai",
    price: 1250000,
    type: "Apartment",
    beds: 3,
    baths: 2,
    area: 1800,
    image: p1,
    description:
      "A sun-drenched apartment with floor-to-ceiling windows framing the city skyline. Designed with warm, neutral tones for timeless elegance.",
    features: ["Floor-to-ceiling windows", "Concierge service", "Private gym", "Smart home"],
  },
  {
    id: "azure-villa",
    title: "Azure Beachfront Villa",
    location: "Palm Jumeirah, Dubai",
    price: 4800000,
    type: "Villa",
    beds: 5,
    baths: 6,
    area: 6200,
    image: p2,
    description:
      "Wake up to the ocean. This beachfront villa pairs an infinity pool with private beach access and panoramic sunset views.",
    features: ["Private beach", "Infinity pool", "Home cinema", "Staff quarters"],
  },
  {
    id: "summit-penthouse",
    title: "Summit Penthouse",
    location: "Manhattan, New York",
    price: 6750000,
    type: "Penthouse",
    beds: 4,
    baths: 4,
    area: 3400,
    image: p3,
    description:
      "A sculpted penthouse crowning the skyline with a wraparound terrace, ideal for entertaining above the city.",
    features: ["Wraparound terrace", "Private elevator", "Wine cellar", "City views"],
  },
  {
    id: "olive-grove-villa",
    title: "Olive Grove Villa",
    location: "Tuscany, Italy",
    price: 1980000,
    type: "Villa",
    beds: 4,
    baths: 3,
    area: 4100,
    image: p4,
    description:
      "Hand-laid stone, terracotta roof tiles, and an olive grove that has stood for generations. A countryside retreat.",
    features: ["Olive grove", "Wine cellar", "Stone fireplace", "Guest cottage"],
  },
  {
    id: "garden-townhouse",
    title: "Garden Townhouse",
    location: "Lahore, Pakistan",
    price: 420000,
    type: "Townhouse",
    beds: 3,
    baths: 3,
    area: 2400,
    image: p5,
    description:
      "A bright, family-ready townhouse in a quiet, leafy neighbourhood with manicured gardens and a private courtyard.",
    features: ["Private garden", "Gated community", "Covered parking", "Family room"],
  },
  {
    id: "alpine-chalet",
    title: "Alpine Chalet",
    location: "Verbier, Switzerland",
    price: 3950000,
    type: "Chalet",
    beds: 5,
    baths: 5,
    area: 4800,
    image: p6,
    description:
      "Floor-to-ceiling windows look out onto the Alps, while reclaimed timber and stone wrap a warm, cinematic interior.",
    features: ["Ski-in/ski-out", "Stone fireplace", "Sauna & spa", "Mountain views"],
  },
];

export function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
