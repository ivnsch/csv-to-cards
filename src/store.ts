import { create } from "zustand";
import { MyCsv } from "./db";

export type CsvRow = { [key: string]: string };
export type Filters = { [key: string]: boolean };

type Store = {
  data: MyCsv | null;
  filters: Filters;
  setData: (newData: MyCsv) => void;
  toggleFilter: (header: string) => void;
};

export const useStore = create<Store>((set) => ({
  data: null,
  filters: {},
  setData: (newData) => {
    set({ data: newData });
    if (newData) {
      set(() => ({
        filters: toFilters(newData.rows),
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
