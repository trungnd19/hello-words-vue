<template>
  <div class="header">
    <DarkModeBtn />
    <HeartBtn v-if="!isFavouritePage" />
    <BookmarkBtn v-if="!isFavouritePage"/>
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
import BookmarkBtn from "./BookmarkBtn.vue";
import { useRoutePage } from "../composables/useRoutePage";

const { isFavouritePage } = useRoutePage();
</script>
