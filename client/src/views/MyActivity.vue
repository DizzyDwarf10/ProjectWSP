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
                <select v-model.number="selectedTypeId" required>
                  <option :value="null" disabled>Select workout</option>
                  <option v-for="type in workoutTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                </select>
              </div>
            </div>
          </div>
          <p v-if="errorMessage" class="has-text-danger mb-2">{{ errorMessage }}</p>
          <div class="field" v-if="showReps">
            <label class="label has-text-white">Reps</label>
            <div class="control">
              <input class="input" type="number" v-model.number="reps" min="1" />
            </div>
          </div>
          <div class="field" v-if="showTime">
            <label class="label has-text-white">Time (minutes)</label>
            <div class="control">
              <input class="input" type="number" v-model.number="minutes" min="1" step="1" />
            </div>
          </div>
          <div class="field" v-if="showDistance">
            <label class="label has-text-white">Distance (km)</label>
            <div class="control">
              <input class="input" type="number" v-model.number="distanceKm" min="0.01" step="0.01" />
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
          <li v-for="workout in userWorkoutsSorted" :key="workout.id" class="mb-4">
            <div class="box has-background-link has-text-centered">
              <strong class="has-text-white">{{ workout.exerciseTypeName }}</strong>
              <span v-if="workout.reps" class="has-text-grey-light">&nbsp;— Reps: {{ workout.reps }}</span>
              <span v-if="workout.minutes" class="has-text-grey-light">&nbsp;— Time: {{ workout.minutes }} min</span>
              <span v-if="workout.distanceKm" class="has-text-grey-light">&nbsp;— Distance: {{ workout.distanceKm }} km</span>
              <span v-if="workout.performedAt" class="has-text-grey-light">&nbsp;— {{ new Date(workout.performedAt).toLocaleString() }}</span>
              <span v-if="workout.photoUrl">
                <br>
                <figure class="image is-192x192 mt-2" style="margin:auto; width:192px; height:192px; overflow: hidden;">
                  <img :src="workout.photoUrl" alt="workout photo" style="border-radius:10px; width:192px; height:192px; object-fit: cover; display: block;" />
                </figure>
              </span>
              <div class="buttons mt-3">
                <button class="button is-small is-info mr-2" @click="startEdit(workout)">Edit</button>
                <button class="button is-small is-danger" @click="deleteWorkout(workout)">Delete</button>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="editingActivityId !== null" class="modal is-active">
          <div class="modal-background" @click="cancelEdit"></div>
          <div class="modal-content">
            <div class="box">
              <h3 class="title is-5">Edit Workout</h3>
              <form @submit.prevent="saveEdit">
                <div class="field">
                  <label class="label">Workout Type</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model.number="editForm.exerciseTypeId" required>
                        <option v-for="type in workoutTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="field" v-if="showEditReps">
                  <label class="label">Reps</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="editForm.reps" min="1" />
                  </div>
                </div>
                <div class="field" v-if="showEditTime">
                  <label class="label">Time (minutes)</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="editForm.minutes" min="1" step="1" />
                  </div>
                </div>
                <div class="field" v-if="showEditDistance">
                  <label class="label">Distance (km)</label>
                  <div class="control">
                    <input class="input" type="number" v-model.number="editForm.distanceKm" min="0.01" step="0.01" />
                  </div>
                </div>
                <div class="field">
                  <label class="label">Date & Time</label>
                  <div class="control">
                    <input class="input" type="datetime-local" v-model="editForm.performedAt" required />
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
import { computed, onMounted, ref, watch } from 'vue';
import {
  createActivity,
  deleteActivity,
  listExerciseTypes,
  listMyActivities,
  updateActivity,
  type Activity,
  type ExerciseType
} from '../api/services';
import { currentUser } from '../pages/user';

type UiWorkout = {
  id: number;
  exerciseTypeId: number;
  exerciseTypeName: string;
  reps: number | null;
  minutes: number | null;
  distanceKm: number | null;
  performedAt: string;
  photoUrl?: string;
};

type EditForm = {
  exerciseTypeId: number | null;
  reps: number | null;
  minutes: number | null;
  distanceKm: number | null;
  performedAt: string;
};

const workoutTypes = ref<ExerciseType[]>([]);
const selectedTypeId = ref<number | null>(null);
const reps = ref<number | null>(null);
const minutes = ref<number | null>(null);
const distanceKm = ref<number | null>(null);
const dateTime = ref('');
const errorMessage = ref('');
const allWorkouts = ref<UiWorkout[]>([]);
const editingActivityId = ref<number | null>(null);
const editForm = ref<EditForm>(createEmptyEditForm());

function createEmptyEditForm(): EditForm {
  return {
    exerciseTypeId: null,
    reps: null,
    minutes: null,
    distanceKm: null,
    performedAt: ''
  };
}

