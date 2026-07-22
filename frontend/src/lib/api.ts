export type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export type Destination = {
  id: number;
  name: string;
  country: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string;
  best_season: string;
  visa_note: string;
  is_featured: boolean;
  tours_count?: number;
};

export type Departure = {
  id: number;
  start_date: string;
  end_date: string;
  seats_available: number;
  price_override: string | null;
  status: string;
};

export type ItineraryDay = {
  id: number;
  day: number;
  title: string;
  description: string;
  meals: string;
};

export type Tour = {
  id: number;
  title: string;
  slug: string;
  destination: Destination;
  category: Category;
  summary: string;
  description?: string;
  duration_days: number;
  duration_nights: number;
  price_from: string;
  currency: string;
  departure_city: string;
  group_size: string;
  visa_required: boolean;
  visa_note?: string;
  cover_image_url: string;
  gallery?: string[];
  highlights: string[];
  included?: string[];
  excluded?: string[];
  is_featured: boolean;
  next_departure?: Departure | null;
  departures?: Departure[];
  itinerary?: ItineraryDay[];
};

export type SiteSettings = {
  company_name: string;
  tagline: string;
  about: string;
  address: string;
  working_hours: string;
  phone: string;
  telegram_url: string;
  instagram_url: string;
  whatsapp_url: string;
  email: string;
  ai_disclaimer: string;
};

export type FAQ = { id: number; question: string; answer: string };
export type Testimonial = { id: number; name: string; destination: string; quote: string; rating: number };

export type HomeData = {
  settings: SiteSettings | null;
  featured_tours: Tour[];
  destinations: Destination[];
  categories: Category[];
  faqs: FAQ[];
  testimonials: Testimonial[];
};

const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
const INTERNAL_API_BASE = process.env.API_INTERNAL_BASE_URL || PUBLIC_API_BASE;

