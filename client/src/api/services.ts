import { request } from './http';

export interface AppUser {
  id: number;
  name: string;
  role: 'admin' | 'user';
  profilePicture?: string;
  createdAt?: string;
}

export interface ExerciseType {
  id: number;
  name: string;
  metricMode: 'mixed' | 'reps' | 'minutes' | 'distance' | 'reps_minutes' | 'distance_minutes';
}

export interface ActivityComment {
  id: number;
  activityId: number;
  userId: number;
  userName: string;
  userProfilePicture?: string;
  body: string;
  createdAt: string;
}

export interface Activity {
  id: number;
  userId: number;
  exerciseTypeId: number;
  exerciseTypeName: string;
  reps?: number;
  minutes?: number;
  distanceKm?: number;
  photoUrl?: string;
  performedAt: string;
  userName?: string;
  userProfilePicture?: string;
  likeCount?: number;
  likedByMe?: boolean;
  comments?: ActivityComment[];
}

export interface ActivityInsights {
  summary: {
    totalActivities: number;
    totalMinutes: number;
    totalDistance: number;
    totalReps: number;
  };
  breakdown: Array<{
    type: string;
    count: number;
  }>;
  favouriteExercise: string | null;
  streak: number;
  recentActivities: Activity[];
}

export async function login(name: string, password: string) {
  return request<{ token: string; user: AppUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name, password })
  });
}

export async function register(name: string, password: string, profilePicture?: string) {
  return request<{ token: string; user: AppUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, password, profilePicture })
  });
}

export async function getMe() {
  return request<{ user: AppUser }>('/auth/me');
}

export async function listUsers() {
  return request<{ users: AppUser[] }>('/users');
}

export async function createUser(payload: {
  name: string;
  password: string;
  role?: 'admin' | 'user';
  profilePicture?: string;
}) {
  return request<{ user: AppUser }>('/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateUser(
  id: number,
  payload: Partial<Pick<AppUser, 'name' | 'profilePicture' | 'role'>> & { password?: string }
) {
  return request<{ user: AppUser }>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteUser(id: number) {
  return request<void>(`/users/${id}`, { method: 'DELETE' });
}

export async function listMyFriends() {
  return request<{ friends: AppUser[] }>('/users/me/friends');
}

export async function addMyFriend(friendId: number) {
  return request<{ message: string }>('/users/me/friends', {
    method: 'POST',
    body: JSON.stringify({ friendId })
  });
}

export async function removeMyFriend(friendId: number) {
  return request<void>(`/users/me/friends/${friendId}`, { method: 'DELETE' });
}

export async function listExerciseTypes() {
  return request<{ exerciseTypes: ExerciseType[] }>('/exercise-types');
}

export async function createExerciseType(payload: { name: string; metricMode: ExerciseType['metricMode'] }) {
  return request<{ exerciseType: ExerciseType }>('/exercise-types', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateExerciseType(
  id: number,
  payload: Partial<{ name: string; metricMode: ExerciseType['metricMode'] }>
) {
  return request<{ exerciseType: ExerciseType }>(`/exercise-types/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteExerciseType(id: number) {
  return request<void>(`/exercise-types/${id}`, { method: 'DELETE' });
}

export async function listMyActivities() {
  return request<{ activities: Activity[] }>('/activities/me');
}

export async function listFriendActivities(friendId: number) {
  return request<{ activities: Activity[] }>(`/activities/friends/${friendId}`);
}

export async function listFriendsFeed() {
  return request<{ activities: Activity[] }>('/activities/friends/feed');
}

export async function createActivity(payload: {
  exerciseTypeId: number;
  reps?: number | null;
  minutes?: number | null;
  distanceKm?: number | null;
  photoUrl?: string | null;
  performedAt: string;
}) {
  return request<{ activity: Activity }>('/activities/me', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateActivity(
  id: number,
  payload: {
    exerciseTypeId?: number;
    reps?: number | null;
    minutes?: number | null;
    distanceKm?: number | null;
    photoUrl?: string | null;
    performedAt?: string;
  }
) {
  return request<{ activity: Activity }>(`/activities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function deleteActivity(id: number) {
  return request<void>(`/activities/${id}`, { method: 'DELETE' });
}

export async function toggleLike(activityId: number) {
  return request<{ liked: boolean; likeCount: number }>(`/activities/${activityId}/like`, {
    method: 'POST'
  });
}

export async function listComments(activityId: number) {
  return request<{ comments: ActivityComment[] }>(`/activities/${activityId}/comments`);
}

export async function addComment(activityId: number, body: string) {
  return request<{ comment: ActivityComment }>(`/activities/${activityId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body })
  });
}

export async function deleteComment(activityId: number, commentId: number) {
  return request<void>(`/activities/${activityId}/comments/${commentId}`, { method: 'DELETE' });
}

export async function getMySummary() {
  return request<{
    summary: {
      totalActivities: number;
      totalMinutes: number;
      totalDistance: number;
      totalReps: number;
    };
  }>('/activities/me/summary');
}

export async function getMyInsights() {
  return request<ActivityInsights>('/activities/me/insights');
}
