import { AssetDefinition, AssetCategory } from '../types';

export const ASSET_CATEGORIES: { id: AssetCategory; label: string; icon: string }[] = [
  { id: 'peta', label: 'PETA', icon: 'Map' },
  { id: 'kendaraan', label: 'KENDARAAN', icon: 'Car' },
  { id: 'pesawat', label: 'PESAWAT', icon: 'Plane' },
  { id: 'tractor', label: 'TRACTOR', icon: 'Truck' },
  { id: 'dekorasi', label: 'DEKORASI', icon: 'LayoutGrid' },
  { id: 'custom', label: 'KREASI SAYA', icon: 'Sparkles' },
];

export const DEKORASI_SUBCATEGORIES = [
  { id: 'semua', label: 'Semua' },
  { id: 'wahana', label: 'Wahana' },
  { id: 'bola', label: 'Bola' },
  { id: 'pohon', label: 'Pohon' },
  { id: 'jalan', label: 'Jalan & Ramp' },
  { id: 'karakter', label: 'Karakter' },
];

// Target sizes (in meters) for accurate real-world bounding-box normalization
export const ASSET_TARGET_SIZES: Record<string, number> = {
  // Peta / Prefab Maps (120m - 300m)
  // BangPay Prefab Maps & Buildings (20m - 300m)
  'albert-park-circuit-melbourne-2018-layout.glb': 300,
  'big-environment-map.glb': 300,
  'cartoon-village-combined.glb': 260,
  'map-qms.glb': 200,
  'farming-parking-complete.glb': 180,
  'kidspark-car-garage.glb': 160,
  'crossing-fountain.glb': 120,
  'kolam-warna.glb': 120,
  'road.glb': 180,
  'pirate-adventure-map.glb': 260,
  'map-desert-world-v2.glb': 260,
  'taiwan-map.glb': 260,
  'tram-station-map.glb': 260,
  'colored-barn-reference.glb': 35,
  'garage-of-colors.glb': 28,
  'doubleparking.glb': 35,

  // Kendaraan & Mobil (5.5m - 10m)
  'lightning-mcqueen.glb': 5.5,
  'tokyo-mater.glb': 5.5,
  'toyota-supra.glb': 5.5,
  'lamborghini-fenomeno.glb': 5.5,
  'mclaren-w1.glb': 5.5,
  'volvo-c30.glb': 5.5,
  'police-car.glb': 5.5,
  'passenger-car-pack.glb': 6.0,
  'traffic-vehicles.glb': 6.0,
  'ToyCar.glb': 3.5,
  'scania.glb': 6.0,
  'scania-r440.glb': 9.0,
  'scania-bus-pack.glb': 10.0,
  'mercedes-benz-amg-c63-c-coupe-dtm.glb': 5.5,
  'firetruck.glb': 8.5,
  'scania-113h-blinking-eyes.glb': 8.5,
  'scania-r440-red-auto-eyes-v2.glb': 9.0,
  'scania-truck-complete.glb': 8.5,
  'jeep-wrangler-eyes.glb': 5.5,
  'jeep-wrangler-eyes-ecb89042.glb': 5.5,

  // Pesawat (10m - 16m)
  'airport-airplane.glb': 16.0,
  'light-aircraft.glb': 10.0,

  // Traktor (6m)
  'farm-tractors.glb': 6.0,
  'tractor-mtz80-lowpoly.glb': 6.0,
  'tractor-mtz80.glb': 6.0,
  'tractor-dt75.glb': 6.0,
  'tractor-hcr2.glb': 6.0,
  'tractor-david-brown.glb': 6.0,
  'tractor-tracktor.glb': 6.0,

  // Wahana & Bola (3m - 14m)
  'animal-trex-rideable.glb': 4.5,
  'animal-duck-rideable.glb': 3.5,
  'animal-farm-cow.glb': 3.0,
  'animal-deer-rigged.glb': 3.0,
  'slide-playground.glb': 8.0,
  'ball-ball-pool.glb': 8.0,
  'ball-balloon-arch.glb': 8.0,
  'ball-colorful-balloons.glb': 3.0,
  'ball-balls.glb': 3.0,
  'playground-no-white-base.glb': 14.0,
  'duck-standing-platform-complete-textured.glb': 10.0,
  'ballon-gate.glb': 8.0,
  'colorful-bowling-pin.glb': 4.0,
  'hot-air-ballon.glb': 9.0,

  // Pohon & Alam (7m - 10m)
  'cartoon-trees.glb': 7.0,
  'polygon-tree-pack.glb': 8.0,
  'old-tree.glb': 8.0,
  'low-poly-tree-scene.glb': 9.0,
  'free-pack-rocks-stylized.glb': 8.0,
  'rocks-and-trees.glb': 10.0,

  // Jalan & Ramp Stunt (10m - 35m)
  'football-ramp.glb': 10.0,
  'road-wooden-ramp.glb': 12.0,
  'road-industrial-ramp.glb': 12.0,
  'road-stunt.glb': 18.0,
  'road-03.glb': 24.0,
  'road-standard.glb': 24.0,
  'torus.glb': 25.0,
  'lintasan-balok-hancur.glb': 35.0,
  'new-ramp-mods-fs22-textured.glb': 16.0,
  'ramp-fs22-mod-textured.glb': 16.0,
  'professional-bridge-complete-textured.glb': 22.0,
  'lava-floor-animated.glb': 24.0,

  // Karakter & Ornamen (2m - 5m)
  'fantasy-armored-knight.glb': 3.5,
  'spiderman-low-poly.glb': 2.1,
  'spiderman-new-day.glb': 2.1,
  'spiderman-mff.glb': 2.1,
  'iron-man.glb': 2.1,
  'hulk.glb': 3.2,
  'akatosh-hammer.glb': 3.0,
  'toy-hammer.glb': 2.5,
  'decoration-small.glb': 5.0,
  'decoration-9827.glb': 7.0,
  'decoration-f25.glb': 7.0,
  'decoration-9567.glb': 7.0,
  'decoration-64f.glb': 7.0,
  'bumblebee-run-optimized.glb': 3.5,
  'optimus-prime-run.glb': 4.5,
  'n-gen-mech-tranformer.glb': 4.2,
  'super-heroes-eggs-model.glb': 2.5,
};

