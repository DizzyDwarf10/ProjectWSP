import { defineStore } from 'pinia';
import { ref } from 'vue';
import { updateUser } from '../api/services';
import { ApiError } from '../api/http';
import { currentUser } from '../pages/user';

export const useProfileStore = defineStore('profile', () => {
  const isSaving = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);

  async function saveProfile(payload: { profilePicture?: string; password?: string }) {
    if (!currentUser.value) return;
    isSaving.value = true;
    error.value = null;
    success.value = null;
    try {
      const res = await updateUser(currentUser.value.id, payload);
      currentUser.value = res.user;
      success.value = 'Profile updated.';
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Unable to update profile.';
    } finally {
      isSaving.value = false;
    }
  }

  return { isSaving, error, success, saveProfile };
});
