export type BandwidthMode = "standard" | "low-bandwidth" | "offline";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface EducationArticle {
  id: string;
  category: "maternal" | "infectious" | "first-aid" | "sanitation";
  title: string;
  subtitle: string;
  summary: string; // concise bullet-points for low-bandwidth mode
  fullContent: string; // rich text details for standard mode
  precautions: string[];
  offlineAvailable: boolean;
}

export interface ClinicResource {
  id: string;
  name: string;
  type: "dispensary" | "primary-health-center" | "referral-hospital";
  distanceKm: number;
  travelTimeMin: {
    walking: number;
    bicycle: number;
    motorcycle: number;
  };
  district: string;
  openHours: string;
  contactNumber: string;
  services: string[];
  stockLevel: {
    malariaPills: "High" | "Medium" | "Low" | "Out of Stock";
    orsPackets: "High" | "Medium" | "Low" | "Out of Stock";
    vaccines: "High" | "Medium" | "Low" | "Out of Stock";
    antibiotics: "High" | "Medium" | "Low" | "Out of Stock";
  };
  coordinates: { x: number; y: number }; // Simulated custom map coordinates
}

export type TriageSeverity = "green" | "yellow" | "red" | "idle";

export interface TriageStep {
  id: string;
  question: string;
  yesNext: string | TriageSeverity; // next step ID or severity outcome
  noNext: string | TriageSeverity;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  ttsVoiceName?: string;
}
