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
  cell: (rowIndex: number, column: string) => string;
  setData: (newData: MyCsv | null) => void;
  setFilters: (newFilters: Filters) => void;
  toggleFilter: (header: string) => void;
  toggleShowHeaders: () => void;
  updateCell: (rowIndex: number, column: string, newValue: string) => void;
  done: boolean[];
  setDone: (done: boolean[]) => void;
  toggleDone: (rowIndex: number) => void;
  cardIndex: number;
  setCardIndex: (index: number) => void;
  customLayout: string;
  setCustomLayout: (layout: string) => void;
};

export const useStore = create<Store>((set) => ({
  data: null,
  filters: {},
  done: [],
  cardIndex: 0,
  customLayout: "",

  cardSettings: new CardSettings(true),
  cell: (rowIndex: number, column: string): string => {
    return useStore.getState().data?.rows[rowIndex]?.[column] ?? "";
  },
  setData: (newData) => {
    set({ data: newData });
    if (newData) {
      set(() => ({
        filters: toFilters(newData),
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

  updateCell: (rowIndex, column, newValue) =>
    set((state) => {
      if (!state.data) return state;

      const updatedRows = state.data.rows.map((row, i) =>
        i === rowIndex ? { ...row, [column]: newValue } : row
      );

      return {
        data: new MyCsv(state.data.name, state.data.headers, updatedRows),
      };
    }),

  setDone: (newDone) => {
    set({ done: newDone });
  },
  toggleDone: (rowIndex) =>
    set((state) => {
      const updatedDone = [...state.done];
      updatedDone[rowIndex] = !updatedDone[rowIndex];
      console.log("toggled done: " + updatedDone + " for index: " + rowIndex);

      return { done: updatedDone };
    }),

  setCardIndex: (index: number) =>
    set(() => ({
      cardIndex: index,
    })),

  setCustomLayout: (layout: string) => set({ customLayout: layout }),
}));

const toFilters = (data: MyCsv): Filters => {
  return Object.fromEntries(data.headers.map((header) => [header, true]));
};

// returns rows with respectively array of values corresponding to column names
export const parseCustomLayout = (
  layout: string,
  rowData: CsvRow
): string[][] | null => {
  const str = layout.trim();
  if (str.length == 0) {
    return null;
  }
  return str
    .split("\n")
    .map((row) => row.split(" ").map((col) => rowData[col] || ""));
};
