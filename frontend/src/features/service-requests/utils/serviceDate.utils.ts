export const formatToYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayDate = (): string => {
  return formatToYMD(new Date());
};

export const getEndOfWeekDate = (): string => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const target = new Date(now);
  target.setDate(now.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
  return formatToYMD(target);
};

export const getFlexibleDate = (): string => {
  const now = new Date();
  const target = new Date(now);
  target.setDate(now.getDate() + 30);
  return formatToYMD(target);
};

export const computeDateForUrgency = (
  urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE",
  currentSpecificDate?: string
): string => {
  switch (urgency) {
    case "TODAY":
      return getTodayDate();
    case "THIS_WEEK":
      return getEndOfWeekDate();
    case "FLEXIBLE":
      return getFlexibleDate();
    case "SPECIFIC_DATE":
      return currentSpecificDate && currentSpecificDate >= getTodayDate()
        ? currentSpecificDate
        : getTodayDate();
    default:
      return getTodayDate();
  }
};

