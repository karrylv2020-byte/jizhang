export enum LoadingStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface MacroNutrient {
  name: string;
  value: number;
  unit: string;
  color: string;
}

export interface Ingredient {
  name: string;
  calories: number;
}

export interface FoodAnalysisResult {
  foodName: string;
  description: string;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: Ingredient[];
  healthScore: number; // 1-10
  healthTips: string[];
}
