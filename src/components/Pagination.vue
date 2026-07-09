<template>
  <div>
    <slot></slot>
    <div class="pagination">
      <button
        type="button"
        class="pagination__btn"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        &larr; Back
      </button>

      <span class="pagination__info">{{ currentPage }} / {{ pageCount }}</span>

      <button
        type="button"
        class="pagination__btn"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === pageCount"
      >
        Next &rarr;
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

const props = defineProps<Props>();

const itemsPerPage = props.itemsPerPage ?? 10;

const emit = defineEmits<{
  (e: "changePage", page: number): void;
}>();

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
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination__btn {
  font-size: 0.9em;
  padding: 0.5em 1em;
}

.pagination__info {
  font-size: 0.9em;
  color: var(--text-secondary);
  min-width: 3rem;
  text-align: center;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
</style>
