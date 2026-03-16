export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  profilePic: string;
}

export interface Workout {
  id: number;
  userId: number;
  type: string;
  duration: number;
  calories: number;
  date: string;
  notes?: string;
}