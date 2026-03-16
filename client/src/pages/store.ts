import { ref, type Ref } from 'vue';

export interface User {
  id: string | number;
  name: string;
  profilePicture?: string;
}

export interface Workout {
  [key: string]: any;
}

export const currentUser: Ref<User | null> = ref(null);
export const userWorkouts: Ref<Record<string | number, Workout[]>> = ref({});

export function loginUser(user: User | null): void {
  currentUser.value = user;
}

export function addWorkoutForCurrentUser(workout: Workout): void {
  if (!currentUser.value) return;
  const id = currentUser.value.id;
  if (!userWorkouts.value[id]) userWorkouts.value[id] = [];
  userWorkouts.value[id].push(workout);
}

export function getWorkoutsForUser(userId: string | number): Workout[] {
  return userWorkouts.value[userId] || [];
}