function getApiBase() {
  return typeof window === "undefined" ? INTERNAL_API_BASE : PUBLIC_API_BASE;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getHome(): Promise<HomeData> {
  try {
    return await request<HomeData>("/home/");
  } catch {
    return fallbackHome;
  }
}

export async function getTours(): Promise<Tour[]> {
  try {
    const data = await request<{ results?: Tour[] } | Tour[]>("/tours/");
    return Array.isArray(data) ? data : data.results || [];
  } catch {
    return fallbackHome.featured_tours;
  }
}

export async function getTour(slug: string): Promise<Tour | null> {
  try {
    return await request<Tour>(`/tours/${slug}/`);
  } catch {
    return fallbackHome.featured_tours.find((tour) => tour.slug === slug) || null;
  }
}

export async function getDestinations(): Promise<Destination[]> {
  try {
    const data = await request<{ results?: Destination[] } | Destination[]>("/destinations/");
    return Array.isArray(data) ? data : data.results || [];
  } catch {
    return fallbackHome.destinations;
  }
}

const baseCategory: Category = {
  id: 1,
  name: "Beach holidays",
  slug: "beach-holidays",
  icon: "Palmtree",
  description: "Plyaj va dam olish sayohatlari",
};

const destinationDubai: Destination = {
  id: 1,
  name: "Dubai",
  country: "BAA",
  slug: "baa-dubai",
  short_description: "Shahar, shopping, plyaj va premium servis.",
  description: "BAA bo'yicha zamonaviy city break va resort paketlari.",
  image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
  best_season: "Oktyabr - Aprel",
  visa_note: "Viza bo'yicha maslahat kerak",
  is_featured: true,
  tours_count: 1,
};

const destinationTurkey: Destination = {
  id: 2,
  name: "Antalya",
  country: "Turkiya",
  slug: "turkiya-antalya",
  short_description: "Dengiz, resort mehmonxonalar va oilaviy hordiq.",
  description: "Turkiya oilaviy dam olish uchun eng ommabop yo'nalishlardan biri.",
  image_url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1400&q=80",
  best_season: "May - Oktyabr",
  visa_note: "Odatda soddaroq kirish tartibi",
  is_featured: true,
  tours_count: 1,
};

const destinationEgypt: Destination = {
  id: 3,
  name: "Sharm El Sheikh",
  country: "Misr",
  slug: "misr-sharm",
  short_description: "Qizil dengiz va all-inclusive dam olish.",
  description: "Misr bo'yicha dengiz va resort yo'nalishi.",
  image_url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1400&q=80",
  best_season: "Yil davomida",
  visa_note: "Kirib borish talablari menejer bilan aniqlashtiriladi",
  is_featured: true,
  tours_count: 1,
};

const destinationBali: Destination = {
  id: 4,
  name: "Bali",
  country: "Indoneziya",
  slug: "indoneziya-bali",
  short_description: "Honeymoon va villa dam olish yo'nalishi.",
  description: "Romantik va sokin dam olish uchun tanlangan yo'nalish.",
  image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80",
  best_season: "Aprel - Oktyabr",
  visa_note: "Viza va kirish qoidalari bo'yicha maslahat kerak",
  is_featured: true,
  tours_count: 1,
};

const destinationGeorgia: Destination = {
  id: 5,
  name: "Tbilisi",
  country: "Gruziya",
  slug: "gruziya-tbilisi",
  short_description: "Qisqa city break va gastronomik dam olish.",
  description: "Qulay masofadagi yaqin city break yo'nalishi.",
  image_url: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=1400&q=80",
  best_season: "Mart - Noyabr",
  visa_note: "Ko'pincha soddaroq kirish tartibi",
  is_featured: true,
  tours_count: 1,
};

export const fallbackHome: HomeData = {
  settings: {
    company_name: "SuperTour.uz",
    tagline: "Sayohat rejalashtiryapsizmi? SuperTour bilan bu yanada oson, tez va ilhomli.",
    about:
      "SuperTour.uz O'zbekistonda faoliyat yurituvchi zamonaviy turizm kompaniyasi bo'lib, mijozlarga mashhur xalqaro yo'nalishlar bo'yicha sayohat xizmatlarini taqdim etadi. Oilaviy safar, honeymoon, premium city break va dam olish paketlari qulay ko'rinishda jamlangan.",
    address: "Yunusobod tumani, Yangishahar ko'chasi 10, 2-qavat, 210-xona, Toshkent.",
    working_hours: "Dushanba - Shanba, 09:00 - 18:00",
    phone: "+998 99 810 70 90",
    telegram_url: "https://t.me/supertouruz",
    instagram_url: "https://www.instagram.com/supertour_uz/",
    whatsapp_url: "https://wa.me/998998107090",
    email: "",
    ai_disclaimer: "Assistant tasdiqlangan kompaniya ma'lumotlari va saytdagi turlar asosida javob beradi.",
  },
  destinations: [destinationDubai, destinationTurkey, destinationEgypt, destinationBali, destinationGeorgia],
  categories: [baseCategory],
  faqs: [
    {
      id: 1,
      question: "SuperTour.uz necha yildan beri ishlaydi?",
      answer: "Ochiq manbalarda tashkil topgan yil tasdiqlanmagani uchun aniq yil ko'rsatilmaydi.",
    },
    {
      id: 2,
      question: "Tur narxiga nimalar kiradi?",
      answer: "Paket tarkibi turga qarab farq qiladi, lekin odatda mehmonxona, transfer va bronlash yordami tushuntiriladi.",
    },
    {
      id: 3,
      question: "Viza bo'yicha yordam bormi?",
      answer: "Viza talab qilinadigan yo'nalishlarda hujjatlar bo'yicha menejer yo'l-yo'riq beradi.",
    },
  ],
  testimonials: [
    { id: 1, name: "Madina", destination: "Dubai", quote: "Qisqa vaqt ichida bir necha variant solishtirib berdilar.", rating: 5 },
    { id: 2, name: "Akmal", destination: "Antalya", quote: "Oilaviy dam olish uchun juda qulay paket tanlandi.", rating: 5 },
    { id: 3, name: "Dilnoza", destination: "Bali", quote: "Honeymoon uchun xotirjam va chiroyli variant bo'ldi.", rating: 5 },
  ],
  featured_tours: [
    {
      id: 1,
      title: "Dubai Urban Escape",
      slug: "dubai-urban-escape",
      destination: destinationDubai,
      category: baseCategory,
      summary: "BAA bo'yicha 5 kunlik qulay shahar va plyaj paketi.",
      duration_days: 5,
      duration_nights: 4,
      price_from: "520.00",
      currency: "USD",
      departure_city: "Toshkent",
      group_size: "2-12 kishi",
      visa_required: true,
      cover_image_url: destinationDubai.image_url,
      highlights: ["Mehmonxona tanlash", "Transfer koordinatsiyasi", "Avia maslahat"],
      is_featured: true,
    },
    {
      id: 2,
      title: "Antalya Family Resort",
      slug: "antalya-family-resort",
      destination: destinationTurkey,
      category: baseCategory,
      summary: "Turkiya bo'yicha oilaviy resort dam olish paketi.",
      duration_days: 7,
      duration_nights: 6,
      price_from: "649.00",
      currency: "USD",
      departure_city: "Toshkent",
      group_size: "2-12 kishi",
      visa_required: false,
      cover_image_url: destinationTurkey.image_url,
      highlights: ["Oilaviy resort", "Transfer", "Menejer kuzatuvi"],
      is_featured: true,
    },
    {
      id: 3,
      title: "Sharm All Inclusive",
      slug: "sharm-all-inclusive",
      destination: destinationEgypt,
      category: baseCategory,
      summary: "Misr bo'yicha dengiz va resortga yo'naltirilgan qulay paket.",
      duration_days: 7,
      duration_nights: 6,
      price_from: "480.00",
      currency: "USD",
      departure_city: "Toshkent",
      group_size: "2-10 kishi",
      visa_required: false,
      cover_image_url: destinationEgypt.image_url,
      highlights: ["All-inclusive", "Resort tanlash", "Tez bronlash"],
      is_featured: true,
    },
    {
      id: 4,
      title: "Bali Honeymoon Villa",
      slug: "bali-honeymoon-villa",
      destination: destinationBali,
      category: baseCategory,
      summary: "Romantik villa va sokin dam olishga yo'naltirilgan honeymoon paketi.",
      duration_days: 8,
      duration_nights: 7,
      price_from: "1180.00",
      currency: "USD",
      departure_city: "Toshkent",
      group_size: "2 kishi",
      visa_required: true,
      cover_image_url: destinationBali.image_url,
      highlights: ["Villa", "Romantik muhit", "Menejer tavsiyasi"],
      is_featured: true,
    },
    {
      id: 5,
      title: "Georgia Weekend",
      slug: "georgia-weekend",
      destination: destinationGeorgia,
      category: baseCategory,
      summary: "Yaqin masofadagi city break va gastronomik sayohat paketi.",
      duration_days: 4,
      duration_nights: 3,
      price_from: "390.00",
      currency: "USD",
      departure_city: "Toshkent",
      group_size: "2-8 kishi",
      visa_required: false,
      cover_image_url: destinationGeorgia.image_url,
      highlights: ["Qisqa dam olish", "City break", "Budgetga mos"],
      is_featured: true,
    },
  ],
};
