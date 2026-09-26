export {};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (
      command: "config" | "event" | "js" | "set",
      targetIdOrDate: string | Date,
      configOrParams?: Record<string, any>
    ) => void;
  }
}
