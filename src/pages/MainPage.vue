<script setup lang="ts">
import Words from "./Words.vue";
import FavouriteList from "./FavouriteList.vue";
import { useRoutePage } from "../composables/useRoutePage";
const { isFavouritePage } = useRoutePage();
</script>

<template>
  <Transition name="switch" mode="out-in">
    <div v-if="isFavouritePage">
      <FavouriteList v-if="isFavouritePage" />
    </div>
    <div v-else>
      <Words />
    </div>
  </Transition>
</template>

<style scoped>
.switch-enter-from,
.switch-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.switch-enter-active,
.switch-leave-active {
  transition: all 0.5s ease;
}
</style>
