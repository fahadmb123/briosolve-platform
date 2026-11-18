declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const resetRazorpay = (): void => {
  if (typeof window === "undefined") return;

  try {
    const containers = document.querySelectorAll(".razorpay-container");
    containers.forEach((c) => {
      (c as HTMLElement).style.display = "none";
      c.remove();
    });

    const scripts = document.querySelectorAll('script[src*="checkout.razorpay.com"]');
    scripts.forEach((s) => s.remove());

    delete (window as any).Razorpay;
  } catch {}
};

export const loadRazorpayScript = (forceReload: boolean = false): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (forceReload) {
      resetRazorpay();
    } else if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
