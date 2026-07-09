<template>
  <div @click="showDefaultTab" title="Switch to default new tab" class="cursor-pointer">
    <svg class="icon-btn" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useTabMode } from "../composables/useTabMode";

const { showDefaultTab } = useTabMode();
</script>
