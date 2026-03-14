<script setup lang="ts">
import { ref } from "vue"

// Example reactive state for the home page
const welcomeMessage = ref("Welcome to Exercise Hub")

// Example async action (same pattern as your store)
const loadHomeData = async () => {
  try {
    // placeholder for future API call
  } catch (err) {
    console.error(err)
  }
}
</script>