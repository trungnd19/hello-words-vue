<script setup lang="ts">
import { ref } from "vue";
import { useBackup } from "../composables/useBackup";
import { useRoutePage } from "../composables/useRoutePage";

const { exportBackup, importBackup, importError } = useBackup();
const { navigateToWord } = useRoutePage();

const fileInput = ref<HTMLInputElement | null>(null);
const exportSuccess = ref(false);

function handleExport() {
  exportBackup();
  exportSuccess.value = true;
  setTimeout(() => (exportSuccess.value = false), 3000);
}

function triggerImport() {
  fileInput.value?.click();
}

async function handleImport(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!confirm("This will overwrite your current data. Are you sure?")) {
    input.value = "";
    return;
  }

  await importBackup(file);
  input.value = "";
}
</script>

<template>
  <div class="container">
    <div class="page-header">
      <p class="page-header__title">Backup & Restore</p>
      <button @click="navigateToWord">&larr; Back to Word</button>
    </div>

    <div class="section">
      <h3>Export Backup</h3>
      <p class="description">
        Download all your data (favourites, custom datasets, streak, preferences) as a single JSON file.
      </p>
      <button class="btn-primary" @click="handleExport">
        Export Backup
      </button>
      <p v-if="exportSuccess" class="success-msg">Backup file downloaded!</p>
    </div>

    <div class="section">
      <h3>Import Backup</h3>
      <p class="description">
        Restore data from a previously exported backup file. This will overwrite your current data.
      </p>
      <button class="btn-primary" @click="triggerImport">
        Import Backup
      </button>
      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="file-input-hidden"
        @change="handleImport"
      />
      <p v-if="importError" class="error-msg">{{ importError }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.page-header button {
  background: none;
  border: 1px solid var(--border-color, #e0d8cf);
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.85rem;
}

.page-header button:hover {
  background: var(--border-color, #e0d8cf);
}

.section {
  background: var(--card-bg, var(--bg-color));
  border: 1px solid var(--border-color, #e0d8cf);
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.section h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.description {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  opacity: 0.75;
  line-height: 1.4;
}

.btn-primary {
  background: var(--accent-color, #8b6f47);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.85;
}

.file-input-hidden {
  display: none;
}

.success-msg {
  color: #2d8a4e;
  font-size: 0.8rem;
  margin: 0.5rem 0 0;
}

.error-msg {
  color: #d44;
  font-size: 0.8rem;
  margin: 0.5rem 0 0;
}
</style>
