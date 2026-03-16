<template>
  <nav class="navbar is-info" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a role="button" class="navbar-burger" :class="{ 'is-active': burgerActive }" aria-label="menu" aria-expanded="false" @click="burgerActive = !burgerActive">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': burgerActive }">
      <div class="navbar-start">
        <RouterLink class="navbar-item has-text-white" to="/HomePage">
          <span class="icon"><i class="fas fa-dumbbell"></i></span>
          <span>Exercise Hub</span>
        </RouterLink>
        <RouterLink class="navbar-item has-text-white" to="/HomePage">
          <span class="icon"><i class="fas fa-home"></i></span>
          <span>Home</span>
        </RouterLink>
        <RouterLink class="navbar-item has-text-white" to="/MyActivity">
          <span class="icon"><i class="fas fa-running"></i></span>
          <span>My Activity</span>
        </RouterLink>
        <RouterLink class="navbar-item has-text-white" to="/StatisticsPage">
          <span class="icon"><i class="fas fa-chart-bar"></i></span>
          <span>Statistics</span>
        </RouterLink>
        <RouterLink class="navbar-item has-text-white" to="/FriendsActivity">
          <span class="icon"><i class="fas fa-users"></i></span>
          <span>Friends Activity</span>
        </RouterLink>
        <RouterLink class="navbar-item has-text-white" to="/PeopleSearch">
          <span class="icon"><i class="fas fa-search"></i></span>
          <span>People Search</span>
        </RouterLink>
        <RouterLink v-if="isAdmin" class="navbar-item has-text-warning" to="/Admin">
          <span class="icon"><i class="fas fa-user-shield"></i></span>
          <span>Admin</span>
        </RouterLink>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <template v-if="!currentUser">
              <button class="button is-link" @click="goToSignUp">
                <span class="icon"><i class="fas fa-user-plus"></i></span>
                <span>Sign Up</span>
              </button>
              <div class="dropdown is-right" :class="{ 'is-active': showDropdown }" @click="toggleDropdown" tabindex="0" @blur="closeDropdown">
                <div class="dropdown-trigger">
                  <button class="button is-link">
                    <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                    <span>Login</span>
                  </button>
                </div>
                <div class="dropdown-menu">
                  <div class="dropdown-content">
                    <a v-for="user in users" :key="user.id" class="dropdown-item is-flex is-align-items-center" @click.stop="selectUser(user)">
                      <img :src="user.profilePicture" class="image is-32x32 mr-3 is-rounded" />
                      <span class="is-size-5 has-text-weight-semibold">{{ user.name }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="is-flex is-align-items-center">
                <img :src="(currentUser as any).profilePicture" class="image is-60x50 mr-3 is-rounded" />
                <span class="is-size-5 has-text-weight-semibold has-text-white mr-3">{{ (currentUser as any).name }}</span>
                <button class="button is-danger" @click="logoutUser">
                  <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
                  <span>Log out</span>
                </button>
              </div>
            </template>
          </div>
        </div>
        <div class="navbar-item">
          <a
            href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20fitness%20tracker!"
            target="_blank"
            rel="noopener noreferrer"
            class="button is-black ml-3 is-flex is-align-items-center"
          >
            <span class="icon">
              <i class="fab fa-twitter"></i>
            </span>
            <span>Tweet</span>
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { ref, computed } from "vue";
import users from "../users/users.json";
import { currentUser, loginUser } from "../pages/user";

const showDropdown = ref(false);
const burgerActive = ref(false);
const router = useRouter();
function goToSignUp() {
  router.push("/SignUp");
}
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
function closeDropdown() {
  showDropdown.value = false;
}
function selectUser(user: any) {
  loginUser(user);
  showDropdown.value = false;
}
function logoutUser() {
  loginUser(null);
}
const isAdmin = computed(() => (currentUser.value as any) && (currentUser.value as any).role === 'admin');
</script>

