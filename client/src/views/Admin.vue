<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 980px; margin: 2rem auto;">
        <h1 class="title is-3 has-text-white has-text-centered">Admin Area</h1>
        <div v-if="!isAdmin" class="has-text-danger has-text-centered">
          <p>Access denied. Admins only.</p>
        </div>
        <div v-else>
          <div class="mb-6">
            <h2 class="title is-5 has-text-white">User Management</h2>
            <button class="button is-link mb-3" @click="showAddUser = true">Add User</button>
            <table class="table is-fullwidth is-striped is-hoverable is-primary">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usersList" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.role }}</td>
                  <td>
                    <button class="button is-small is-info mr-2" @click="editUser(user)">Edit</button>
                    <button class="button is-small is-danger" @click="removeUser(user.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="showAddUser || editingUser">
            <div class="box has-background-black-ter">
              <h3 class="title is-6 has-text-white">{{ editingUser ? 'Edit User' : 'Add User' }}</h3>
              <form @submit.prevent="saveUser">
                <div class="field">
                  <label class="label has-text-white">Name</label>
                  <div class="control">
                    <input class="input" v-model="userForm.name" required />
                  </div>
                </div>
                <div class="field">
                  <label class="label has-text-white">Role</label>
                  <div class="control">
                    <div class="select">
                      <select v-model="userForm.role" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label has-text-white">Profile Picture URL</label>
                  <div class="control">
                    <input class="input" v-model="userForm.profilePicture" placeholder="https://..." />
                  </div>
                </div>
                <div v-if="!editingUser" class="field">
                  <label class="label has-text-white">Initial Password</label>
                  <div class="control">
                    <input class="input" type="password" v-model="newUserPassword" minlength="6" required />
                  </div>
                </div>
                <div class="field is-grouped mt-4">
                  <div class="control">
                    <button class="button is-link" type="submit">Save</button>
                  </div>
                  <div class="control">
                    <button class="button is-light" type="button" @click="cancelEdit">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div class="mt-6">
            <h2 class="title is-5 has-text-white">Exercise Type Management</h2>
            <button class="button is-link mb-3" @click="showAddExerciseType = true">Add Exercise Type</button>
            <table class="table is-fullwidth is-striped is-hoverable is-primary">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Metric Mode</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="exerciseType in exerciseTypes" :key="exerciseType.id">
                  <td>{{ exerciseType.name }}</td>
                  <td>{{ exerciseType.metricMode }}</td>
                  <td>
                    <button class="button is-small is-info mr-2" @click="editExerciseType(exerciseType)">Edit</button>
                    <button class="button is-small is-danger" @click="removeExerciseType(exerciseType.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="showAddExerciseType || editingExerciseType" class="mt-4">
            <div class="box has-background-black-ter">
              <h3 class="title is-6 has-text-white">{{ editingExerciseType ? 'Edit Exercise Type' : 'Add Exercise Type' }}</h3>
              <form @submit.prevent="saveExerciseType">
                <div class="field">
                  <label class="label has-text-white">Name</label>
                  <div class="control">
                    <input class="input" v-model="exerciseTypeForm.name" required />
                  </div>
                </div>
                <div class="field">
                  <label class="label has-text-white">Metric Mode</label>
                  <div class="control">
                    <div class="select">
                      <select v-model="exerciseTypeForm.metricMode" required>
                        <option value="mixed">mixed</option>
                        <option value="reps">reps</option>
                        <option value="minutes">minutes</option>
                        <option value="distance">distance</option>
                        <option value="reps_minutes">reps_minutes</option>
                        <option value="distance_minutes">distance_minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="field is-grouped mt-4">
                  <div class="control">
                    <button class="button is-link" type="submit">Save</button>
                  </div>
                  <div class="control">
                    <button class="button is-light" type="button" @click="cancelExerciseTypeEdit">Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  createExerciseType,
  createUser,
  deleteExerciseType as deleteExerciseTypeApi,
  deleteUser as deleteUserApi,
  listExerciseTypes,
  listUsers,
  updateExerciseType,
  updateUser,
  type AppUser,
  type ExerciseType
} from '../api/services';
import { currentUser } from '../pages/user';

