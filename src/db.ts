import { openDB } from "idb";
import { CsvRow } from "./store";

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

export class MyCsv {
  constructor(public name: string, public rows: CsvRow[]) {}
}
