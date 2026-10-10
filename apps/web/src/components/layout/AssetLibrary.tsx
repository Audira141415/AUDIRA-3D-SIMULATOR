import React, { useRef, useState, useCallback } from 'react';
import {
  Map,
  Car,
  Plane,
  Truck,
  LayoutGrid,
  Layers,
  Sliders,
  Sparkles,
  Search,
  CheckCircle2,
  Upload,
  Box,
  Globe,
  Sun,
  Trees,
  TreePine,
  TreeDeciduous,
  Mountain,
  Building2,
  MapPin,
  Siren,
  Flame,
  ShieldAlert,
  Zap,
  Gauge,
  Construction,
  Boxes,
  Fuel,
  Wrench,
  Trash2,
  Package,
  Bus,
  Hammer,
  FerrisWheel,
  Ship,
  Gamepad2,
  Waves,
  Store,
  Tent,
  Home,
  Warehouse,
  Server,
  Leaf,
  Route,
  Triangle,
  Lightbulb,
  Snowflake,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';
import { useAssetStore } from '../../stores/useAssetStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { ASSET_CATEGORIES, DEKORASI_SUBCATEGORIES, AssetCategory, AssetDefinition } from '@audira/shared';
import { soundEngine } from '../../features/audio/soundEngine';

const CATEGORY_ICONS: Record<AssetCategory, React.ReactNode> = {
  peta: <Map className="w-3.5 h-3.5" />,
  kendaraan: <Car className="w-3.5 h-3.5" />,
  pesawat: <Plane className="w-3.5 h-3.5" />,
  tractor: <Truck className="w-3.5 h-3.5" />,
  dekorasi: <LayoutGrid className="w-3.5 h-3.5" />,
  objek: <Layers className="w-3.5 h-3.5" />,
  lanskap: <Sliders className="w-3.5 h-3.5" />,
  custom: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
  playground: <LayoutGrid className="w-3.5 h-3.5" />,
  vehicles: <Car className="w-3.5 h-3.5" />,
  buildings: <Layers className="w-3.5 h-3.5" />,
  roads: <Sliders className="w-3.5 h-3.5" />,
  nature: <Sliders className="w-3.5 h-3.5" />,
  decoration: <LayoutGrid className="w-3.5 h-3.5" />,
  infrastructure: <Layers className="w-3.5 h-3.5" />,
};

const getProceduralAssetIcon = (asset: AssetDefinition): React.ComponentType<{ className?: string }> => {
  const id = asset.id.toLowerCase();
  const type = (asset.type || '').toLowerCase();
  const cat = (asset.category || '').toLowerCase();

  // 1. PETA
  if (id === 'map-nusantara') return Globe;
  if (id === 'map-bali') return Sun;
  if (id === 'map-kalimantan') return Trees;
  if (id === 'map-java') return Building2;
  if (id === 'map-sumatra') return Mountain;
  if (cat === 'peta') return MapPin;

  // 2. KENDARAAN
  if (type === 'car-ambulance' || id.includes('ambulance')) return Siren;
  if (type === 'truck-fire' || id.includes('fire')) return Flame;
  if (type === 'car-police' || id.includes('police')) return ShieldAlert;
  if (type === 'car-cyber' || id.includes('cyber')) return Zap;
  if (type === 'car-sport' || type === 'car-supercar' || id.includes('sport') || id.includes('supercar')) return Gauge;
  if (type === 'truck-mixer' || id.includes('mixer')) return Construction;
  if (type === 'crane' || id.includes('crane')) return Construction;
  if (type === 'forklift' || id.includes('forklift')) return Boxes;
  if (type === 'roller' || id.includes('roller')) return Construction;
  if (type === 'truck-tanker' || id.includes('tanker')) return Fuel;
  if (type === 'truck-tow' || id.includes('tow')) return Wrench;
  if (type === 'truck-garbage' || id.includes('garbage')) return Trash2;
  if (type === 'van-delivery' || id.includes('van')) return Package;
  if (type === 'bus-city' || type === 'bus-school' || id.includes('bus')) return Bus;
  if (type.startsWith('car-') || cat === 'kendaraan') return Car;
  if (type.startsWith('truck') || id.includes('dumptruck')) return Truck;

  // 3. PESAWAT
  if (cat === 'pesawat' || type.includes('plane') || type.includes('air')) return Plane;

  // 4. TRACTOR
  if (type === 'excavator' || id.includes('excavator') || id.includes('beko')) return Construction;
  if (type === 'bulldozer' || id.includes('bulldozer')) return Construction;
  if (type === 'tower-crane') return Construction;
  if (type === 'concrete-pump') return Construction;
  if (type === 'pile-driver') return Hammer;
  if (type === 'scaffolding' || id.includes('scaffolding')) return Building2;
  if (cat === 'tractor') return Truck;

  // 5. DEKORASI
  if (type === 'play-ferris-wheel') return FerrisWheel;
  if (type === 'play-pirate-ship') return Ship;
  if (type.startsWith('play-') && !['play-gazebo', 'play-bench', 'play-fountain', 'play-kiosk'].includes(type)) return Gamepad2;
  if (type === 'play-fountain') return Waves;
  if (type === 'play-kiosk') return Store;
  if (type === 'play-gazebo' || type === 'play-bench') return Tent;
  if (type === 'house-small' || type === 'house-large') return Home;
  if (type === 'warehouse') return Warehouse;
  if (type === 'datacenter') return Server;
  if (type === 'tree-pine') return TreePine;
  if (type === 'tree-oak' || type.includes('tree')) return TreeDeciduous;
  if (type === 'bush' || id.includes('rumput')) return Leaf;
  if (type === 'rock' || id.includes('batu')) return Mountain;
  if (type === 'road-straight' || id.includes('jalan')) return Route;
  if (id.includes('knight') || id.includes('ksatria') || id.includes('armor')) return Shield;

  // 6. OBJEK
  if (id === 'obj-power-pole' || type === 'power-pole') return Zap;
  if (id === 'obj-billboard') return LayoutGrid;
  if (id === 'obj-fuel-tank') return Fuel;
  if (type === 'lamp' || id.includes('lamp')) return Lightbulb;
  if (type === 'barrier' || id.includes('barrier')) return ShieldAlert;
  if (type === 'cone' || id.includes('cone')) return Triangle;
  if (type === 'container' || id.includes('container')) return Boxes;
  if (id === 'obj-cube') return Box;
  if (id === 'obj-cylinder') return Layers;

  // 7. LANSKAP
  if (id === 'lan-grass-pbr') return Leaf;
  if (id === 'lan-asphalt-pbr') return Route;
  if (id === 'lan-sky-day') return Sun;
  if (id === 'lan-sand-desert') return Sun;
  if (id === 'lan-snow-field') return Snowflake;
  if (id === 'lan-water-ocean') return Waves;

  return Box;
};

const ProceduralThumbnail: React.FC<{ asset: AssetDefinition }> = ({ asset }) => {
  const IconComponent = getProceduralAssetIcon(asset);
  const color = asset.color || '#00d2ff';

  return (
    <div
      className="w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden transition-all group-hover:scale-[1.02]"
      style={{
        background: `radial-gradient(circle at center, ${color}26 0%, rgba(6, 11, 16, 0.95) 75%)`,
        border: `1px solid ${color}33`,
      }}
    >
      <div
        className="absolute w-10 h-10 rounded-full blur-md opacity-25 pointer-events-none"
        style={{ backgroundColor: color }}
      />
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center border shadow-lg transition-transform group-hover:scale-110"
        style={{
          backgroundColor: `${color}18`,
          borderColor: `${color}55`,
          color: color,
        }}
      >
        <IconComponent className="w-4 h-4 drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]" />
      </div>
      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[7px] font-mono font-bold text-slate-300 border border-white/10">
        3D
      </span>
    </div>
  );
};

export const AssetLibrary: React.FC = () => {
  const isAssetLibraryOpen = useEditorStore((s) => s.isAssetLibraryOpen);
  const toggleAssetLibrary = useEditorStore((s) => s.toggleAssetLibrary);
  const activeCategory = useEditorStore((s) => s.activeCategory);
  const setActiveCategory = useEditorStore((s) => s.setActiveCategory);
  const placingAsset = useEditorStore((s) => s.placingAsset);
  const setPlacingAsset = useEditorStore((s) => s.setPlacingAsset);

  const objects = useWorldStore((s) => s.objects);
  const addObject = useWorldStore((s) => s.addObject);

  const searchQuery = useAssetStore((s) => s.searchQuery);
  const setSearchQuery = useAssetStore((s) => s.setSearchQuery);
  const subCategoryFilter = useAssetStore((s) => s.subCategoryFilter);
  const setSubCategoryFilter = useAssetStore((s) => s.setSubCategoryFilter);
  const getAssetsByCategory = useAssetStore((s) => s.getAssetsByCategory);
  const addCustomAsset = useAssetStore((s) => s.addCustomAsset);

  const currentAssets = getAssetsByCategory(activeCategory);
  const [isDragOver, setIsDragOver] = useState(false);
  const glbInputRef = useRef<HTMLInputElement>(null);

  const handleSelectAsset = (asset: AssetDefinition) => {
    if (placingAsset?.id === asset.id) {
      setPlacingAsset(null);
    } else {
      soundEngine.playUIClick();
      setPlacingAsset(asset);
    }
  };

  const handleGLBUpload = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      alert('Pilih file 3D format .glb atau .gltf');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
    const newAssetId = `custom-upload-${Date.now()}`;
    const newAsset: AssetDefinition = {
      id: newAssetId,
      name: cleanName,
      category: 'custom',
      type: 'container',
      color: '#00d2ff',
      modelUrl: objectUrl,
      isCustom: true,
    };
    addCustomAsset(newAsset);
    setActiveCategory('custom');

    addObject({
      id: `obj-${Date.now()}`,
      name: cleanName,
      type: 'container',
      category: 'custom',
      assetId: newAssetId,
      position: { x: (Math.random() - 0.5) * 10, y: 0, z: (Math.random() - 0.5) * 10 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      locked: false,
      castShadow: true,
      receiveShadow: true,
      color: '#00d2ff',
      modelUrl: objectUrl,
    });
    soundEngine.playSuccess();
  }, [addCustomAsset, setActiveCategory, addObject]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleGLBUpload(file);
  }, [handleGLBUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  // COLLAPSED BAR STATE
  if (!isAssetLibraryOpen) {
    return (
      <div className="h-8 glass-panel border-t border-white/10 px-4 flex items-center justify-between z-20 select-none bg-[#091118]/95 backdrop-blur-md">
        <button
          onClick={toggleAssetLibrary}
          className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold transition-all"
        >
          <ChevronUp className="w-4 h-4" />
          <span>BUKA ASSET LIBRARY ({currentAssets.length} ASET)</span>
        </button>

        <div className="font-mono text-[11px] text-slate-400">
          Scene: <span className="text-cyan-300 font-bold">{objects.length}</span> objek
        </div>
      </div>
    );
  }

  return (
    <div className="h-44 glass-panel border-t border-white/10 flex flex-col z-20 select-none bg-[#091118]/95 backdrop-blur-md">
      {/* 1. TOP CATEGORY TABS */}
      <div className="h-9 px-3 flex items-center justify-between border-b border-white/10 bg-[#060b10]">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none h-full py-0.5">
          {ASSET_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundEngine.playUIClick();
                  setActiveCategory(cat.id);
                }}
                className={`h-full px-3.5 rounded-t-sm text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'bg-[#00d2ff] text-slate-950 border-[#00d2ff] shadow-[0_0_10px_rgba(0,210,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                {CATEGORY_ICONS[cat.id]}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Collapse Button */}
        <button
          onClick={toggleAssetLibrary}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 text-[11px] font-mono"
          title="Tutup Asset Library"
        >
          <span className="hidden sm:inline">Minimize</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* 2. SUB-BAR: SEARCH & FILTERS */}
      <div className="h-8 px-3 flex items-center justify-between border-b border-white/5 bg-[#0a141d]/70 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {/* Search Input */}
          <div className="relative w-40 sm:w-48 flex-shrink-0">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari aset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-md pl-7 pr-2 py-0.5 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Subcategory Chips */}
          {activeCategory === 'dekorasi' && (
            <div className="flex items-center gap-1">
              {DEKORASI_SUBCATEGORIES.map((sub) => {
                const isSubActive = subCategoryFilter === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSubCategoryFilter(sub.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition-all whitespace-nowrap ${
                      isSubActive
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* KREASI SAYA Upload Button */}
          {activeCategory === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                ref={glbInputRef}
                type="file"
                accept=".glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleGLBUpload(e.target.files[0]);
                }}
              />
              <button
                onClick={() => glbInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[10px] font-bold transition-all"
              >
                <Upload className="w-3 h-3" />
                Upload GLB
              </button>
            </div>
          )}
        </div>

        {/* Placing Asset Hint or Item Count */}
        <div className="flex items-center gap-2 pl-2">
          {placingAsset ? (
            <span className="font-mono text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30 animate-pulse">
              Klik di tanah untuk menempatkan: {placingAsset.name}
            </span>
          ) : (
            <span className="font-mono text-[10px] text-slate-400">
              {currentAssets.length} aset tersedia
            </span>
          )}
        </div>
      </div>

      {/* 3. ASSETS SCROLL CAROUSEL */}
      <div
        className={`flex-1 px-3 py-1.5 flex items-center gap-2.5 overflow-x-auto scrollbar-thin transition-all ${
          activeCategory === 'custom' && isDragOver
            ? 'bg-amber-500/10 border-2 border-dashed border-amber-400/60 rounded-b-xl'
            : ''
        }`}
        onDrop={activeCategory === 'custom' ? handleDrop : undefined}
        onDragOver={activeCategory === 'custom' ? handleDragOver : undefined}
        onDragLeave={activeCategory === 'custom' ? handleDragLeave : undefined}
      >
        {activeCategory === 'custom' && currentAssets.length === 0 && (
          <div
            className="flex-1 h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
            onClick={() => glbInputRef.current?.click()}
          >
            <div
              className={`w-10 h-10 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                isDragOver ? 'border-amber-400 bg-amber-500/20' : 'border-slate-600 group-hover:border-amber-400/60'
              }`}
            >
              <Box className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="text-[11px] font-bold text-slate-300 group-hover:text-amber-300">
              Drag &amp; drop file .GLB di sini atau klik Upload
            </div>
          </div>
        )}

        {currentAssets.map((asset) => {
          const isSelectedForPlacement = placingAsset?.id === asset.id;

          return (
            <div
              key={asset.id}
              onClick={() => handleSelectAsset(asset)}
              className={`w-28 h-[94px] flex-shrink-0 rounded-xl p-1.5 flex flex-col justify-between cursor-pointer transition-all duration-150 border relative group ${
                isSelectedForPlacement
                  ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.4)] scale-[1.02]'
                  : 'bg-slate-900/70 hover:bg-slate-800/90 border-white/5 hover:border-white/20'
              }`}
            >
              {/* Asset Thumbnail */}
              <div className="w-full h-12 rounded-lg flex items-center justify-center relative overflow-hidden bg-slate-950/60 border border-white/5">
                {asset.thumbnailUrl ? (
                  <img
                    src={asset.thumbnailUrl}
                    alt={asset.name}
                    className="w-full h-full object-contain p-1 drop-shadow-md group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ) : (
                  <ProceduralThumbnail asset={asset} />
                )}

                {asset.isCustom && (
                  <span className="absolute bottom-0.5 left-0.5 px-1 py-0.2 rounded bg-amber-500/80 text-[7px] font-black text-slate-950">
                    {asset.id.startsWith('custom-upload') ? 'GLB' : 'AI'}
                  </span>
                )}

                {isSelectedForPlacement && (
                  <div className="absolute top-0.5 right-0.5 text-cyan-400 bg-slate-900/90 rounded-full p-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current text-cyan-400" />
                  </div>
                )}
              </div>

              {/* Title & Category Info */}
              <div>
                <div className="text-[10px] font-bold text-slate-200 truncate" title={asset.name}>
                  {asset.name}
                </div>
                <div className="text-[8px] font-mono text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>{asset.subCategory || asset.category}</span>
                  {isSelectedForPlacement && <span className="text-cyan-400 font-bold">READY</span>}
                </div>
              </div>
            </div>
          );
        })}

        {currentAssets.length === 0 && activeCategory !== 'custom' && (
          <div className="text-xs text-slate-500 font-mono italic pl-2">
            Tidak ada asset ditemukan dalam kategori ini.
          </div>
        )}
      </div>
    </div>
  );
};
