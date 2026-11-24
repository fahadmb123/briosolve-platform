export class DashboardDateService {
  static toIsoString(val: any): string {
    if (!val) return new Date().toISOString();
    if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
      return new Date(Number(val.epochMilliseconds)).toISOString();
    }
    if (val instanceof Date) return val.toISOString();
    try {
      return new Date(val).toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  static toDateObj(val: any): Date {
    if (!val) return new Date();
    if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
      return new Date(Number(val.epochMilliseconds));
    }
    if (val instanceof Date) return val;
    try {
      return new Date(val);
    } catch {
      return new Date();
    }
  }
}

export const toIsoString = DashboardDateService.toIsoString;
export const toDateObj = DashboardDateService.toDateObj;