export const DEFAULT_CATEGORY_TARGET_SIZES: Record<string, number> = {
  peta: 260,
  map: 260,
  kendaraan: 5.5,
  vehicle: 5.5,
  vehicles: 5.5,
  pesawat: 12.0,
  aircraft: 12.0,
  tractor: 6.0,
  dekorasi: 6.0,
  decoration: 6.0,
  playground: 8.0,
  tree: 8.0,
  nature: 8.0,
  road: 18.0,
  roads: 18.0,
  karakter: 2.1,
  character: 2.1,
  ball: 3.0,
  objek: 4.0,
  custom: 4.0,
};

export const INITIAL_ASSET_LIBRARY: AssetDefinition[] = [
  // ==========================================
  // 1. PETA (PREFAB MAPS & BUILDINGS - 28m - 300m)
  // ==========================================
  { id: 'map-albert-park-f1', name: 'Sirkuit F1 Albert Park Melbourne', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#e11d48', modelUrl: '/models/bangpay/albert-park-circuit-melbourne-2018-layout.glb', thumbnailUrl: '/thumbs/bangpay/albert-park-circuit-melbourne-2018-layout.png', targetSize: 300, isNew: true },
  { id: 'map-big-environment', name: 'Peta Alam Terbuka (Big Environment)', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#15803d', modelUrl: '/models/bangpay/big-environment-map.glb', thumbnailUrl: '/thumbs/bangpay/big-environment-map.png', targetSize: 300, isNew: true },
  { id: 'map-cartoon-village', name: 'Desa Kartun Terpadu (Cartoon Village)', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#ca8a04', modelUrl: '/models/bangpay/cartoon-village-combined.glb', thumbnailUrl: '/thumbs/bangpay/cartoon-village-combined.png', targetSize: 260, isNew: true },
  { id: 'map-qms-complex', name: 'Peta Kawasan Industri & Jalan QMS', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#475569', modelUrl: '/models/bangpay/map-qms.glb', thumbnailUrl: '/thumbs/bangpay/map-qms.png', targetSize: 200, isNew: true },
  { id: 'map-farming-parking', name: 'Area Ladang Pertanian & Parkir', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#65a30d', modelUrl: '/models/bangpay/farming-parking-complete.glb', thumbnailUrl: '/thumbs/bangpay/farming-parking-complete.png', targetSize: 180, isNew: true },
  { id: 'map-kidspark-garage', name: 'Taman Bermain & Garasi Mobil', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#8b5cf6', modelUrl: '/models/bangpay/kidspark-car-garage.glb', thumbnailUrl: '/thumbs/bangpay/kidspark-car-garage.png', targetSize: 160, isNew: true },
  { id: 'map-crossing-fountain', name: 'Plaza Bundaran Air Mancur', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#06b6d4', modelUrl: '/models/bangpay/crossing-fountain.glb', thumbnailUrl: '/thumbs/bangpay/crossing-fountain.png', targetSize: 120, isNew: true },
  { id: 'map-kolam-warna', name: 'Arena Sirkuit Kolam Warna', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#ec4899', modelUrl: '/models/bangpay/kolam-warna.glb', thumbnailUrl: '/thumbs/bangpay/kolam-warna.png', targetSize: 120, isNew: true },
  { id: 'map-road-circuit', name: 'Sirkuit Jalan Raya Berkelok', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#0f172a', modelUrl: '/models/bangpay/road.glb', thumbnailUrl: '/thumbs/bangpay/road.png', targetSize: 180, isNew: true },
    { id: 'map-desert-world', name: 'Peta Dunia Gurun Pasir (Desert World V2)', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#d97706', modelUrl: '/models/map-desert-world-v2.glb', thumbnailUrl: '/thumbs/desert-map.webp', targetSize: 260, isNew: true },
  { id: 'map-pirate-island', name: 'Pulau Petualangan Bajak Laut', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#b45309', modelUrl: '/models/pirate-adventure-map.glb', thumbnailUrl: '/thumbs/pirate-map.webp', targetSize: 260 },
  { id: 'map-taiwan', name: 'Peta Kota Pegunungan Taiwan', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#0284c7', modelUrl: '/models/taiwan-map.glb', thumbnailUrl: '/thumbs/taiwan-map.webp', targetSize: 260 },
  { id: 'map-tram-station', name: 'Stasiun Trem Modern', category: 'peta', subCategory: 'bangunan', type: 'datacenter', color: '#334155', modelUrl: '/models/tram-station-map.glb', thumbnailUrl: '/thumbs/tram-map.webp', targetSize: 260 },
  { id: 'map-colored-barn', name: 'Lumbung & Bangunan Barn Warna (Colored Barn)', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#dc2626', modelUrl: '/models/bangpay/colored-barn-reference.glb', thumbnailUrl: '/thumbs/bangpay/colored-barn-reference.png', targetSize: 35, isNew: true },
  { id: 'map-garage-colors', name: 'Kompleks Garasi Warna-Warni (Garage of Colors)', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#ca8a04', modelUrl: '/models/bangpay/garage-of-colors.glb', thumbnailUrl: '/thumbs/bangpay/garage-of-colors.png', targetSize: 28, isNew: true },
  { id: 'map-doubleparking', name: 'Gedung Parkir Bertingkat (Double Parking Deck)', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#475569', modelUrl: '/models/bangpay/doubleparking.glb', thumbnailUrl: '/thumbs/bangpay/doubleparking.png', targetSize: 35, isNew: true },
  { id: 'map-torus-circuit', name: 'Sirkuit Cincin Torus Melingkar (360° Ring)', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#8b5cf6', modelUrl: '/models/bangpay/torus.glb', thumbnailUrl: '/thumbs/bangpay/torus.png', targetSize: 25, isNew: true },
  { id: 'map-balok-track', name: 'Lintasan Rintangan Balok Hancur', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#ea580c', modelUrl: '/models/bangpay/lintasan-balok-hancur.glb', thumbnailUrl: '/thumbs/bangpay/lintasan-balok-hancur.png', targetSize: 35, isNew: true },
  { id: 'map-lava-arena', name: 'Arena Sirkuit Lantai Lava Membara', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#ef4444', modelUrl: '/models/bangpay/lava-floor-animated.glb', thumbnailUrl: '/thumbs/bangpay/lava-floor-animated.png', targetSize: 24, isNew: true },
  { id: 'map-fs22-bridge', name: 'Jembatan Penghubung Baja FS22', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#475569', modelUrl: '/models/bangpay/professional-bridge-complete-textured.glb', thumbnailUrl: '/thumbs/bangpay/professional-bridge-complete-textured.png', targetSize: 22, isNew: true },
  { id: 'map-highway-03', name: 'Sirkuit Jalan Bebas Hambatan (Road 03)', category: 'peta', subCategory: 'bangunan', type: 'warehouse', color: '#334155', modelUrl: '/models/road-03.glb', thumbnailUrl: '/thumbs/road-03.webp', targetSize: 24 },

  // ==========================================
  // 2. KENDARAAN (ALL CARS, SUPERCARS & TRUCKS)
  // ==========================================
  { id: 'veh-mcqueen', name: 'Lightning McQueen (Cars)', category: 'kendaraan', type: 'car-sport', color: '#ef4444', modelUrl: '/models/lightning-mcqueen.glb', thumbnailUrl: '/thumbs/lightning.webp', targetSize: 5.5 },
  { id: 'veh-tokyo-mater', name: 'Tokyo Mater Derek Truk', category: 'kendaraan', type: 'truck-tow', color: '#06b6d4', modelUrl: '/models/tokyo-mater.glb', thumbnailUrl: '/thumbs/tokyo-mater.webp', targetSize: 5.5 },
  { id: 'veh-supra', name: 'Toyota Supra GT Sport', category: 'kendaraan', type: 'car-sport', color: '#ffffff', modelUrl: '/models/toyota-supra.glb', thumbnailUrl: '/thumbs/supra.webp', targetSize: 5.5 },
  { id: 'veh-lambo', name: 'Lamborghini Fenomeno Hyper', category: 'kendaraan', type: 'car-supercar', color: '#eab308', modelUrl: '/models/lamborghini-fenomeno.glb', thumbnailUrl: '/thumbs/lamborghini.webp', targetSize: 5.5 },
  { id: 'veh-mclaren', name: 'McLaren W1 Track Monster', category: 'kendaraan', type: 'car-supercar', color: '#f97316', modelUrl: '/models/mclaren-w1.glb', thumbnailUrl: '/thumbs/mclaren.webp', targetSize: 5.5 },
  { id: 'veh-volvo-c30', name: 'Volvo C30 Sport Hatchback', category: 'kendaraan', type: 'car-hatchback', color: '#3b82f6', modelUrl: '/models/volvo-c30.glb', thumbnailUrl: '/thumbs/volvo-c30.webp', targetSize: 5.5 },
  { id: 'veh-police-glb', name: 'Mobil Polisi Patroli Interceptor', category: 'kendaraan', type: 'car-police', color: '#1e293b', modelUrl: '/models/police-car.glb', thumbnailUrl: '/thumbs/police-car.webp', targetSize: 5.5 },
  { id: 'veh-passenger-pack', name: 'Pack Mobil Penumpang Kota', category: 'kendaraan', type: 'car-sedan', color: '#10b981', modelUrl: '/models/passenger-car-pack.glb', thumbnailUrl: '/thumbs/passenger-pack.webp', targetSize: 6.0 },
  { id: 'veh-traffic-pack', name: 'Pack Kendaraan Lalu Lintas', category: 'kendaraan', type: 'car-suv', color: '#f59e0b', modelUrl: '/models/traffic-vehicles.glb', thumbnailUrl: '/thumbs/traffic-pack.webp', targetSize: 6.0 },
  { id: 'veh-toy-car', name: 'Mobil Mainan (Toy Car)', category: 'kendaraan', type: 'car-sedan', color: '#38bdf8', modelUrl: '/models/ToyCar.glb', thumbnailUrl: '/thumbs/passenger-pack.webp', targetSize: 3.5 },
  { id: 'veh-scania-heavy', name: 'Truk Scania R440 Heavy Duty', category: 'kendaraan', type: 'truck', color: '#dc2626', modelUrl: '/models/scania.glb', thumbnailUrl: '/thumbs/scania.webp', targetSize: 6.0 },
  { id: 'veh-scania-r440', name: 'Truk Scania Hauler R440', category: 'kendaraan', type: 'truck', color: '#2563eb', modelUrl: '/models/scania-r440.glb', thumbnailUrl: '/thumbs/scania-r440.webp', targetSize: 9.0 },
  { id: 'veh-scania-bus', name: 'Bus Scania Pariwisata & Kota', category: 'kendaraan', type: 'bus-city', color: '#16a34a', modelUrl: '/models/scania-bus-pack.glb', thumbnailUrl: '/thumbs/scania-bus.webp', targetSize: 10.0 },
  { id: 'veh-mercedes-amg', name: 'Mercedes-Benz AMG C63 C-Coupe DTM', category: 'kendaraan', type: 'car-sport', color: '#eab308', modelUrl: '/models/bangpay/mercedes-benz-amg-c63-c-coupe-dtm.glb', thumbnailUrl: '/thumbs/bangpay/mercedes-benz-amg-c63-c-coupe-dtm.png', targetSize: 5.5, isNew: true },
  { id: 'veh-firetruck', name: 'Truk Pemadam Kebakaran (Fire Truck)', category: 'kendaraan', type: 'truck-fire', color: '#dc2626', modelUrl: '/models/bangpay/firetruck.glb', thumbnailUrl: '/thumbs/bangpay/firetruck.png', targetSize: 8.5, isNew: true },
  { id: 'veh-scania-113h', name: 'Truk Scania 113H Mata Berkedip', category: 'kendaraan', type: 'truck', color: '#ea580c', modelUrl: '/models/bangpay/scania-113h-blinking-eyes.glb', thumbnailUrl: '/thumbs/bangpay/scania-113h-blinking-eyes.png', targetSize: 8.5, isNew: true },
  { id: 'veh-scania-r440-eyes', name: 'Truk Scania R440 Merah Mata Berkedip', category: 'kendaraan', type: 'truck', color: '#dc2626', modelUrl: '/models/bangpay/scania-r440-red-auto-eyes-v2.glb', thumbnailUrl: '/thumbs/bangpay/scania-r440-red-auto-eyes-v2.png', targetSize: 9.0, isNew: true },
  { id: 'veh-scania-complete', name: 'Truk Scania Complete Edition', category: 'kendaraan', type: 'truck', color: '#2563eb', modelUrl: '/models/bangpay/scania-truck-complete.glb', thumbnailUrl: '/thumbs/bangpay/scania-truck-complete.png', targetSize: 8.5, isNew: true },
  { id: 'veh-jeep-wrangler', name: 'Jeep Wrangler Off-Road Mata Hidup', category: 'kendaraan', type: 'car-suv', color: '#16a34a', modelUrl: '/models/bangpay/jeep-wrangler-eyes.glb', thumbnailUrl: '/thumbs/bangpay/jeep-wrangler-eyes.png', targetSize: 5.5, isNew: true },
  { id: 'veh-jeep-wrangler-v2', name: 'Jeep Wrangler Off-Road V2 (ECB)', category: 'kendaraan', type: 'car-suv', color: '#059669', modelUrl: '/models/bangpay/jeep-wrangler-eyes-ecb89042.glb', thumbnailUrl: '/thumbs/bangpay/jeep-wrangler-eyes.png', targetSize: 5.5, isNew: true },

  // ==========================================
  // 3. PESAWAT (AIRCRAFT & AIRPLANES)
  // ==========================================
  { id: 'air-airport-plane', name: 'Pesawat Penumpang Bandara (Airport Airplane)', category: 'pesawat', type: 'car-sedan', color: '#ffffff', modelUrl: '/models/airport-airplane.glb', thumbnailUrl: '/thumbs/airport-plane.webp', targetSize: 16.0 },
  { id: 'air-light-aircraft', name: 'Pesawat Ringan Baling-Baling Cessna', category: 'pesawat', type: 'car-sedan', color: '#3b82f6', modelUrl: '/models/light-aircraft.glb', thumbnailUrl: '/thumbs/light-aircraft.webp', targetSize: 10.0 },

  // ==========================================
  // 4. TRACTOR (TRACTORS & HEAVY EARTHMOVERS)
  // ==========================================
  { id: 'trac-farm-pack', name: 'Pack Traktor Pertanian Modern', category: 'tractor', type: 'bulldozer', color: '#ca8a04', modelUrl: '/models/farm-tractors.glb', thumbnailUrl: '/thumbs/farm-tractors.webp', targetSize: 6.0, isNew: true },
  { id: 'trac-mtz80-lp', name: 'Traktor MTZ-80 Belarus Sawah', category: 'tractor', type: 'bulldozer', color: '#dc2626', modelUrl: '/models/tractor-mtz80-lowpoly.glb', thumbnailUrl: '/thumbs/tractor-mtz80-lowpoly.webp', targetSize: 6.0, isNew: true },
  { id: 'trac-mtz80-heavy', name: 'Traktor MTZ-80 Heavy Duty', category: 'tractor', type: 'bulldozer', color: '#dc2626', modelUrl: '/models/tractor-mtz80.glb', thumbnailUrl: '/thumbs/tractor-mtz80.webp', targetSize: 6.0, isNew: true },
  { id: 'trac-dt75', name: 'Traktor Rantai DT-75 Crawler', category: 'tractor', type: 'bulldozer', color: '#ea580c', modelUrl: '/models/tractor-dt75.glb', thumbnailUrl: '/thumbs/tractor-dt75.webp', targetSize: 6.0, isNew: true },
  { id: 'trac-hcr2', name: 'Traktor Hill Climb HCR2', category: 'tractor', type: 'bulldozer', color: '#16a34a', modelUrl: '/models/tractor-hcr2.glb', thumbnailUrl: '/thumbs/tractor-hcr2.webp', targetSize: 6.0, isNew: true },
  { id: 'trac-david-brown', name: 'Traktor David Brown 25D Classic', category: 'tractor', type: 'bulldozer', color: '#d97706', modelUrl: '/models/tractor-david-brown.glb', thumbnailUrl: '/thumbs/tractor-david-brown.webp', targetSize: 6.0, isNew: true },
  { id: 'trac-work-field', name: 'Traktor Kerja Ladang Serbaguna', category: 'tractor', type: 'bulldozer', color: '#65a30d', modelUrl: '/models/tractor-tracktor.glb', thumbnailUrl: '/thumbs/tractor-tracktor.webp', targetSize: 6.0, isNew: true },

  // ==========================================
  // 5. DEKORASI (WAHANA, ALAM, JALAN, BOLA, KARAKTER)
  // ==========================================
  // --- WAHANA & BOLA ---
      { id: 'dec-animal-trex', name: 'Wahana Dinosaurus T-Rex (Rideable)', category: 'dekorasi', subCategory: 'wahana', type: 'character', color: '#16a34a', modelUrl: '/models/animal-trex-rideable.glb', thumbnailUrl: '/thumbs/lightning.webp', targetSize: 4.5, isNew: true },
    { id: 'dec-animal-duck', name: 'Wahana Bebek Lucu Kuning (Rideable)', category: 'dekorasi', subCategory: 'wahana', type: 'character', color: '#eab308', modelUrl: '/models/animal-duck-rideable.glb', thumbnailUrl: '/thumbs/lightning.webp', targetSize: 3.5, isNew: true },
    { id: 'dec-animal-cow', name: 'Hewan Sapi Peternakan Perah', category: 'dekorasi', subCategory: 'wahana', type: 'character', color: '#475569', modelUrl: '/models/animal-farm-cow.glb', thumbnailUrl: '/thumbs/farm-tractors.webp', targetSize: 3.0, isNew: true },
    { id: 'dec-animal-deer', name: 'Rusa Hutan Bertanduk Indah', category: 'dekorasi', subCategory: 'wahana', type: 'character', color: '#b45309', modelUrl: '/models/animal-deer-rigged.glb', thumbnailUrl: '/thumbs/polygon-trees.webp', targetSize: 3.0, isNew: true },
    { id: 'dec-wahana-slide', name: 'Menara Seluncuran Taman Anak', category: 'dekorasi', subCategory: 'wahana', type: 'play-slide', color: '#ef4444', modelUrl: '/models/slide-playground.glb', thumbnailUrl: '/thumbs/slide.webp', targetSize: 8.0 },
  { id: 'dec-ball-pool', name: 'Kolam Mandi Bola 3D', category: 'dekorasi', subCategory: 'bola', type: 'play-ball-pool', color: '#06b6d4', modelUrl: '/models/ball-ball-pool.glb', thumbnailUrl: '/thumbs/ball-pool.webp', targetSize: 8.0 },
  { id: 'dec-ball-arch', name: 'Gapura Balon Karnaval', category: 'dekorasi', subCategory: 'bola', type: 'play-balloon-arch', color: '#ec4899', modelUrl: '/models/ball-balloon-arch.glb', thumbnailUrl: '/thumbs/ball-arch.webp', targetSize: 8.0 },
  { id: 'dec-ball-balloons', name: 'Balon Udara Warna-Warni', category: 'dekorasi', subCategory: 'bola', type: 'play-balloons', color: '#f59e0b', modelUrl: '/models/ball-colorful-balloons.glb', thumbnailUrl: '/thumbs/ball-balloons.webp', targetSize: 3.0 },
  { id: 'dec-ball-balls', name: 'Bola-Bola Raksasa Mainan', category: 'dekorasi', subCategory: 'bola', type: 'play-balls', color: '#ef4444', modelUrl: '/models/ball-balls.glb', thumbnailUrl: '/thumbs/ball-balls.webp', targetSize: 3.0 },
  { id: 'dec-wahana-playground-complex', name: 'Kompleks Wahana Bermain (Playground)', category: 'dekorasi', subCategory: 'wahana', type: 'play-slide', color: '#f59e0b', modelUrl: '/models/bangpay/playground-no-white-base.glb', thumbnailUrl: '/thumbs/bangpay/playground-no-white-base.png', targetSize: 14.0, isNew: true },
  { id: 'dec-wahana-duck-platform', name: 'Platform Wahana Bebek Raksasa', category: 'dekorasi', subCategory: 'wahana', type: 'play-slide', color: '#eab308', modelUrl: '/models/bangpay/duck-standing-platform-complete-textured.glb', thumbnailUrl: '/thumbs/bangpay/duck-standing-platform-complete-textured.png', targetSize: 10.0, isNew: true },
  { id: 'dec-wahana-ballon-gate', name: 'Gapura Balon Festival Warna-Warni', category: 'dekorasi', subCategory: 'wahana', type: 'play-balloon-arch', color: '#ec4899', modelUrl: '/models/bangpay/ballon-gate.glb', thumbnailUrl: '/thumbs/bangpay/ballon-gate.png', targetSize: 8.0, isNew: true },
  { id: 'dec-bola-bowling-pin', name: 'Pin Bowling Raksasa Warna-Warni', category: 'dekorasi', subCategory: 'bola', type: 'play-balls', color: '#06b6d4', modelUrl: '/models/bangpay/colorful-bowling-pin.glb', thumbnailUrl: '/thumbs/bangpay/colorful-bowling-pin.png', targetSize: 4.0, isNew: true },
  { id: 'dec-wahana-hot-air-balloon', name: 'Balon Udara Panas Terbang (Hot Air)', category: 'dekorasi', subCategory: 'wahana', type: 'play-balloons', color: '#f97316', modelUrl: '/models/bangpay/hot-air-ballon.glb', thumbnailUrl: '/thumbs/bangpay/hot-air-ballon.png', targetSize: 9.0, isNew: true },

  // --- POHON & ALAM ---
  { id: 'dec-pohon-cartoon', name: 'Pohon Kartun Stylized 3D', category: 'dekorasi', subCategory: 'pohon', type: 'tree-oak', color: '#22c55e', modelUrl: '/models/cartoon-trees.glb', thumbnailUrl: '/thumbs/cartoon-trees.webp', targetSize: 7.0 },
  { id: 'dec-pohon-polygon', name: 'Koleksi Pohon Polygon Low-Poly', category: 'dekorasi', subCategory: 'pohon', type: 'tree-pine', color: '#15803d', modelUrl: '/models/polygon-tree-pack.glb', thumbnailUrl: '/thumbs/polygon-trees.webp', targetSize: 8.0 },
  { id: 'dec-pohon-old', name: 'Pohon Tua Rindang (Old Oak)', category: 'dekorasi', subCategory: 'pohon', type: 'tree-oak', color: '#16a34a', modelUrl: '/models/old-tree.glb', thumbnailUrl: '/thumbs/old-tree.webp', targetSize: 8.0 },
  { id: 'dec-pohon-scene', name: 'Gugusan Hutan Low-Poly', category: 'dekorasi', subCategory: 'pohon', type: 'tree-pine', color: '#15803d', modelUrl: '/models/low-poly-tree-scene.glb', thumbnailUrl: '/thumbs/tree-scene.webp', targetSize: 9.0 },
  { id: 'dec-pohon-rocks-pack', name: 'Set Batu Karang Alam Stylized', category: 'dekorasi', subCategory: 'pohon', type: 'tree-pine', color: '#64748b', modelUrl: '/models/bangpay/free-pack-rocks-stylized.glb', thumbnailUrl: '/thumbs/bangpay/free-pack-rocks-stylized.png', targetSize: 8.0, isNew: true },
  { id: 'dec-pohon-rocks-trees', name: 'Komposisi Bebatuan & Pepohonan', category: 'dekorasi', subCategory: 'pohon', type: 'tree-oak', color: '#15803d', modelUrl: '/models/bangpay/rocks-and-trees.glb', thumbnailUrl: '/thumbs/bangpay/rocks-and-trees.png', targetSize: 10.0, isNew: true },

  // --- JALAN & STUNT RAMPS ---
  { id: 'dec-jalan-football', name: 'Ramp Stunt Melompat (Football)', category: 'dekorasi', subCategory: 'jalan', type: 'barrier', color: '#10b981', modelUrl: '/models/football-ramp.glb', thumbnailUrl: '/thumbs/football-ramp.webp', targetSize: 10.0 },
  { id: 'dec-jalan-wooden', name: 'Ramp Akrobatik Kayu (Wooden)', category: 'dekorasi', subCategory: 'jalan', type: 'barrier', color: '#78350f', modelUrl: '/models/road-wooden-ramp.glb', thumbnailUrl: '/thumbs/road-wooden-ramp.webp', targetSize: 12.0 },
  { id: 'dec-jalan-industrial', name: 'Ramp Baja Industri (Industrial)', category: 'dekorasi', subCategory: 'jalan', type: 'barrier', color: '#475569', modelUrl: '/models/road-industrial-ramp.glb', thumbnailUrl: '/thumbs/road-industrial-ramp.webp', targetSize: 12.0 },
  { id: 'dec-jalan-stunt', name: 'Jalan Looping Akrobatik 360°', category: 'dekorasi', subCategory: 'jalan', type: 'road-straight', color: '#f97316', modelUrl: '/models/road-stunt.glb', thumbnailUrl: '/thumbs/road-stunt.webp', targetSize: 18.0 },
  { id: 'dec-jalan-highway', name: 'Jalan Tol Modern (Road 03)', category: 'dekorasi', subCategory: 'jalan', type: 'road-straight', color: '#334155', modelUrl: '/models/road-03.glb', thumbnailUrl: '/thumbs/road-03.webp', targetSize: 24.0 },
  { id: 'dec-jalan-standard', name: 'Jalan Aspal Standard Bergaris', category: 'dekorasi', subCategory: 'jalan', type: 'road-straight', color: '#1e293b', modelUrl: '/models/road-standard.glb', thumbnailUrl: '/thumbs/road-standard.webp', targetSize: 24.0 },
  { id: 'dec-jalan-torus', name: 'Sirkuit Cincin Torus Melingkar (360° Ring)', category: 'dekorasi', subCategory: 'jalan', type: 'road-straight', color: '#8b5cf6', modelUrl: '/models/bangpay/torus.glb', thumbnailUrl: '/thumbs/bangpay/torus.png', targetSize: 25.0, isNew: true },
  { id: 'dec-jalan-balok-hancur', name: 'Lintasan Rintangan Balok Hancur', category: 'dekorasi', subCategory: 'jalan', type: 'road-straight', color: '#ea580c', modelUrl: '/models/bangpay/lintasan-balok-hancur.glb', thumbnailUrl: '/thumbs/bangpay/lintasan-balok-hancur.png', targetSize: 35.0, isNew: true },
  { id: 'dec-jalan-ramp-fs22-new', name: 'Ramp Modifikasi Baru FS22 Textured', category: 'dekorasi', subCategory: 'jalan', type: 'barrier', color: '#0284c7', modelUrl: '/models/bangpay/new-ramp-mods-fs22-textured.glb', thumbnailUrl: '/thumbs/bangpay/new-ramp-mods-fs22-textured.png', targetSize: 16.0, isNew: true },
  { id: 'dec-jalan-ramp-fs22-mod', name: 'Ramp Akrobatik FS22 Mod Textured', category: 'dekorasi', subCategory: 'jalan', type: 'barrier', color: '#ca8a04', modelUrl: '/models/bangpay/ramp-fs22-mod-textured.glb', thumbnailUrl: '/thumbs/bangpay/ramp-fs22-mod-textured.png', targetSize: 16.0, isNew: true },
  { id: 'dec-jalan-bridge-pro', name: 'Jembatan Baja Profesional FS22', category: 'dekorasi', subCategory: 'jalan', type: 'barrier', color: '#475569', modelUrl: '/models/bangpay/professional-bridge-complete-textured.glb', thumbnailUrl: '/thumbs/bangpay/professional-bridge-complete-textured.png', targetSize: 22.0, isNew: true },
  { id: 'dec-jalan-lava-floor', name: 'Lantai Lava Animasi Membara', category: 'dekorasi', subCategory: 'jalan', type: 'road-straight', color: '#ef4444', modelUrl: '/models/bangpay/lava-floor-animated.glb', thumbnailUrl: '/thumbs/bangpay/lava-floor-animated.png', targetSize: 24.0, isNew: true },

  // --- KARAKTER SUPERHERO & ORNAMEN ---
  { id: 'dec-kar-knight', name: 'Ksatria Zirah Fantasi (Fantasy Armored Knight)', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#818cf8', modelUrl: '/models/fantasy-armored-knight.glb', thumbnailUrl: '/thumbs/knight.svg', targetSize: 3.5 },
  { id: 'dec-kar-spider-lp', name: 'Patung Superhero Spiderman Low-Poly', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#ef4444', modelUrl: '/models/spiderman-low-poly.glb', thumbnailUrl: '/thumbs/spider-low.webp', targetSize: 2.1 },
  { id: 'dec-kar-spider-new', name: 'Spiderman Brand New Day', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#dc2626', modelUrl: '/models/spiderman-new-day.glb', thumbnailUrl: '/thumbs/spider-new.webp', targetSize: 2.1 },
  { id: 'dec-kar-spider-mff', name: 'Spiderman Future Fight 3D', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#b91c1c', modelUrl: '/models/spiderman-mff.glb', thumbnailUrl: '/thumbs/spider-mff.webp', targetSize: 2.1 },
  { id: 'dec-kar-ironman', name: 'Patung Superhero Iron Man', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#eab308', modelUrl: '/models/iron-man.glb', thumbnailUrl: '/thumbs/iron-man.webp', targetSize: 2.1 },
  { id: 'dec-kar-hulk', name: 'Patung Raksasa Hulk 3D', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#15803d', modelUrl: '/models/hulk.glb', thumbnailUrl: '/thumbs/hulk.webp', targetSize: 3.2 },
  { id: 'dec-kar-akatosh', name: 'Palu Raksasa Akatosh', category: 'dekorasi', subCategory: 'karakter', type: 'barrier', color: '#71717a', modelUrl: '/models/akatosh-hammer.glb', thumbnailUrl: '/thumbs/akatosh-hammer.webp', targetSize: 3.0 },
  { id: 'dec-kar-toy-hammer', name: 'Palu Mainan Raksasa', category: 'dekorasi', subCategory: 'karakter', type: 'barrier', color: '#f59e0b', modelUrl: '/models/toy-hammer.glb', thumbnailUrl: '/thumbs/toy-hammer.webp', targetSize: 2.5 },
  { id: 'dec-ornamen-small', name: 'Set Ornamen Dekorasi Mini', category: 'dekorasi', subCategory: 'karakter', type: 'barrier', color: '#3b82f6', modelUrl: '/models/decoration-small.glb', thumbnailUrl: '/thumbs/decor-small.webp', targetSize: 5.0 },
  { id: 'dec-ornamen-9827', name: 'Set Dekorasi Taman 9827', category: 'dekorasi', subCategory: 'karakter', type: 'barrier', color: '#10b981', modelUrl: '/models/decoration-9827.glb', thumbnailUrl: '/thumbs/decor-9827.webp', targetSize: 7.0 },
  { id: 'dec-ornamen-f25', name: 'Set Dekorasi Modern F25', category: 'dekorasi', subCategory: 'karakter', type: 'barrier', color: '#8b5cf6', modelUrl: '/models/decoration-f25.glb', thumbnailUrl: '/thumbs/decor-f25.webp', targetSize: 7.0 },
  { id: 'dec-ornamen-9567', name: 'Set Dekorasi Khusus 9567', category: 'dekorasi', subCategory: 'karakter', type: 'barrier', color: '#ec4899', modelUrl: '/models/decoration-9567.glb', thumbnailUrl: '/thumbs/decor-9567.webp', targetSize: 7.0 },
  { id: 'dec-ornamen-64f', name: 'Set Dekorasi Area 64F', category: 'dekorasi', subCategory: 'karakter', type: 'barrier', color: '#06b6d4', modelUrl: '/models/decoration-64f.glb', thumbnailUrl: '/thumbs/decor-64f.webp', targetSize: 7.0 },
  { id: 'dec-kar-bumblebee', name: 'Bumblebee Transformers Run Animated', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#eab308', modelUrl: '/models/bangpay/bumblebee-run-optimized.glb', thumbnailUrl: '/thumbs/bangpay/bumblebee-run-optimized.png', targetSize: 3.5, isNew: true },
  { id: 'dec-kar-optimus', name: 'Optimus Prime Transformers Run Animated', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#dc2626', modelUrl: '/models/bangpay/optimus-prime-run.glb', thumbnailUrl: '/thumbs/bangpay/optimus-prime-run.png', targetSize: 4.5, isNew: true },
  { id: 'dec-kar-mech-transformer', name: 'N-Gen Mech Robot Transformer', category: 'dekorasi', subCategory: 'karakter', type: 'lamp', color: '#3b82f6', modelUrl: '/models/bangpay/n-gen-mech-tranformer.glb', thumbnailUrl: '/thumbs/bangpay/n-gen-mech-tranformer.png', targetSize: 4.2, isNew: true },
  { id: 'dec-kar-super-eggs', name: 'Koleksi Karakter Telur Superhero', category: 'dekorasi', subCategory: 'karakter', type: 'barrier', color: '#ec4899', modelUrl: '/models/bangpay/super-heroes-eggs-model.glb', thumbnailUrl: '/thumbs/bangpay/super-heroes-eggs-model.png', targetSize: 2.5, isNew: true },

  // ==========================================
  // 6. KREASI SAYA (CUSTOM ASSETS & IMPORTS)
  // ==========================================
  { id: 'custom-knight', name: 'Ksatria Zirah Fantasi (Armored Knight)', category: 'custom', type: 'container', color: '#818cf8', modelUrl: '/models/fantasy-armored-knight.glb', thumbnailUrl: '/thumbs/knight.svg', targetSize: 3.5, isCustom: true },
];

export const DEFAULT_TERRAIN_SIZE = 300;
export const DEFAULT_GRID_SIZE = 1;

