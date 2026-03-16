<template>
  <section class="section has-background-black-ter min-vh-100">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 900px; margin: 2rem auto;">
        <h1 class="title is-3 has-text-white has-text-centered">Admin Area</h1>
        <div v-if="!isAdmin" class="has-text-danger has-text-centered">
          <p>Access denied. Admins only.</p>
        </div>
        <div v-else>
          <div class="mb-5">
            <h2 class="title is-5 has-text-white">User Management</h2>
            <button class="button is-primary mb-3" @click="showAddUser = true">Add User</button>
            <table class="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usersList" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
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
                  <label class="label has-text-white">Email</label>
                  <div class="control">
                    <input class="input" v-model="userForm.email" required />
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
                <div class="field is-grouped mt-4">
                  <div class="control">
                    <button class="button is-success" type="submit">Save</button>
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
import { ref, computed } from 'vue';
import usersData from '../users/users.json';
import { currentUser } from '../pages/store';

const isAdmin = computed(() => currentUser.value && currentUser.value.role === 'admin');
const usersList = ref([...usersData]);
const showAddUser = ref(false);
const editingUser = ref(null);
const userForm = ref({ name: '', email: '', role: 'user' });

function editUser(user: any) {
  editingUser.value = user;
  userForm.value = { ...user };
  showAddUser.value = false;
}
function deleteUser(id: number) {
  usersList.value = usersList.value.filter(u => u.id !== id);
}
function saveUser() {
  if (editingUser.value) {
    const idx = usersList.value.findIndex(u => u.id === editingUser.value.id);
    if (idx !== -1) usersList.value[idx] = { ...userForm.value, id: editingUser.value.id };
    editingUser.value = null;
  } else {
    usersList.value.push({ ...userForm.value, id: Date.now() });
  }
  userForm.value = { name: '', email: '', role: 'user' };
  showAddUser.value = false;
}
function cancelEdit() {
  editingUser.value = null;
  showAddUser.value = false;
  userForm.value = { name: '', email: '', role: 'user' };
}
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
</style>
