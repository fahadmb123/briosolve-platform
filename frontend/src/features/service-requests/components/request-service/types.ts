export interface ServiceItem {
  id: string;
  name: string;
  description?: string | null;
  status?: string;
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
    title: "Budget & Media",
    subtext: "Pricing & photos",
  },
];

