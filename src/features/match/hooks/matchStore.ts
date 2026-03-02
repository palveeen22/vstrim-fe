// store/matchStore.ts (Zustand)
import { create } from 'zustand';
import { MatchFilters, MatchResult } from '../services/matchService';

/**
 * Store untuk manage match state
 * Analogi: Seperti shopping cart state, tapi untuk matched users
 */
interface MatchState {
  matches: MatchResult[];
  filters: MatchFilters;
  selectedMatch: MatchResult | null;
  
  // Actions
  setMatches: (matches: MatchResult[]) => void;
  setFilters: (filters: MatchFilters) => void;
  updateFilters: (filters: Partial<MatchFilters>) => void;
  setSelectedMatch: (match: MatchResult | null) => void;
  clearMatches: () => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  matches: [],
  filters: {
    limit: 20,
    minMatchPercentage: 30,
    excludeIds: [],
  },
  selectedMatch: null,

  setMatches: (matches) => set({ matches }),
  
  setFilters: (filters) => set({ filters }),
  
  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  
  setSelectedMatch: (match) => set({ selectedMatch: match }),
  
  clearMatches: () => set({ matches: [], selectedMatch: null }),
}));