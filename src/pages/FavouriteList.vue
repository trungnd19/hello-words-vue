<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getLocalStorageWords } from "../composables/useFavourite";
import { useRoutePage } from "../composables/useRoutePage";
import DeleteBtn from "../components/DeleteBtn.vue";
import { WordData } from "../stores/WordsStore";
import Pagination from "../components/Pagination.vue";
import { sanitizeHtml } from "../utils/sanitize";

const { navigateToWord } = useRoutePage();

const favouriteList = ref<WordData[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(6);
const searchQuery = ref("");

function checkLocalStorageList() {
  favouriteList.value = getLocalStorageWords();
}

const filteredItems = computed(() => {
  return favouriteList.value.filter(
    (item) =>
      item.word.text.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.word.transliterations
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      item.word.meaning.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

checkLocalStorageList();

const displayedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;

  return filteredItems.value.slice(startIndex, endIndex);
});

function changePage(pageNumber: number) {
  currentPage.value = pageNumber;
}

watch(displayedItems, () => {
  if (
    !displayedItems.value?.length &&
    favouriteList.value.length &&
    currentPage.value !== 1
  ) {
    currentPage.value--;
  }
});
</script>

<template>
  <div class="container">
    <div class="table-header">
      <p class="table-header-title">Learning list</p>
      <button class="action-btn" @click="navigateToWord">
        &larr; Back to Word
      </button>
    </div>

    <div class="search-container" v-if="favouriteList.length">
      <input
        v-model.trim="searchQuery"
        type="text"
        placeholder="Search for a word..."
        class="search-input"
        aria-label="Search words"
      />
    </div>

    <template v-if="filteredItems.length">
      <Pagination
        :itemCount="filteredItems.length"
        :itemsPerPage="itemsPerPage"
        :currentPage="currentPage"
        @changePage="changePage"
      >
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Yomikata</th>
              <th class="meaning-col">Meaning</th>
              <th class="examples-col">Examples</th>
              <th class="action-col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in displayedItems" :key="item.word.text">
              <td class="japanese-font">{{ item.word.text }}</td>
              <td class="japanese-font">{{ item.word.transliterations }}</td>
              <td>{{ item.word.meaning }}</td>
              <td>
                <ul>
                  <li
                    v-for="(sentence, i) in item.sentences"
                    :key="sentence.text"
                  >
                    <div>
                      <div
                        class="sentence__text japanese-font"
                        v-html="sanitizeHtml(sentence.text)"
                      ></div>
                      <div class="sentence__meaning">
                        {{ sentence.meaning }}
                      </div>
                    </div>
                  </li>
                </ul>
              </td>
              <td class="delete-cell">
                <DeleteBtn
                  :selectedWord="item"
                  @deleteWord="checkLocalStorageList"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Pagination>
    </template>

    <div v-else>No word found!</div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 3rem;
  padding-bottom: 1.5rem;
  overflow-x: auto;
  width: 70vw;
}

@media screen and (max-width: 600px) {
  .container {
    min-width: 400px;
  }
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--card-bg);
  box-shadow: var(--shadow);
}

th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background-color: var(--background-color);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.table-header-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--word-color);
}

.delete-cell {
  text-align: center;
}

.action-col {
  width: 5%;
}

.meaning-col {
  width: 20%;
}

.examples-col {
  width: 40%;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input {
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  width: 100%;
  max-width: 320px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-bg);
  color: var(--text-color);
  box-shadow: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: var(--accent-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.1);
}

.search-input::placeholder {
  color: var(--text-secondary);
}
</style>
