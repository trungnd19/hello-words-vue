<script setup lang="ts">
import { computed } from "vue";
import { useDark } from "../stores/useDark";
import { useTabMode } from "../composables/useTabMode";
import { PICSUM_BACKGROUND_URL } from "../constants/api";

const { darkMode } = useDark();
const { isDefaultTab } = useTabMode();

const backgroundUrl = `${PICSUM_BACKGROUND_URL}?blur=2&random=${Date.now()}`;
const show = computed(() => !darkMode.value && isDefaultTab.value);
</script>

<template>
  <div v-if="show" class="bg-overlay" :style="{ backgroundImage: `url(${backgroundUrl})` }"></div>
</template>

<style scoped>
.bg-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.35;
  pointer-events: none;
  filter: brightness(0.5);
}
</style>
