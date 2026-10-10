import { create } from 'zustand';
import { AssetDefinition, AssetCategory, INITIAL_ASSET_LIBRARY } from '@audira/shared';

interface AssetState {
  assets: AssetDefinition[];
  searchQuery: string;
  subCategoryFilter: string;
  setSearchQuery: (query: string) => void;
  setSubCategoryFilter: (sub: string) => void;
  addCustomAsset: (asset: AssetDefinition) => void;
  getAssetsByCategory: (category: AssetCategory) => AssetDefinition[];
}

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: INITIAL_ASSET_LIBRARY,
  searchQuery: '',
  subCategoryFilter: 'semua',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSubCategoryFilter: (sub) => set({ subCategoryFilter: sub }),

  addCustomAsset: (newAsset) => {
    set((state) => ({
      assets: [newAsset, ...state.assets],
    }));
  },

  getAssetsByCategory: (category) => {
    const { assets, searchQuery, subCategoryFilter } = get();
    const query = searchQuery.trim().toLowerCase();

    // If searching, search across all assets in the library
    if (query !== '') {
      return assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(query) ||
          asset.type.toLowerCase().includes(query) ||
          (asset.category && asset.category.toLowerCase().includes(query)) ||
          (asset.subCategory && asset.subCategory.toLowerCase().includes(query))
      );
    }

    // Normal category and subcategory filtering
    return assets.filter((asset) => {
      const matchesCat = asset.category === category;
      const matchesSub =
        category !== 'dekorasi' ||
        subCategoryFilter === 'semua' ||
        asset.subCategory === subCategoryFilter;
      return matchesCat && matchesSub;
    });
  },
}));
