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

export const deleteCSV = async () => {
  const db = await dbPromise;
  await db.delete("csvData", "csv");
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
  const res = db.get("csvData", "page");
  if (res == undefined) {
    return null;
  }
  return res;
};

export const deletePage = async () => {
  const db = await dbPromise;
  await db.delete("csvData", "page");
};

export const saveDone = async (done: boolean[]) => {
  const db = await dbPromise;
  await db.put("csvData", done, "done");
};

export const loadDone = async (): Promise<boolean[] | null> => {
  const db = await dbPromise;
  const res = db.get("csvData", "done");
  if (res == undefined) {
    return null;
  }
  return res;
};

export const deleteDone = async () => {
  const db = await dbPromise;
  await db.delete("csvData", "done");
};

export class MyCsv {
  constructor(public name: string, public rows: CsvRow[]) {}
}
