export interface ServiceQuestion {
  id: string;
  label: string;
  type: "TEXT" | "NUMBER" | "SELECT" | "MULTI_SELECT" | "BOOLEAN";
  options?: string[];
  is_required: boolean;
  placeholder?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description?: string | null;
  status?: string;
  questions?: ServiceQuestion[] | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  status?: string;
  services: ServiceItem[];
}

export interface LevelStep {
  level: number;
  label: string;
  title: string;
  subtext: string;
}

export const LEVEL_STEPS: LevelStep[] = [
  {
    level: 1,
    label: "Level 1",
    title: "Select Service",
    subtext: "Category & task",
  },
  {
    level: 2,
    label: "Level 2",
    title: "Requirements",
    subtext: "Details & urgency",
  },
  {
    level: 3,
    label: "Level 3",
    title: "Location & Time",
    subtext: "Address & schedule",
  },
  {
    level: 4,
    label: "Level 4",
    title: "Media & Policy",
    subtext: "Photos & agreement",
  },
];

