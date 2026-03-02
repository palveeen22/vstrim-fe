// Zustand store for match UI state only.
// Business data (matches list) is managed by React Query (useMatchUsers).
import { create } from 'zustand';
import { MatchFilters } from '../services/matchService';
import { MatchItem } from '../model/content';

interface MatchUIState {
  // Local filter preferences (UI state)
  filters: MatchFilters;
  // Currently selected match for detail view (UI state)
  selectedMatch: MatchItem | null;

  setFilters: (filters: MatchFilters) => void;
  updateFilters: (filters: Partial<MatchFilters>) => void;
  setSelectedMatch: (match: MatchItem | null) => void;
}

export const useMatchStore = create<MatchUIState>((set) => ({
  filters: {
    limit: 20,
    minMatchPercentage: 30,
    excludeIds: [],
  },
  selectedMatch: null,

  setFilters: (filters) => set({ filters }),

  updateFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  setSelectedMatch: (match) => set({ selectedMatch: match }),
}));
