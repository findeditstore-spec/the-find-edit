export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  price: string;
  store: string;
  category: string;
  subcategory: string;
  affiliate_link?: string | null;
};

export const products: Product[] = [
  // =========================
  // FASHION
  // =========================

 {
  id: "fashion-001",
  slug: "black-shoulder-bag",
  name: "Black Shoulder Bag",
  description:
    "A simple everyday shoulder bag that works with casual and dressed-up looks.",
  image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Black+Shoulder+Bag",
  price: "From R249",
    store: "SHEIN",
    category: "Fashion",
    subcategory: "Bags",
  },

  {
    id: "fashion-002",
    slug: "classic-white-sneakers",
    name: "Classic White Sneakers",
    description:
      "A clean everyday sneaker that pairs easily with jeans, dresses and casual outfits.",
    image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=White+Sneakers",
    price: "From R399",
    store: "Temu",
    category: "Fashion",
    subcategory: "Shoes",
  },

  {
    id: "fashion-003",
    slug: "satin-mini-dress",
    name: "Satin Mini Dress",
    description:
      "A simple satin-style dress suited to birthdays, dinners and nights out.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Satin+Mini+Dress",
    price: "From R329",
    store: "SHEIN",
    category: "Fashion",
    subcategory: "Clothing",
  },

  {
    id: "fashion-004",
    slug: "minimalist-shoulder-bag",
    name: "Minimalist Shoulder Bag",
    description:
      "A compact shoulder bag designed for everyday outfits and simple styling.",
    image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Shoulder+Bag",
      price: "From R279",
    store: "Temu",
    category: "Fashion",
    subcategory: "Bags",
  },

  {
    id: "fashion-005",
    slug: "everyday-oversized-shirt",
    name: "Everyday Oversized Shirt",
    description:
      "A relaxed oversized shirt that can be worn casually or layered into a streetwear look.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Oversized+Shirt",
    price: "From R299",
    store: "SHEIN",
    category: "Fashion",
    subcategory: "Clothing",
  },

  {
    id: "fashion-006",
    slug: "gold-tone-accessories-set",
    name: "Gold-Tone Accessories Set",
    description:
      "A simple accessories set for adding a polished finishing touch to an outfit.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Accessories",
    price: "From R189",
    store: "Temu",
    category: "Fashion",
    subcategory: "Accessories",
  },

  // =========================
  // BEAUTY
  // =========================

  {
    id: "beauty-001",
    slug: "makeup-brush-holder",
    name: "Makeup Brush Holder",
    description:
      "A simple organiser for keeping makeup brushes clean, accessible and neatly displayed.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Brush+Holder",
    price: "From R159",
    store: "Temu",
    category: "Beauty",
    subcategory: "Organisers",
  },

  {
    id: "beauty-002",
    slug: "portable-makeup-mirror",
    name: "Portable Makeup Mirror",
    description:
      "A compact mirror for makeup application, touch-ups and everyday beauty routines.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Makeup+Mirror",
    price: "From R229",
    store: "SHEIN",
    category: "Beauty",
    subcategory: "Makeup Tools",
  },

  {
    id: "beauty-003",
    slug: "heatless-curling-set",
    name: "Heatless Curling Set",
    description:
      "An easy styling accessory designed for creating curls without traditional heat styling.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Curling+Set",
    price: "From R129",
    store: "Temu",
    category: "Beauty",
    subcategory: "Hair",
  },

  {
    id: "beauty-004",
    slug: "beauty-storage-organiser",
    name: "Beauty Storage Organiser",
    description:
      "A compact storage solution for keeping beauty products organised and easy to find.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Beauty+Organiser",
    price: "From R249",
    store: "SHEIN",
    category: "Beauty",
    subcategory: "Organisers",
  },

  {
    id: "beauty-005",
    slug: "press-on-nail-set",
    name: "Press-On Nail Set",
    description:
      "An affordable nail accessory for creating a polished look at home.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Nail+Set",
    price: "From R99",
    store: "Temu",
    category: "Beauty",
    subcategory: "Nails",
  },

  {
    id: "beauty-006",
    slug: "hair-accessories-set",
    name: "Hair Accessories Set",
    description:
      "A collection of simple accessories for styling and finishing everyday hairstyles.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Hair+Accessories",
    price: "From R149",
    store: "SHEIN",
    category: "Beauty",
    subcategory: "Hair",
  },

  // =========================
  // CREATOR TECH
  // =========================

  {
    id: "creator-001",
    slug: "10-inch-ring-light-with-tripod",
    name: "10-inch Ring Light with Tripod",
    description:
      "A simple starter lighting setup for videos, photos, livestreams and video calls.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Ring+Light",
    price: "From R280",
    store: "Temu",
    category: "Creator Tech",
    subcategory: "Ring Lights",
  },

  {
    id: "creator-002",
    slug: "adjustable-phone-tripod",
    name: "Adjustable Phone Tripod",
    description:
      "A flexible phone tripod for filming videos, taking photos and creating hands-free content.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Phone+Tripod",
    price: "From R199",
    store: "SHEIN",
    category: "Creator Tech",
    subcategory: "Tripods",
  },

  {
    id: "creator-003",
    slug: "desktop-phone-stand",
    name: "Desktop Phone Stand",
    description:
      "A compact stand for keeping your phone positioned while filming, working or watching content.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Phone+Stand",
    price: "From R89",
    store: "Temu",
    category: "Creator Tech",
    subcategory: "Phone Stands",
  },

  {
    id: "creator-004",
    slug: "clip-on-microphone",
    name: "Clip-On Microphone",
    description:
      "A compact microphone designed to help improve audio for mobile videos and calls.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Microphone",
    price: "From R249",
    store: "Temu",
    category: "Creator Tech",
    subcategory: "Microphones",
  },

  {
    id: "creator-005",
    slug: "led-desk-light",
    name: "LED Desk Light",
    description:
      "A compact desk light for improving your workspace and adding extra light to your content setup.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Desk+Light",
    price: "From R219",
    store: "SHEIN",
    category: "Creator Tech",
    subcategory: "Desk Setup",
  },

  {
    id: "creator-006",
    slug: "phone-content-creator-kit",
    name: "Phone Content Creator Kit",
    description:
      "A beginner-friendly collection of accessories designed to make mobile content creation easier.",
      image: "https://placehold.co/800x1000/F1EEE8/7A827D?text=Creator+Kit",
    price: "From R499",
    store: "Temu",
    category: "Creator Tech",
    subcategory: "Phone Stands",
  },
];