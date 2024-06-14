<script setup lang="ts">
import { ref } from "vue";
import { getLocalStorageWords } from "../composables/useFavourite";
import { useRoutePage } from "../composables/useRoutePage";
import DeleteBtn from "./DeleteBtn.vue";
import { WordData } from "../stores/WordsStore";

const { navigateToWord } = useRoutePage();

const favouriteList = ref<WordData[]>([]);

function checkLocalStorageList() {
  favouriteList.value = getLocalStorageWords();
}

checkLocalStorageList();
</script>

<template>
  <div class="container">
    <div class="table-header">
      <p class="table-header-title">Learning list</p>
      <button class="action-btn" @click="navigateToWord">
        &larr; Back to Word
      </button>
    </div>

    <template v-if="favouriteList.length">
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
          <tr v-for="(item, index) in favouriteList" :key="item.word.text">
            <td>{{ item.word.text }}</td>
            <td>{{ item.word.transliterations }}</td>
            <td>{{ item.word.meaning }}</td>
            <td>
              <ul>
                <li
                  v-for="(sentence, i) in item.sentences"
                  :key="sentence.text"
                >
                  <div>
                    <div class="sentence__text" v-html="sentence.text"></div>
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
    </template>

    <div v-else>No word added yet!</div>
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
</style>
