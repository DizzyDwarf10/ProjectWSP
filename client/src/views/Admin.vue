<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 900px; margin: 2rem auto;">
        <h1 class="title is-3 has-text-white has-text-centered">Admin Area</h1>
        <div v-if="!isAdmin" class="has-text-danger has-text-centered">
          <p>Access denied. Admins only.</p>
        </div>
        <div v-else>
          <div class="mb-5">
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
                    <button class="button is-small is-danger" @click="deleteUser(user.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="showAddUser || editingUser">
            <div class="box has-background-dark">
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
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { currentUser } from '../pages/user';
import { createUser, deleteUser as deleteUserApi, listUsers, updateUser, type AppUser } from '../api/services';

interface User {
  id: number;
  name: string;
  role: string;
  friends: number[];
  profilePicture: string;
}

const isAdmin = computed(() => (currentUser.value as any) && (currentUser.value as any).role === 'admin');
const usersList = ref<User[]>([]);
const showAddUser = ref(false);
const editingUser = ref<User | null>(null);
const userForm = ref<Omit<User, 'id'>>({ name: '', role: 'user', friends: [], profilePicture: '' });
const newUserPassword = ref('password123');

function appUserToUser(user: AppUser): User {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    friends: [],
    profilePicture: user.profilePicture || ''
  };
}

async function refreshUsers() {
  if (!isAdmin.value) return;
  const response = await listUsers();
  usersList.value = response.users.map(appUserToUser);
}

onMounted(() => {
  void refreshUsers();
});

watch(
  () => currentUser.value?.id,
  () => {
    void refreshUsers();
  }
);

function editUser(user: User) {
  editingUser.value = user;
  userForm.value = { name: user.name, role: user.role, friends: user.friends, profilePicture: user.profilePicture };
  showAddUser.value = false;
}
function deleteUser(id: number) {
  void (async () => {
    await deleteUserApi(id);
    usersList.value = usersList.value.filter(u => u.id !== id);
  })();
}
function saveUser() {
  void (async () => {
    if (editingUser.value !== null) {
      const response = await updateUser(editingUser.value.id, {
        name: userForm.value.name,
        role: userForm.value.role as 'admin' | 'user',
        profilePicture: userForm.value.profilePicture
      });

      const idx = usersList.value.findIndex(u => u.id === editingUser.value!.id);
      if (idx !== -1) {
        usersList.value[idx] = appUserToUser(response.user);
      }
      editingUser.value = null;
    } else {
      const created = await createUser({
        name: userForm.value.name,
        password: newUserPassword.value,
        role: userForm.value.role as 'admin' | 'user',
        profilePicture: userForm.value.profilePicture
      });
      usersList.value.push(appUserToUser(created.user));
    }

    userForm.value = { name: '', role: 'user', friends: [], profilePicture: '' };
    newUserPassword.value = 'password123';
    showAddUser.value = false;
  })();
}
function cancelEdit() {
  editingUser.value = null;
  showAddUser.value = false;
  userForm.value = { name: '', role: 'user', friends: [], profilePicture: '' };
  newUserPassword.value = 'password123';
}
</script>
