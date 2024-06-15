<template>
  <div>
    <slot></slot>
    <div>
      <button
        type="button"
        :class="['button--link', 'button--large']"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        Back
      </button>

      <span>{{ currentPage }} / {{ pageCount }}</span>

      <button
        type="button"
        :class="['button--link', 'button--large']"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === pageCount"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Define prop types
interface Props {
  itemCount: number;
  itemsPerPage?: number;
  currentPage: number;
}

// Define props with type inference
const props = defineProps<Props>();

// Default props value
const itemsPerPage = props.itemsPerPage ?? 10;

// Define emits with type inference
const emit = defineEmits<{
  (e: "changePage", page: number): void;
}>();

// Compute the total number of pages
const pageCount = computed(() => Math.ceil(props.itemCount / itemsPerPage));

// Generate an array of pages
// const pages = computed(() =>
//   Array.from({ length: pageCount.value }, (_, i) => i + 1)
// );

// Function to handle page change
const changePage = (page: number) => {
  emit("changePage", page);
};
</script>

<style scoped>
.button--link {
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 5px;
  margin: 0 5px;
  color: var(--text-color);
}

.button--large {
  font-size: 1.2em;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
