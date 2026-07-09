<script setup lang="ts">
import { computed } from "vue";
import { useStreak } from "../composables/useStreak";

const { streakData } = useStreak();

const streakText = computed(() => {
  const days = streakData.value.currentStreak;
  if (days === 0) return "Start learning today!";
  if (days === 1) return "🔥 1 day streak";
  return `🔥 ${days}-day streak`;
});
</script>

<template>
  <div class="streak" :title="`Longest streak: ${streakData.longestStreak} days`">
    <span class="streak__text">{{ streakText }}</span>
  </div>
</template>

<style scoped>
.streak {
  position: fixed;
  bottom: 1.25rem;
  left: 1.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: default;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  z-index: 10;
}

.streak__text {
  white-space: nowrap;
}
</style>
