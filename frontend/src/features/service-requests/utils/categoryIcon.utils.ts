export interface CategoryVisualConfig {
  icon: string;
  bgColor: string;
  textColor: string;
}

export function getCategoryVisualConfig(categoryName?: string | null, subserviceName?: string | null): CategoryVisualConfig {
  const combined = `${categoryName || ""} ${subserviceName || ""}`.toLowerCase();

  if (combined.includes("plumb") || combined.includes("pipe") || combined.includes("leak") || combined.includes("drain")) {
    return {
      icon: "fas fa-wrench",
      bgColor: "#fff4ed",
      textColor: "#ea580c"
    };
  }

  if (combined.includes("bath") || combined.includes("tap") || combined.includes("faucet") || combined.includes("toilet") || combined.includes("shower")) {
    return {
      icon: "fas fa-faucet",
      bgColor: "#ffedd5",
      textColor: "#c2410c"
    };
  }

  if (combined.includes("ac") || combined.includes("cool") || combined.includes("air condition") || combined.includes("refriger") || combined.includes("gas refill")) {
    return {
      icon: "fas fa-snowflake",
      bgColor: "#eff6ff",
      textColor: "#2563eb"
    };
  }

  if (combined.includes("carpent") || combined.includes("wood") || combined.includes("furnitur") || combined.includes("assembly") || combined.includes("wardrobe") || combined.includes("sofa")) {
    return {
      icon: "fas fa-couch",
      bgColor: "#fef3c7",
      textColor: "#b45309"
    };
  }

  if (combined.includes("electr") || combined.includes("wire") || combined.includes("switch") || combined.includes("power") || combined.includes("light")) {
    return {
      icon: "fas fa-bolt",
      bgColor: "#fef9c3",
      textColor: "#ca8a04"
    };
  }

  if (combined.includes("clean") || combined.includes("maid") || combined.includes("sweep") || combined.includes("mop") || combined.includes("wash")) {
    return {
      icon: "fas fa-broom",
      bgColor: "#f0fdf4",
      textColor: "#16a34a"
    };
  }

  if (combined.includes("paint") || combined.includes("whitewash") || combined.includes("wall")) {
    return {
      icon: "fas fa-paint-roller",
      bgColor: "#fdf2f8",
      textColor: "#db2777"
    };
  }

  if (combined.includes("appliance") || combined.includes("repair") || combined.includes("tv") || combined.includes("machine")) {
    return {
      icon: "fas fa-tools",
      bgColor: "#f3f4f6",
      textColor: "#4b5563"
    };
  }

  if (combined.includes("pest") || combined.includes("bug") || combined.includes("termite")) {
    return {
      icon: "fas fa-bug",
      bgColor: "#ecfdf5",
      textColor: "#059669"
    };
  }

  return {
    icon: "fas fa-tools",
    bgColor: "#fff4ed",
    textColor: "#FF7900"
  };
}
