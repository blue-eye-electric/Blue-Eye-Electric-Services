export type SeoLocation = {
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  areas: string[];
};

export type SeoService = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
};

export const seoLocations: SeoLocation[] = [
  {
    state: "Bihar",
    stateSlug: "bihar",
    city: "Patna",
    citySlug: "patna",
    areas: ["Kankarbagh", "Boring Road", "Rajendra Nagar", "Danapur"],
  },
  {
    state: "Bihar",
    stateSlug: "bihar",
    city: "Gaya",
    citySlug: "gaya",
    areas: ["Bodh Gaya", "Manpur", "Gaya town"],
  },
  {
    state: "Bihar",
    stateSlug: "bihar",
    city: "Muzaffarpur",
    citySlug: "muzaffarpur",
    areas: ["Brahmapura", "Mithanpura", "Kanti"],
  },
  {
    state: "Bihar",
    stateSlug: "bihar",
    city: "Bhagalpur",
    citySlug: "bhagalpur",
    areas: ["Tilkamanjhi", "Barari", "Nathnagar"],
  },
  {
    state: "Bihar",
    stateSlug: "bihar",
    city: "Darbhanga",
    citySlug: "darbhanga",
    areas: ["Laheriasarai", "Benta", "Darbhanga town"],
  },
  {
    state: "Bihar",
    stateSlug: "bihar",
    city: "Purnia",
    citySlug: "purnia",
    areas: ["Purnia town", "Gulabbagh", "Line Bazar"],
  },
  {
    state: "Bihar",
    stateSlug: "bihar",
    city: "Lakhisarai",
    citySlug: "lakhisarai",
    areas: ["Lakhisarai town", "Balgudar", "Barahiya"],
  },
];

export const seoServices: SeoService[] = [
  {
    slug: "electrician",
    name: "Electrician Services",
    shortName: "electrician service",
    description:
      "Book a verified electrician for home and business electrical repairs, installation, troubleshooting and inspections.",
  },
  {
    slug: "house-wiring",
    name: "House Wiring Services",
    shortName: "house wiring",
    description:
      "Plan safe new-home wiring, rewiring and electrical installation with an experienced local electrician.",
  },
  {
    slug: "fan-repair-installation",
    name: "Fan Repair and Installation",
    shortName: "fan repair and installation",
    description:
      "Get help with ceiling fan installation, replacement, noise, speed and common fan electrical problems.",
  },
  {
    slug: "switch-socket-repair",
    name: "Switch and Socket Repair",
    shortName: "switch and socket repair",
    description:
      "Fix loose, damaged or non-working switches and sockets with a convenient electrician visit.",
  },
  {
    slug: "mcb-fuse",
    name: "MCB and Fuse Services",
    shortName: "MCB and fuse service",
    description:
      "Get support for tripping MCBs, fuse problems, replacement and common electrical protection issues.",
  },
  {
    slug: "inverter",
    name: "Inverter Services",
    shortName: "inverter service",
    description:
      "Arrange inverter installation and practical support for inverter-related electrical work at home.",
  },
];

export function getSeoLocation(
  stateSlug: string,
  citySlug: string,
): SeoLocation | undefined {
  return seoLocations.find(
    (location) =>
      location.stateSlug === stateSlug && location.citySlug === citySlug,
  );
}

export function getSeoService(slug: string): SeoService | undefined {
  return seoServices.find((service) => service.slug === slug);
}
