export interface IngredientAnalysis {
  name: string;
  efficacyRating: string; // e.g., "High", "Moderate", "Low"
  safetyRating: string;
  description: string;
}

export interface SupplementData {
  productName: string;
  brand: string;
  description: string;
  ingredients: IngredientAnalysis[];
  scientificResearch: string; // Summary of backing
  safetyConsiderations: string; // Side effects, interactions
  recommendedDosage: string;
  qualityAssessment: string; // Available evidence quality
  overallVerdict: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  goal: string;
  age: string;
  restriction: string;
}

export enum AppView {
  HOME = 'HOME',
  SCANNER = 'SCANNER',
  SEARCH = 'SEARCH',
  CONSULTANT = 'CONSULTANT',
  MORE = 'MORE'
}