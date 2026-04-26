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
        <RouterLink v-if="currentUser" class="navbar-item has-text-white" to="/EditProfile">
          <span class="icon"><i class="fas fa-user-edit"></i></span>
          <span>Edit Profile</span>
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
              <div class="dropdown is-right" :class="{ 'is-active': showDropdown }" tabindex="0" @blur="closeDropdown">
                <div class="dropdown-trigger">
                  <button class="button is-link" @click="toggleDropdown">
                    <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                    <span>Login</span>
                  </button>
                </div>
                <div class="dropdown-menu">
                  <div class="dropdown-content">
                    <div class="dropdown-item" style="min-width: 260px;">
                      <div class="field">
                        <label class="label is-small">Name</label>
                        <div class="control">
                          <input class="input" v-model="loginName" placeholder="username" />
                        </div>
                      </div>
                      <div class="field">
                        <label class="label is-small">Password</label>
                        <div class="control">
                          <input class="input" type="password" v-model="loginPassword" placeholder="password" />
                        </div>
                      </div>
                      <p v-if="loginError" class="has-text-danger is-size-7 mb-2">{{ loginError }}</p>
                      <button class="button is-link is-fullwidth" :disabled="isLoggingIn" @click.stop="submitLogin">
                        {{ isLoggingIn ? 'Logging in...' : 'Login' }}
                      </button>
                    </div>
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
import { ApiError } from "../api/http";
import { currentUser, loginUser, logoutUser } from "../pages/user";

const showDropdown = ref(false);
const burgerActive = ref(false);
const router = useRouter();
const loginName = ref('');
const loginPassword = ref('');
const loginError = ref('');
const isLoggingIn = ref(false);

function goToSignUp() {
  router.push("/SignUp");
}
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
function closeDropdown() {
  showDropdown.value = false;
}

async function submitLogin() {
  loginError.value = '';
  isLoggingIn.value = true;
  try {
    await loginUser(loginName.value, loginPassword.value);
    showDropdown.value = false;
    loginName.value = '';
    loginPassword.value = '';
  } catch (error) {
    if (error instanceof ApiError) {
      loginError.value = error.message;
    } else {
      loginError.value = 'Unable to login';
    }
  } finally {
    isLoggingIn.value = false;
  }
}

const isAdmin = computed(() => (currentUser.value as any) && (currentUser.value as any).role === 'admin');
</script>

