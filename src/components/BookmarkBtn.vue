<template>
  <div @click="navigateToFavouriteList" title="Click to view learning words">
    <svg
      class="icon-btn"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      width="1.2em"
      height="1.2em"
    >
      <path
        fill="currentColor"
        d="m19 18l2 1V3c0-1.1-.9-2-2-2H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13zM15 5H5c-1.1 0-2 .9-2 2v16l7-3l7 3V7c0-1.1-.9-2-2-2z"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useRoutePage } from "../composables/useRoutePage";

const { navigateToFavouriteList } = useRoutePage();
</script>
