<script setup lang="ts">
import { ref } from "vue";

const exercise = ref("");
const reps = ref<number | null>(null);

const workouts = ref<{ exercise: string; reps: number }[]>([]);

function addWorkout() {
  if (!exercise.value || !reps.value) return;

  workouts.value.push({
    exercise: exercise.value,
    reps: reps.value
  });

  exercise.value = "";
  reps.value = null;
}
</script>