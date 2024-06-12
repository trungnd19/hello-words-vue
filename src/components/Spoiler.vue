<script setup lang="ts">
import { ref } from "vue";

const spoilerStyle = ref({
  backgroundColor: "var(--spoiler-color)",
  color: "transparent",
  userSelect: "none",
  cursor: "pointer",
});

const tooltipShown = ref(true);

function showSpoiler() {
  spoilerStyle.value = {
    backgroundColor: "transparent",
    color: "inherit",
    userSelect: "auto",
    cursor: "auto",
  };

  tooltipShown.value = false;
}
</script>

<template>
  <span
    class="spoiler"
    @click="showSpoiler"
    :title="tooltipShown ? 'Click to reveal' : ''"
  >
    <slot />
  </span>
</template>

<style scoped>
.spoiler {
  user-select: v-bind("spoilerStyle.userSelect");
  color: v-bind("spoilerStyle.color");
  background-color: v-bind("spoilerStyle.backgroundColor");
  cursor: v-bind("spoilerStyle.cursor");
  border-radius: 2px;
}
</style>
