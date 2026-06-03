/**
 * Mock catalog for the AwesomeProject storefront.
 *
 * Products are generated deterministically (no randomness) so that ids,
 * ordering, prices and playlists are stable across launches and reproducible
 * in e2e tests. Images use placeholder URLs (picsum) since we can't bundle the
 * real proprietary product photography.
 */

export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  freeDelivery: boolean;
  deliveryEstimate: string;
  badge?: string;
  category: string;
  description: string;
  features: string[];
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

/** Tiny deterministic string hash, used to derive stable pseudo-random values. */
const hash = (input: string): number => {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) % 2147483647;
  }
  return h;
};

export const categories: Category[] = [
  { id: 'jardin', label: 'Garden', emoji: '🌿' },
  { id: 'bricolage', label: 'DIY', emoji: '🔧' },
  { id: 'sdb', label: 'Bathroom', emoji: '🚿' },
  { id: 'chauffage', label: 'Heating', emoji: '🔥' },
  { id: 'cuisine', label: 'Kitchen', emoji: '🍳' },
  { id: 'electricite', label: 'Electrical', emoji: '💡' },
  { id: 'plomberie', label: 'Plumbing', emoji: '🔩' },
  { id: 'mobilier', label: 'Furniture', emoji: '🪑' },
];

interface CatalogSeed {
  brands: string[];
  items: string[];
}

const seeds: Record<string, CatalogSeed> = {
  jardin: {
    brands: ['Gardena', 'Bosch', 'Kärcher', 'Hesperide', 'Fiskars'],
    items: ['Lawnmower', 'Hedge trimmer', 'Garden hose', 'Barbecue', 'Pruning shears', 'Wheelbarrow', 'Water butt'],
  },
  bricolage: {
    brands: ['Bosch', 'Makita', 'DeWalt', 'Stanley', 'Black+Decker'],
    items: ['Drill driver', 'Circular saw', 'Sander', 'Tool set', 'Laser level', 'Workbench', 'Angle grinder'],
  },
  sdb: {
    brands: ['GROHE', 'Hansgrohe', 'Aurlane', 'Jacob Delafon'],
    items: ['Mixer tap', 'Shower column', 'Vanity unit', 'Towel radiator', 'Shower enclosure', 'LED mirror'],
  },
  chauffage: {
    brands: ['Thermor', 'Atlantic', "De'Longhi", 'Sauter'],
    items: ['Inertia radiator', 'Pellet stove', 'Air conditioner', 'Water heater', 'Convector heater', 'Towel radiator'],
  },
  cuisine: {
    brands: ['GROHE', 'Bosch', 'Franke', 'Smeg'],
    items: ['Kitchen mixer tap', 'Stainless steel sink', 'Range hood', 'Worktop', 'Splashback', '3-way tap'],
  },
  electricite: {
    brands: ['Legrand', 'Philips', 'Schneider', 'Osram'],
    items: ['LED spotlights', 'Smart switch', 'Consumer unit', 'LED string lights', 'Motion detector', 'Wall socket'],
  },
  plomberie: {
    brands: ['Grohe', 'Geberit', 'Somatherm', 'Wirquin'],
    items: ['Tap', 'Stainless steel hose', 'Wall-hung toilet', 'Lifting pump', 'Brass fitting', 'Shower drain'],
  },
  mobilier: {
    brands: ['Hesperide', 'Vidaxl', 'Kave Home', 'Idmarket'],
    items: ['Shelving unit', 'Wardrobe', 'Desk', 'Table', 'Chair', 'Storage bench'],
  },
};

const specs = [
  'Pro', 'Compact', 'Premium', '18V', 'XL', 'Comfort', 'Design', 'Eco',
  'Smart', 'Max', 'Plus', 'Essential', 'Performance', 'Expert',
];

const PER_CATEGORY = 14;

