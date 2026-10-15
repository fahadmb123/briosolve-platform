import { Temporal, toTemporalInstant } from "@js-temporal/polyfill";
declare global {
  var Temporal: any;
  interface Date {
    toTemporalInstant: typeof toTemporalInstant;
  }
}

globalThis.Temporal = Temporal;
Date.prototype.toTemporalInstant = toTemporalInstant;
import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";

import type { Contract } from "../../../../../prisma/contract";
import contractJson from "../../../../../prisma/contract.json" with { type: "json" };

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});