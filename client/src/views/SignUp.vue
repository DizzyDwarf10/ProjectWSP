<template>
  <section class="section">
    <div class="container">
      <div class="box has-background-link has-text-white" style="max-width: 500px; margin: 2rem auto;">
        <h1 class="title is-3 has-text-white has-text-centered">Sign Up</h1>
        <form @submit.prevent="submit">
          <div class="field">
            <label class="label has-text-white">Name</label>
            <div class="control">
              <input class="input" v-model="name" required />
            </div>
          </div>
          <div class="field">
            <label class="label has-text-white">Password</label>
            <div class="control">
              <input class="input" type="password" v-model="password" minlength="6" required />
            </div>
          </div>
          <div class="field">
            <label class="label has-text-white">Profile Picture URL (optional)</label>
            <div class="control">
              <input class="input" v-model="profilePicture" />
            </div>
          </div>
          <p v-if="errorMessage" class="has-text-danger mb-3">{{ errorMessage }}</p>
          <div class="field is-grouped is-justify-content-flex-end">
            <div class="control">
              <button class="button is-dark" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ApiError } from '../api/http';
import { registerUser } from '../pages/user';

const router = useRouter();
const name = ref('');
const password = ref('');
const profilePicture = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

async function submit() {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    await registerUser(name.value, password.value, profilePicture.value || undefined);
    router.push('/HomePage');
  } catch (error) {
    if (error instanceof ApiError) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Unable to create account';
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>