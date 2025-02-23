import { openDB } from "idb";
import { CsvRow, Filters } from "./store";

const dbPromise = openDB("csvDatabase", 1, {
  upgrade(db) {
    db.createObjectStore("csvData");
  },
});

export const saveCSV = async (data: MyCsv) => {
  const db = await dbPromise;
  await db.put("csvData", data, "csv");
};

export const loadCSV = async (): Promise<MyCsv | null> => {
  const db = await dbPromise;
  return (await db.get("csvData", "csv")) || null;
};

export const saveFilters = async (data: Filters) => {
  const db = await dbPromise;
  await db.put("csvData", data, "filters");
};

export const loadFilters = async (): Promise<Filters | null> => {
  const db = await dbPromise;
  return (await db.get("csvData", "filters")) || null;
};

export const deleteFilters = async () => {
  const db = await dbPromise;
  await db.delete("csvData", "filters");
};

export const savePage = async (page: number) => {
  const db = await dbPromise;
  await db.put("csvData", page, "page");
};

export const loadPage = async (): Promise<number | null> => {
  const db = await dbPromise;
  return (await db.get("csvData", "page")) || null;
};

export const deletePage = async () => {
  const db = await dbPromise;
  await db.delete("csvData", "page");
};

export class MyCsv {
  constructor(public name: string, public rows: CsvRow[]) {}
}
