/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MacroBreakdown {
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
}

export interface CalorieGoal {
  calories: number; // e.g., 2000 kcal
  protein: number;  // e.g., 120g
  carbs: number;    // e.g., 250g
  fats: number;     // e.g., 65g
}

export interface MealItem {
  id: string;
  mealName: string;
  calories: number;
  macros: MacroBreakdown;
  estimatedWeightGrams: number;
  ingredients: string[];
  healthTip: string;
  timestamp: string; // "12:35 PM" e.g.
  imageUrl?: string; // Captured photo or preset selected reference
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  date?: string; // "YYYY-MM-DD" format
}

export interface ScanResult {
  success: boolean;
  mealName: string;
  estimatedWeightGrams: number;
  calories: number;
  macros: MacroBreakdown;
  ingredients: string[];
  healthTip: string;
}

export interface PresetMeal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image: string; // Prompt-friendly simulated base64 or public URLs
  description: string;
  ingredients: string[];
}
