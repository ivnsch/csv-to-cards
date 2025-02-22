import { create } from "zustand";

export type CsvRow = { [key: string]: string };
export type Filters = { [key: string]: boolean };

type Store = {
  data: CsvRow[];
  filters: Filters;
  setData: (newData: CsvRow[]) => void;
  toggleFilter: (header: string) => void;
};

export const useStore = create<Store>((set) => ({
  data: [],
  filters: {},
  setData: (newData) => {
    set({ data: newData });
    if (newData.length > 0) {
      set((state) => ({
        filters: toFilters(newData),
      }));
    }
  },
  toggleFilter: (header) =>
    set((state) => ({
      filters: { ...state.filters, [header]: !state.filters[header] },
    })),
}));

const toFilters = (data: CsvRow[]): Filters => {
  const headers = Object.keys(data[0]);
  return Object.fromEntries(headers.map((header) => [header, true]));
};