function metricModeSupports(metricMode: ExerciseType['metricMode'] | undefined, metric: 'reps' | 'minutes' | 'distance') {
  if (!metricMode || metricMode === 'mixed') {
    return true;
  }

  const supportedModes = {
    reps: new Set<ExerciseType['metricMode']>(['reps', 'reps_minutes']),
    minutes: new Set<ExerciseType['metricMode']>(['minutes', 'reps_minutes', 'distance_minutes']),
    distance: new Set<ExerciseType['metricMode']>(['distance', 'distance_minutes'])
  };

  return supportedModes[metric].has(metricMode);
}

function activityToUi(activity: Activity): UiWorkout {
  return {
    id: activity.id,
    exerciseTypeId: activity.exerciseTypeId,
    exerciseTypeName: activity.exerciseTypeName,
    reps: activity.reps ?? null,
    minutes: activity.minutes ?? null,
    distanceKm: activity.distanceKm ?? null,
    performedAt: activity.performedAt,
    photoUrl: activity.photoUrl || undefined
  };
}

async function refreshWorkouts() {
  if (!currentUser.value) {
    workoutTypes.value = [];
    allWorkouts.value = [];
    return;
  }

  const [exerciseTypesResponse, activitiesResponse] = await Promise.all([
    listExerciseTypes(),
    listMyActivities()
  ]);

  workoutTypes.value = exerciseTypesResponse.exerciseTypes;
  allWorkouts.value = activitiesResponse.activities.map(activityToUi);
}

const selectedType = computed(() =>
  workoutTypes.value.find((type) => type.id === selectedTypeId.value) || null
);
const editType = computed(() =>
  workoutTypes.value.find((type) => type.id === editForm.value.exerciseTypeId) || null
);

const showReps = computed(() => metricModeSupports(selectedType.value?.metricMode, 'reps'));
const showTime = computed(() => metricModeSupports(selectedType.value?.metricMode, 'minutes'));
const showDistance = computed(() => metricModeSupports(selectedType.value?.metricMode, 'distance'));
const showEditReps = computed(() => metricModeSupports(editType.value?.metricMode, 'reps'));
const showEditTime = computed(() => metricModeSupports(editType.value?.metricMode, 'minutes'));
const showEditDistance = computed(() => metricModeSupports(editType.value?.metricMode, 'distance'));
const userWorkoutsSorted = computed(() =>
  [...allWorkouts.value].sort((left, right) => new Date(right.performedAt).getTime() - new Date(left.performedAt).getTime())
);

function addWorkout() {
  void (async () => {
    if (!currentUser.value || !selectedTypeId.value || !dateTime.value) {
      return;
    }

    errorMessage.value = '';
    const response = await createActivity({
      exerciseTypeId: selectedTypeId.value,
      reps: showReps.value ? reps.value : null,
      minutes: showTime.value ? minutes.value : null,
      distanceKm: showDistance.value ? distanceKm.value : null,
      performedAt: dateTime.value
    });

    allWorkouts.value.unshift(activityToUi(response.activity));
    selectedTypeId.value = null;
    reps.value = null;
    minutes.value = null;
    distanceKm.value = null;
    dateTime.value = '';
  })();
}

function startEdit(workout: UiWorkout) {
  editingActivityId.value = workout.id;
  editForm.value = {
    exerciseTypeId: workout.exerciseTypeId,
    reps: workout.reps,
    minutes: workout.minutes,
    distanceKm: workout.distanceKm,
    performedAt: workout.performedAt.slice(0, 16)
  };
}

function cancelEdit() {
  editingActivityId.value = null;
  editForm.value = createEmptyEditForm();
}

function saveEdit() {
  void (async () => {
    if (!editingActivityId.value || !editForm.value.exerciseTypeId) {
      return;
    }

    errorMessage.value = '';
    const response = await updateActivity(editingActivityId.value, {
      exerciseTypeId: editForm.value.exerciseTypeId,
      reps: showEditReps.value ? editForm.value.reps : null,
      minutes: showEditTime.value ? editForm.value.minutes : null,
      distanceKm: showEditDistance.value ? editForm.value.distanceKm : null,
      performedAt: editForm.value.performedAt
    });

    const index = allWorkouts.value.findIndex((item) => item.id === editingActivityId.value);
    if (index !== -1) {
      allWorkouts.value[index] = activityToUi(response.activity);
    }

    cancelEdit();
  })();
}

function deleteWorkout(workout: UiWorkout) {
  void (async () => {
    await deleteActivity(workout.id);
    allWorkouts.value = allWorkouts.value.filter((item) => item.id !== workout.id);
  })();
}

onMounted(() => {
  void refreshWorkouts();
});

watch(
  () => currentUser.value?.id,
  () => {
    void refreshWorkouts();
  }
);
</script>
