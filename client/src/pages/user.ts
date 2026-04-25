import { ref, type Ref } from 'vue';
import { ApiError, setToken } from '../api/http';
import { getMe, login, register, type AppUser } from '../api/services';

export const currentUser: Ref<AppUser | null> = ref(null);
export const authReady = ref(false);

export async function loginUser(name: string, password: string): Promise<void> {
  const { token, user } = await login(name, password);
  setToken(token);
  currentUser.value = user;
}

export async function registerUser(name: string, password: string, profilePicture?: string): Promise<void> {
  const { token, user } = await register(name, password, profilePicture);
  setToken(token);
  currentUser.value = user;
}

export async function loadSession(): Promise<void> {
  try {
    const { user } = await getMe();
    currentUser.value = user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      logoutUser();
    }
  } finally {
    authReady.value = true;
  }
}

export function logoutUser(): void {
  setToken(null);
  currentUser.value = null;
}
