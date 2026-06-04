import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { Order, Driver } from "./types";

type DBData = {
  orders: Order[];
  drivers: Driver[];
};

const adapter = new JSONFile<DBData>("src/data/db.json");

export const db = new Low<DBData>(adapter, {
  orders: [],
  drivers: []
});

export async function initDB() {
  await db.read();
  db.data ||= { orders: [], drivers: [] };
  await db.write();
}