function makeProduct(category: string, index: number): Product {
  const seed = seeds[category];
  const id = `${category}-${1000 + index}`;
  const h = hash(id);

  const item = seed.items[index % seed.items.length];
  const brand = seed.brands[index % seed.brands.length];
  const spec = specs[index % specs.length];

  const price = 15 + (h % 1200) - 0.01;
  const onSale = h % 3 === 0;
  const discount = 0.1 + ((h % 26) / 100); // 10% .. 35%
  const oldPrice = onSale ? Math.round(price / (1 - discount)) - 0.01 : undefined;
  const rating = Math.round((3.7 + (h % 13) / 10) * 10) / 10;
  const reviewCount = 12 + (h % 2480);
  const freeDelivery = h % 5 !== 0;
  const imageCount = 2 + (h % 3);

  return {
    id,
    title: `${item} ${brand} ${spec}`,
    brand,
    price,
    oldPrice,
    rating,
    reviewCount,
    image: img(id),
    images: Array.from({ length: imageCount }, (_, k) => img(`${id}-${k}`)),
    freeDelivery,
    deliveryEstimate: freeDelivery
      ? 'Free delivery within 48h'
      : 'Delivery within 3-5 days',
    badge: onSale ? `-${Math.round(discount * 100)}%` : undefined,
    category,
    description: `${item} ${brand} ${spec}: a reliable, high-performance choice for your projects. Professional quality, 2-year warranty and expert advice from AwesomeProject.`,
    features: [
      `${spec} range`,
      `${brand} brand`,
      '2-year warranty',
      'Expert advice and support',
    ],
  };
}

export const featuredProduct: Product = {
  id: '90721326',
  title: 'MOVA ViaX 250 - Wire-free perimeter robot lawnmower EU',
  brand: 'MOVA',
  price: 1299.0,
  oldPrice: 1599.0,
  rating: 4.6,
  reviewCount: 218,
  image: img('mova-mower'),
  images: [img('mova-mower'), img('mova-mower-2'), img('mova-mower-3'), img('mova-mower-4')],
  freeDelivery: true,
  deliveryEstimate: 'Free delivery as soon as tomorrow',
  badge: '-19%',
  category: 'jardin',
  description:
    'The MOVA ViaX 250 robot lawnmower mows up to 2500 m² with no perimeter wire thanks to its precision LiDAR navigation. It avoids obstacles in real time, maps your garden, and is controlled entirely from the mobile app.',
  features: [
    'Wire-free perimeter LiDAR navigation',
    'Mowing area up to 2500 m²',
    'AI camera obstacle avoidance',
    'Control via mobile app',
    'Automatic return to charging station',
    'IPX6 waterproof — mows in any weather',
  ],
};

// Interleave categories so the home grid feels varied rather than grouped.
function buildCatalog(): Product[] {
  const all: Product[] = [featuredProduct];
  for (let i = 0; i < PER_CATEGORY; i++) {
    for (const category of Object.keys(seeds)) {
      all.push(makeProduct(category, i));
    }
  }
  return all;
}

export const products: Product[] = buildCatalog();

const byId = new Map(products.map(p => [p.id, p]));

export const getProductById = (id: string): Product | undefined => byId.get(id);

/** Top sales playlist — products with the most reviews. */
export const bestSellers: Product[] = [...products]
  .sort((a, b) => b.reviewCount - a.reviewCount)
  .slice(0, 12);

/** Garden & outdoor playlist. */
export const gardenPicks: Product[] = products
  .filter(p => p.category === 'jardin' || p.category === 'mobilier')
  .slice(0, 12);

/** The full grid feed (100+ items). */
export const recommended: Product[] = products;

/** Related items playlist — same category as the given product. */
export const getRelatedProducts = (product: Product, limit = 10): Product[] =>
  products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit);

/**
 * "Frequently bought together" playlist. Picks same-category companions,
 * rotated by a deterministic offset so different products surface different
 * bundles.
 */
export const getFrequentlyBoughtTogether = (product: Product, limit = 6): Product[] => {
  const sameCat = products.filter(
    p => p.category === product.category && p.id !== product.id,
  );
  if (sameCat.length === 0) {
    return [];
  }
  const offset = hash(product.id) % sameCat.length;
  return [...sameCat.slice(offset), ...sameCat.slice(0, offset)].slice(0, limit);
};
