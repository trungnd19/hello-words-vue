<template>
  <div class="header">
    <DownloadCSV v-if="inlineIcons.includes(ICON.DOWNLOAD_CSV)" />
    <BookmarkBtn v-if="inlineIcons.includes(ICON.FAVOURITE)" />
    <QuizBtn v-if="inlineIcons.includes(ICON.QUIZ)" />
    <TabModeBtn v-if="inlineIcons.includes(ICON.DEFAULT)" />
    <HeaderDropdown />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  gap: 0.75rem;
  justify-content: end;
  align-items: center;
}

.header :deep(> *) {
  display: flex;
  align-items: center;
}
</style>

<script setup lang="ts">
import BookmarkBtn from "./BookmarkBtn.vue";
import TabModeBtn from "./TabModeBtn.vue";
import QuizBtn from "./QuizBtn.vue";
import HeaderDropdown from "./HeaderDropdown.vue";
import DownloadCSV from "./DownloadCSV.vue";

import { useRoutePage, ICON } from "../composables/useRoutePage";

const { inlineIcons } = useRoutePage();
</script>
