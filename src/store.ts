import { create } from "zustand";
import { MyCsv } from "./db";

export type CsvRow = { [key: string]: string };
export type Filters = { [key: string]: boolean };
export class CardSettings {
  constructor(public showHeaders: boolean) {}
}

type Store = {
  data: MyCsv | null;
  filters: Filters;
  cardSettings: CardSettings;
  setData: (newData: MyCsv) => void;
  setFilters: (newFilters: Filters) => void;
  toggleFilter: (header: string) => void;
  toggleShowHeaders: () => void;
};

export const useStore = create<Store>((set) => ({
  data: null,
  filters: {},
  cardSettings: new CardSettings(true),
  setData: (newData) => {
    set({ data: newData });
    if (newData) {
      set(() => ({
        filters: toFilters(newData.rows),
      }));
    }
  },
  setFilters: (newFilters) => {
    set({ filters: newFilters });
  },

  toggleFilter: (header) =>
    set((state) => ({
      filters: { ...state.filters, [header]: !state.filters[header] },
    })),

  toggleShowHeaders: () =>
    set((state) => ({
      cardSettings: {
        ...state.cardSettings,
        showHeaders: !state.cardSettings.showHeaders,
      },
    })),
}));

const toFilters = (data: CsvRow[]): Filters => {
  const headers = Object.keys(data[0]);
  return Object.fromEntries(headers.map((header) => [header, true]));
};
