<template>
  <section class="section has-background-black-ter" style="min-height: 100vh;">
    <div class="container">
      <div class="box has-background-dark" style="max-width: 900px; margin: 2rem auto;">
        <h1 class="title is-3 has-text-white has-text-centered">My Activity</h1>
        <form class="box has-background-black-ter" @submit.prevent="addWorkout">
          <div class="field">
            <label class="label has-text-white">Workout Type</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="selectedType" required>
                  <option disabled value="">Select workout</option>
                  <option v-for="type in workoutTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field" v-if="showReps">
            <label class="label has-text-white">Reps</label>
            <div class="control">
              <input class="input" type="number" v-model.number="reps" min="1" />
            </div>
          </div>
          <div class="field" v-if="showTime">
            <label class="label has-text-white">Time (minutes)</label>
            <div class="control">
              <input class="input" type="number" v-model.number="time" min="1" step="1" />
            </div>
          </div>
          <div class="field" v-if="showDistance">
            <label class="label has-text-white">Distance (km)</label>
            <div class="control">
              <input class="input" type="number" v-model.number="distance" min="0.01" step="0.01" />
            </div>
          </div>
          <div class="field">
            <label class="label has-text-white">Date & Time</label>
            <div class="control">
              <input class="input" type="datetime-local" v-model="dateTime" required />
            </div>
          </div>
          <div class="field is-grouped is-grouped-centered mt-4">
            <div class="control">
              <button class="button is-link" type="submit">Add Workout</button>
            </div>
          </div>
        </form>
        <h2 class="title is-4 has-text-white has-text-centered mt-5">My Workouts</h2>
        <ul>
          <li v-for="(workout, idx) in userWorkoutsSorted" :key="workout.id || idx" class="mb-4">
            <div class="box has-background-link has-text-centered">
              <strong class="has-text-white">{{ workout.type }}</strong>
              <span v-if="workout.reps" class="has-text-grey-light">&nbsp;— Reps: {{ workout.reps }}</span>
              <span v-if="workout.time" class="has-text-grey-light">&nbsp;— Time: {{ workout.time }} min</span>
              <span v-if="workout.distance" class="has-text-grey-light">&nbsp;— Distance: {{ workout.distance }} km</span>
              <span v-if="workout.dateTime" class="has-text-grey-light">&nbsp;— {{ new Date(workout.dateTime).toLocaleString() }}</span>
              <span v-if="workout.photo">
                <br>
                <figure class="image is-192x192 mt-2" style="margin:auto; width:192px; height:192px; overflow: hidden;">
                  <img :src="workout.photo" alt="workout photo" style="border-radius:10px; width:192px; height:192px; object-fit: cover; display: block;" />
                </figure>
              </span>
              <div class="buttons mt-3">
                <button class="button is-small is-info mr-2" @click="startEdit(idx)">Edit</button>
                <button class="button is-small is-danger" @click="deleteWorkout(workout)">Delete</button>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="editingIndex !== null" class="modal is-active">
          <div class="modal-background" @click="cancelEdit"></div>
          <div class="modal-content">
            <div class="box">
              <h3 class="title is-5">Edit Workout</h3>
              <form @submit.prevent="saveEdit">
                <div class="field">
                  <label class="label">Workout Type</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="editForm.type" required>
                        <option v-for="type in workoutTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Reps</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="editForm.reps" min="1" />
                  </div>
                </div>
                <div class="field">
                  <label class="label">Time (minutes)</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="editForm.time" min="1" step="1" />
                  </div>
                </div>
                <div class="field">
                  <label class="label">Distance (km)</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="editForm.distance" min="0.01" step="0.01" />
                  </div>
                </div>
                <div class="field">
                  <label class="label">Date & Time</label>
                  <div class="control">
                    <input class="input" type="datetime-local" v-model="editForm.dateTime" required />
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
          <button class="modal-close is-large" aria-label="close" @click="cancelEdit"></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { currentUser } from '../pages/user';
import workoutsData from '../utils/getWorkouts';

const workoutTypes = [
  'Push-ups',
  'Squats',
  'Plank',
  'Running',
  'Cycling',
  'Jump Rope',
  'Other'
];

const selectedType = ref('');
const reps = ref<number|null>(null);
const time = ref<number|null>(null);
const distance = ref<number|null>(null);
const dateTime = ref('');

const showReps = computed(() => ['Push-ups', 'Squats', 'Jump Rope', 'Other'].includes(selectedType.value));
const showTime = computed(() => ['Plank', 'Running', 'Cycling', 'Jump Rope'].includes(selectedType.value));
const showDistance = computed(() => ['Running', 'Cycling'].includes(selectedType.value));

const userId = computed(() => currentUser.value && (currentUser.value as any).id);

const workoutPhotos: Record<string, string> = {
  'Push-ups': 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVzaCUyMHVwfGVufDB8fDB8fHww',
  'Squats': 'https://plus.unsplash.com/premium_photo-1661906824628-3ac1f6c4ce1c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3F1YXRzfGVufDB8fDB8fHww',
  'Plank': 'https://plus.unsplash.com/premium_photo-1672352100050-65cb2ee4d818?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGxhbmt8ZW58MHx8MHx8fDA%3D',
  'Running': 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJ1bm5pbmd8ZW58MHx8MHx8fDA%3D',
  'Cycling': 'https://plus.unsplash.com/premium_photo-1713184149461-69b0abeb3daa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3ljbGluZ3xlbnwwfHwwfHx8MA%3D%3D',
  'Jump Rope': 'https://plus.unsplash.com/premium_photo-1664299555455-3e0a5542d3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8anVtcCUyMHJvcGV8ZW58MHx8MHx8fDA%3D',
  'Other': 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdvcmtvdXR8ZW58MHx8MHx8fDA%3D'
};

const allWorkouts = ref<any[]>([]);

onMounted(() => {
  allWorkouts.value = workoutsData.map(w => ({ ...w }));
});

const userWorkoutsSorted = computed(() => {
  if (!userId.value) return [];
  return allWorkouts.value
    .filter((w: any) => w.userId === userId.value)
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
});

function addWorkout() {
  if (!userId.value || !selectedType.value || !dateTime.value) return;
  const entry: any = {
    id: Date.now(),
    type: selectedType.value,
    dateTime: dateTime.value,
    userId: userId.value,
    photo: workoutPhotos[selectedType.value] || ''
  };
  if (showReps.value && reps.value) entry.reps = reps.value;
  if (showTime.value && time.value) entry.time = time.value;
  if (showDistance.value && distance.value) entry.distance = distance.value;
  allWorkouts.value.unshift(entry);
  reps.value = null;
  time.value = null;
  distance.value = null;
  selectedType.value = '';
  dateTime.value = '';
}
const editingIndex = ref<number|null>(null);
const editForm = ref<any>({});

function startEdit(idx: number) {
  editingIndex.value = idx;
  editForm.value = { ...userWorkoutsSorted.value[idx] };
}
function cancelEdit() {
  editingIndex.value = null;
  editForm.value = {};
}
function saveEdit() {
  if (editingIndex.value !== null) {
    const workout = userWorkoutsSorted.value[editingIndex.value];
    const idx = allWorkouts.value.findIndex(w => w.id === workout.id);
    if (idx !== -1) {
      allWorkouts.value[idx] = { ...editForm.value };
    }
    cancelEdit();
  }
}
function deleteWorkout(workout: any) {
  const idx = allWorkouts.value.findIndex(w => w.id === workout.id);
  if (idx !== -1) {
    allWorkouts.value.splice(idx, 1);
  }
}
</script>
