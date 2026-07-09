<script setup lang="ts">
import Words from "./Words.vue";
import FavouriteList from "./FavouriteList.vue";
import DatasetManager from "./DatasetManager.vue";
import QuizMode from "./QuizMode.vue";
import DefaultTab from "./DefaultTab.vue";
import BackupPage from "./BackupPage.vue";
import { useRoutePage } from "../composables/useRoutePage";
import { useTabMode } from "../composables/useTabMode";

const { isFavouritePage, isDatasetPage, isQuizPage, isBackupPage } = useRoutePage();
const { isDefaultTab } = useTabMode();
</script>

<template>
  <Transition name="switch" mode="out-in">
    <DefaultTab v-if="isDefaultTab" key="default-tab" />
    <div v-else-if="isQuizPage" key="quiz">
      <QuizMode />
    </div>
    <div v-else-if="isDatasetPage" key="dataset">
      <DatasetManager />
    </div>
    <div v-else-if="isBackupPage" key="backup">
      <BackupPage />
    </div>
    <div v-else-if="isFavouritePage" key="favourite">
      <FavouriteList />
    </div>
    <div v-else key="words">
      <Words />
    </div>
  </Transition>
</template>

<style scoped>
.switch-enter-from,
.switch-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.switch-enter-active,
.switch-leave-active {
  transition: all 0.35s ease;
}
</style>
