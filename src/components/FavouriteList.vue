<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getLocalStorageWords } from "../composables/useFavourite";
import { useRoutePage } from "../composables/useRoutePage";
import DeleteBtn from "./DeleteBtn.vue";
import { WordData } from "../stores/WordsStore";
import Pagination from "./Pagination.vue";

const { navigateToWord } = useRoutePage();

const favouriteList = ref<WordData[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(6);
const searchQuery = ref(""); // New ref for search query

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
                        v-html="sentence.text"
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
  margin-top: 4rem;
  padding-bottom: 1.5rem;
  width: 100%;
  overflow-x: auto;
  min-width: 400px;
}

th,
td {
  padding: 10px;
  text-align: left;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.table-header-title {
  font-size: 1.5rem;
  font-weight: 500;
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
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.2);
}
</style>
