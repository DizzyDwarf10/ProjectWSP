import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  createExerciseType,
  createUser,
  deleteExerciseType,
  deleteUser,
  listExerciseTypes,
  listUsers,
  updateExerciseType,
  updateUser,
  type AppUser,
  type ExerciseType
} from '../api/services';

export const useAdminStore = defineStore('admin', () => {
  const users = ref<AppUser[]>([]);
  const exerciseTypes = ref<ExerciseType[]>([]);
  const error = ref<string | null>(null);

  async function refresh() {
    error.value = null;
    const [usersRes, typesRes] = await Promise.all([listUsers(), listExerciseTypes()]);
    users.value = usersRes.users;
    exerciseTypes.value = typesRes.exerciseTypes;
  }

  async function addUser(payload: { name: string; password: string; role: 'admin' | 'user'; profilePicture?: string }) {
    error.value = null;
    const res = await createUser(payload);
    users.value.push(res.user);
  }

  async function editUser(id: number, payload: Partial<Pick<AppUser, 'name' | 'profilePicture' | 'role'>> & { password?: string }) {
    error.value = null;
    const res = await updateUser(id, payload);
    const idx = users.value.findIndex((u) => u.id === id);
    if (idx !== -1) users.value[idx] = res.user;
  }

  async function removeUser(id: number) {
    error.value = null;
    await deleteUser(id);
    users.value = users.value.filter((u) => u.id !== id);
  }

  async function addExerciseType(payload: { name: string; metricMode: ExerciseType['metricMode'] }) {
    error.value = null;
    const res = await createExerciseType(payload);
    exerciseTypes.value.push(res.exerciseType);
    exerciseTypes.value.sort((a, b) => a.name.localeCompare(b.name));
  }

  async function editExerciseType(id: number, payload: Partial<{ name: string; metricMode: ExerciseType['metricMode'] }>) {
    error.value = null;
    const res = await updateExerciseType(id, payload);
    const idx = exerciseTypes.value.findIndex((t) => t.id === id);
    if (idx !== -1) exerciseTypes.value[idx] = res.exerciseType;
  }

  async function removeExerciseType(id: number) {
    error.value = null;
    await deleteExerciseType(id);
    exerciseTypes.value = exerciseTypes.value.filter((t) => t.id !== id);
  }

  return {
    users,
    exerciseTypes,
    error,
    refresh,
    addUser,
    editUser,
    removeUser,
    addExerciseType,
    editExerciseType,
    removeExerciseType
  };
});
