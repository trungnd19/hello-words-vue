<template>
  <div class="header">
    <DarkModeBtn />
    <HeartBtn />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  gap: 1rem;
  justify-content: end;
}
</style>

<script setup lang="ts">
import HeartBtn from "./HeartBtn.vue";
import DarkModeBtn from "./DarkModeBtn.vue";
</script>
