function addWorkout() {
  const exercise = document.getElementById("exerciseInput").value;
  const reps = document.getElementById("repsInput").value;

  if (!exercise || !reps) return;

  const list = document.getElementById("workoutList");
  const item = document.createElement("li");
  item.textContent = `${exercise} — ${reps} reps`;

  list.appendChild(item);

  document.getElementById("exerciseInput").value = "";
  document.getElementById("repsInput").value = "";
  
}