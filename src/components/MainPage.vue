<script setup lang="ts">
import Words from "./Words.vue";
import FavouriteList from "./FavouriteList.vue";
import { useRoutePage } from "../composables/useRoutePage";
const { isFavouritePage } = useRoutePage();
</script>

<template>
  <Words v-if="!isFavouritePage" />
  <FavouriteList v-if="isFavouritePage" />
</template>

<style scoped></style>
