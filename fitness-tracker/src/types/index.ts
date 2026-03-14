// -----------------------------
// User Types
// -----------------------------
export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

// -----------------------------
// Workout Types
// -----------------------------
export interface WorkoutEntry {
  id: number;
  exercise: string;
  reps: number;
  date: string; // ISO string
}

export interface WorkoutType {
  id: number;
  name: string;
  description?: string;
}

// -----------------------------
// Nutrition Types
// -----------------------------
export interface NutritionItem {
  id: number;
  title: string;
  description: string;
  calories?: number;
}

// -----------------------------
// Contact Types
// -----------------------------
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}