interface User {
  id: number;
  name: string;
  role: string;
  friends: number[];
  profilePicture: string;
}

const isAdmin = computed(() => currentUser.value?.role === 'admin');
const usersList = ref<User[]>([]);
const exerciseTypes = ref<ExerciseType[]>([]);
const showAddUser = ref(false);
const editingUser = ref<User | null>(null);
const showAddExerciseType = ref(false);
const editingExerciseType = ref<ExerciseType | null>(null);
const userForm = ref<Omit<User, 'id'>>({ name: '', role: 'user', friends: [], profilePicture: '' });
const newUserPassword = ref('password123');
const exerciseTypeForm = ref<{ name: string; metricMode: ExerciseType['metricMode'] }>({
  name: '',
  metricMode: 'mixed'
});

function appUserToUser(user: AppUser): User {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    friends: [],
    profilePicture: user.profilePicture || ''
  };
}

async function refreshAdmin() {
  if (!isAdmin.value) {
    usersList.value = [];
    exerciseTypes.value = [];
    return;
  }

  const [usersResponse, exerciseTypesResponse] = await Promise.all([listUsers(), listExerciseTypes()]);
  usersList.value = usersResponse.users.map(appUserToUser);
  exerciseTypes.value = exerciseTypesResponse.exerciseTypes;
}

function resetUserForm() {
  editingUser.value = null;
  showAddUser.value = false;
  userForm.value = { name: '', role: 'user', friends: [], profilePicture: '' };
  newUserPassword.value = 'password123';
}

function resetExerciseTypeForm() {
  editingExerciseType.value = null;
  showAddExerciseType.value = false;
  exerciseTypeForm.value = { name: '', metricMode: 'mixed' };
}

function editUser(user: User) {
  editingUser.value = user;
  userForm.value = {
    name: user.name,
    role: user.role,
    friends: user.friends,
    profilePicture: user.profilePicture
  };
  showAddUser.value = false;
}

function saveUser() {
  void (async () => {
    if (editingUser.value) {
      const response = await updateUser(editingUser.value.id, {
        name: userForm.value.name,
        role: userForm.value.role as 'admin' | 'user',
        profilePicture: userForm.value.profilePicture
      });

      const index = usersList.value.findIndex((user) => user.id === editingUser.value!.id);
      if (index !== -1) {
        usersList.value[index] = appUserToUser(response.user);
      }
    } else {
      const response = await createUser({
        name: userForm.value.name,
        password: newUserPassword.value,
        role: userForm.value.role as 'admin' | 'user',
        profilePicture: userForm.value.profilePicture
      });
      usersList.value.push(appUserToUser(response.user));
    }

    resetUserForm();
  })();
}

function removeUser(id: number) {
  void (async () => {
    await deleteUserApi(id);
    usersList.value = usersList.value.filter((user) => user.id !== id);
  })();
}

function cancelEdit() {
  resetUserForm();
}

function editExerciseType(exerciseType: ExerciseType) {
  editingExerciseType.value = exerciseType;
  exerciseTypeForm.value = { name: exerciseType.name, metricMode: exerciseType.metricMode };
  showAddExerciseType.value = false;
}

function saveExerciseType() {
  void (async () => {
    if (editingExerciseType.value) {
      const response = await updateExerciseType(editingExerciseType.value.id, exerciseTypeForm.value);
      const index = exerciseTypes.value.findIndex((item) => item.id === editingExerciseType.value!.id);
      if (index !== -1) {
        exerciseTypes.value[index] = response.exerciseType;
      }
    } else {
      const response = await createExerciseType(exerciseTypeForm.value);
      exerciseTypes.value.push(response.exerciseType);
      exerciseTypes.value.sort((left, right) => left.name.localeCompare(right.name));
    }

    resetExerciseTypeForm();
  })();
}

function removeExerciseType(id: number) {
  void (async () => {
    await deleteExerciseTypeApi(id);
    exerciseTypes.value = exerciseTypes.value.filter((item) => item.id !== id);
  })();
}

function cancelExerciseTypeEdit() {
  resetExerciseTypeForm();
}

onMounted(() => {
  void refreshAdmin();
});

watch(
  () => currentUser.value?.id,
  () => {
    void refreshAdmin();
  }
);
</script>
