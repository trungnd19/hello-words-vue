<template>
  <div @click="navigateToDatasetManager" title="Manage word datasets" class="cursor-pointer">
    <svg class="icon-btn" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useRoutePage } from "../composables/useRoutePage";

const { navigateToDatasetManager } = useRoutePage();
</script>
