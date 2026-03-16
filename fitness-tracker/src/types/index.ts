export type User = {
  id: number;
  name: string;
  friends: number[];
  role?: "admin" | "user";
  profilePicture?: string;
};

export type Workout = {
  id: number;
  userId: number;
  title: string;
  description?: string;
  durationMinutes: number;
  distanceKm?: number;
  date: string; 
  picture?: string;
};