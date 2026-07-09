<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useCustomDataset, BUILTIN_DATASETS } from "../composables/useCustomDataset";
import { useRoutePage } from "../composables/useRoutePage";

const { datasets, activeDataset, switchDataset, removeDataset, importJSON, importCSV, importQuizlet } = useCustomDataset();

const builtinInfo: Record<string, { name: string; description: string }> = {
  advanced: { name: "Advanced", description: "Advanced Japanese vocabulary (iKnow.jp)" },
  intermediate: { name: "Intermediate", description: "Intermediate Japanese vocabulary (iKnow.jp)" },
};
const { navigateToWord } = useRoutePage();

const fileInput = ref<HTMLInputElement | null>(null);
const importError = ref("");
const importSuccess = ref("");
const showQuizletImport = ref(false);
const quizletText = ref("");
const quizletName = ref("");

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleFileImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  importError.value = "";
  importSuccess.value = "";

  let result: { success: boolean; error?: string };

  if (file.name.endsWith(".json")) {
    result = await importJSON(file);
  } else if (file.name.endsWith(".csv")) {
    result = await importCSV(file);
  } else {
    importError.value = "Please select a .json or .csv file.";
    input.value = "";
    return;
  }

  if (result.success) {
    importSuccess.value = `Successfully imported "${file.name}"!`;
  } else {
    importError.value = result.error || "Import failed.";
  }

  input.value = "";
}

function handleSwitch(datasetId: string) {
  switchDataset(datasetId);
}

function handleRemove(datasetId: string) {
  if (confirm("Are you sure you want to delete this dataset?")) {
    removeDataset(datasetId);
  }
}

function handleQuizletImport() {
  importError.value = "";
  importSuccess.value = "";

  if (!quizletText.value.trim()) {
    importError.value = "Please paste your Quizlet export text.";
    return;
  }

  const name = quizletName.value.trim() || "Quizlet Import";
  const result = importQuizlet(quizletText.value, name);

  if (result.success) {
    importSuccess.value = `Successfully imported "${name}"!`;
    quizletText.value = "";
    quizletName.value = "";
    showQuizletImport.value = false;
  } else {
    importError.value = result.error || "Import failed.";
  }
}

