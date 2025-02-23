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
  console.log("db is aving filters: " + JSON.stringify(data));

  await db.put("csvData", data, "filters");
};

export const loadFilters = async (): Promise<Filters | null> => {
  const db = await dbPromise;
  return (await db.get("csvData", "filters")) || null;
};

export class MyCsv {
  constructor(public name: string, public rows: CsvRow[]) {}
}
