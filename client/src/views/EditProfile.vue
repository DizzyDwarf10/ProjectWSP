<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 480px; margin: 2rem auto;">
        <h1 class="title is-4 has-text-white mb-5">Edit Profile</h1>
        <div v-if="!isLoggedIn" class="has-text-grey-light">
          Log in or create an account to update your profile picture and password.
        </div>
        <form v-else @submit.prevent="saveProfile">
          <div class="has-text-centered mb-4">
            <figure class="image is-128x128 is-inline-block" style="overflow:hidden; border-radius:50%;">
              <img :src="profilePicturePreview" alt="profile preview" style="width:128px; height:128px; object-fit:cover;" />
            </figure>
          </div>
          <div class="field">
            <label class="label has-text-white">Profile Picture URL</label>
            <div class="control">
              <input class="input" v-model="profilePicture" placeholder="https://..." />
            </div>
          </div>
          <div class="field">
            <button type="button" class="button is-dark is-fullwidth mb-2" @click="showPasswordField = !showPasswordField">
              <span class="icon"><i :class="showPasswordField ? 'fas fa-chevron-up' : 'fas fa-lock'"></i></span>
              <span>{{ showPasswordField ? 'Cancel Password Change' : 'Change Password' }}</span>
            </button>
            <div v-if="showPasswordField" class="control">
              <input class="input" type="password" v-model="newPassword" minlength="6" placeholder="Enter new password" autofocus />
            </div>
          </div>
          <p v-if="errorMessage" class="has-text-danger mb-3">{{ errorMessage }}</p>
          <p v-if="successMessage" class="has-text-success mb-3">{{ successMessage }}</p>
          <button class="button is-link is-fullwidth" type="submit" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : 'Save Profile' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ApiError } from '../api/http';
import { updateUser } from '../api/services';
import { currentUser } from '../pages/user';

const isLoggedIn = computed(() => !!currentUser.value);

const profilePicture = ref('');
const newPassword = ref('');
const showPasswordField = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const profilePicturePreview = computed(() =>
  profilePicture.value ||
  currentUser.value?.profilePicture ||
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60'
);

watch(
  () => currentUser.value?.id,
  () => {
    profilePicture.value = currentUser.value?.profilePicture || '';
  },
  { immediate: true }
);

async function saveProfile() {
  if (!currentUser.value) return;

  errorMessage.value = '';
  successMessage.value = '';
  isSaving.value = true;

  try {
    const response = await updateUser(currentUser.value.id, {
      profilePicture: profilePicture.value || undefined,
      password: newPassword.value || undefined
    });

    currentUser.value = response.user;
    profilePicture.value = response.user.profilePicture || '';
    newPassword.value = '';
    showPasswordField.value = false;
    successMessage.value = 'Profile updated.';
  } catch (error) {
    if (error instanceof ApiError) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Unable to update profile.';
    }
  } finally {
    isSaving.value = false;
  }
}
</script>