function insertTab(event: KeyboardEvent) {
  const textarea = event.target as HTMLTextAreaElement;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  quizletText.value = quizletText.value.substring(0, start) + "\t" + quizletText.value.substring(end);
  nextTick(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 1;
  });
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div class="container">
    <div class="page-header">
      <p class="page-header__title">Dataset Manager</p>
      <button @click="navigateToWord">&larr; Back to Word</button>
    </div>

    <div class="import-section">
      <button class="btn-primary" @click="triggerFileInput">
        Import File
      </button>
      <button @click="showQuizletImport = !showQuizletImport">
        Import from Quizlet
      </button>
      <span class="import-hint">JSON, CSV, or Quizlet export</span>
      <input
        ref="fileInput"
        type="file"
        accept=".json,.csv"
        class="file-input-hidden"
        aria-label="Import dataset file"
        @change="handleFileImport"
      />
    </div>

    <div v-if="showQuizletImport" class="quizlet-section">
      <input
        v-model="quizletName"
        type="text"
        class="quizlet-name"
        placeholder="Dataset name (optional)"
        aria-label="Dataset name"
      />
      <textarea
        v-model="quizletText"
        class="quizlet-textarea"
        placeholder="Paste Quizlet export here (tab-separated, one card per line)..."
        aria-label="Quizlet export text"
        rows="6"
        @keydown.tab.prevent="insertTab"
      ></textarea>
      <button class="btn-primary" @click="handleQuizletImport">Import</button>
    </div>

    <div class="format-help">
      <details>
        <summary>Format guide & sample files</summary>
        <div class="format-help__content">
          <div class="format-help__section">
            <p class="format-help__heading">CSV Format</p>
            <p>Columns: <code>word</code>, <code>reading</code>, <code>part_of_speech</code>, <code>meaning</code>, <code>example_text</code>, <code>example_reading</code>, <code>example_meaning</code></p>
            <p>Multiple examples for the same word → use multiple rows with the same <code>word</code> value.</p>
            <a href="/sample_dataset.csv" download class="sample-download">
              ⬇ Download sample CSV
            </a>
          </div>
          <div class="format-help__section">
            <p class="format-help__heading">JSON Format</p>
            <p>An array of objects, each with <code>word</code> (text, transliterations, part_of_speech, meaning, sound) and <code>sentences</code> array (text, transliterations, meaning, sound).</p>
            <a href="/sample_dataset.json" download class="sample-download">
              ⬇ Download sample JSON
            </a>
          </div>
        </div>
      </details>
    </div>

    <p v-if="importError" class="message message--error">{{ importError }}</p>
    <p v-if="importSuccess" class="message message--success">{{ importSuccess }}</p>

    <div class="datasets">
      <div
        v-for="builtinId in BUILTIN_DATASETS"
        :key="builtinId"
        class="dataset-card"
        :class="{ 'dataset-card--active': activeDataset === builtinId }"
      >
        <div class="dataset-card__info">
          <p class="dataset-card__name">{{ builtinInfo[builtinId].name }} (Built-in)</p>
          <p class="dataset-card__meta">{{ builtinInfo[builtinId].description }}</p>
        </div>
        <div class="dataset-card__actions">
          <button
            v-if="activeDataset !== builtinId"
            @click="handleSwitch(builtinId)"
          >
            Activate
          </button>
          <span v-else class="badge">Active</span>
        </div>
      </div>

      <div
        v-for="dataset in datasets"
        :key="dataset.id"
        class="dataset-card"
        :class="{ 'dataset-card--active': activeDataset === dataset.id }"
      >
        <div class="dataset-card__info">
          <p class="dataset-card__name">{{ dataset.name }}</p>
          <p class="dataset-card__meta">
            {{ dataset.wordCount }} words · Imported {{ formatDate(dataset.createdAt) }}
          </p>
        </div>
        <div class="dataset-card__actions">
          <button
            v-if="activeDataset !== dataset.id"
            @click="handleSwitch(dataset.id)"
          >
            Activate
          </button>
          <span v-else class="badge">Active</span>
          <button class="btn-danger" @click="handleRemove(dataset.id)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 3rem;
  padding-bottom: 1.5rem;
  width: calc(100vw - 80px);
  max-width: 720px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--word-color);
  margin: 0;
}

.import-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.quizlet-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--card-bg);
}

.quizlet-name {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: inherit;
  max-width: 300px;
}

.quizlet-textarea {
  padding: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
}

.quizlet-textarea:focus,
.quizlet-name:focus {
  border-color: var(--accent-color);
  outline: none;
}

.import-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.file-input-hidden {
  display: none;
}

.message {
  font-size: 0.9rem;
  padding: 0.5rem 0;
  margin: 0 0 1rem;
}

.message--error {
  color: #c53030;
}

.message--success {
  color: #2f855a;
}

.datasets {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.dataset-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--card-bg);
  transition: box-shadow 0.2s ease;
}

.dataset-card:hover {
  box-shadow: var(--shadow);
}

.dataset-card--active {
  border-color: var(--accent-color);
}

.dataset-card__info {
  flex: 1;
}

.dataset-card__name {
  margin: 0;
  font-weight: 500;
  color: var(--word-color);
}

.dataset-card__meta {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.dataset-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.25em 0.7em;
  background-color: var(--accent-color);
  color: #fff;
  border-radius: 20px;
}

.btn-danger {
  color: #c53030;
  border-color: #c53030;
  background: transparent;
}

.btn-danger:hover {
  background-color: #c53030;
  color: #fff;
}

.format-help {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.format-help summary {
  cursor: pointer;
  color: var(--accent-color);
}

.format-help code {
  background-color: var(--background-color);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
}

.format-help__content {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.format-help__section {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-bg);
}

.format-help__heading {
  margin: 0 0 0.4rem;
  font-weight: 600;
  color: var(--word-color);
  font-size: 0.9rem;
}

.sample-download {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.82rem;
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.sample-download:hover {
  background-color: var(--accent-color);
  color: #fff;
}

@media screen and (max-width: 600px) {
  .container {
    width: calc(100vw - 32px);
  }

  .dataset-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .dataset-card__actions {
    align-self: flex-end;
  }
}
</style>
