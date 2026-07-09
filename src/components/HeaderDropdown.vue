<template>
  <div class="dropdown" ref="dropdownRef">
    <div @click="toggleOpen" title="More options" class="dropdown-trigger">
      <svg class="icon-btn" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
        />
      </svg>
    </div>

    <div v-if="isOpen" class="dropdown-menu">
      <div
        v-for="icon in dropdownIcons"
        :key="icon"
        class="dropdown-item"
        @click="handleClick(icon)"
      >
        <!-- Darkmode -->
        <template v-if="icon === ICON.DARKMODE">
          <svg v-if="darkMode" class="dropdown-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"/>
          </svg>
          <svg v-else class="dropdown-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
          </svg>
        </template>
        <!-- Backup -->
        <svg v-else-if="icon === ICON.BACKUP" class="dropdown-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
        </svg>
        <!-- Dataset -->
        <svg v-else-if="icon === ICON.DATASET" class="dropdown-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/>
        </svg>
        <!-- Favourite -->
        <svg v-else-if="icon === ICON.FAVOURITE" class="dropdown-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="m19 18l2 1V3c0-1.1-.9-2-2-2H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13zM15 5H5c-1.1 0-2 .9-2 2v16l7-3l7 3V7c0-1.1-.9-2-2-2z"/>
        </svg>
        <!-- Quiz -->
        <svg v-else-if="icon === ICON.QUIZ" class="dropdown-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
        <!-- Default tab -->
        <svg v-else-if="icon === ICON.DEFAULT" class="dropdown-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z"/>
        </svg>
        <!-- Download CSV -->
        <svg v-else-if="icon === ICON.DOWNLOAD_CSV" class="dropdown-icon" viewBox="0 0 512 512">
          <path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
        </svg>

        <span>{{ iconLabels[icon] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoutePage, ICON, type HeaderIcon } from "../composables/useRoutePage";
import { useTabMode } from "../composables/useTabMode";
import { useClickOutside } from "../composables/useClickOutside";
import { useDark } from "../stores/useDark";
import { useDownloadCSV } from "../composables/useDownloadCSV";

const { dropdownIcons, navigateToBackup, navigateToDatasetManager, navigateToFavouriteList, navigateToQuiz } = useRoutePage();
const { showDefaultTab, showHelloWords } = useTabMode();
const { darkMode, toggleDarkMode } = useDark();
const { downloadCSV } = useDownloadCSV();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

useClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

const iconLabels: Record<HeaderIcon, string> = {
  [ICON.DARKMODE]: "Dark mode",
  [ICON.BACKUP]: "Backup & Restore",
  [ICON.DATASET]: "Datasets",
  [ICON.FAVOURITE]: "Favourites",
  [ICON.QUIZ]: "Quiz",
  [ICON.DEFAULT]: "Default tab",
  [ICON.DOWNLOAD_CSV]: "Download CSV",
};

function handleClick(icon: HeaderIcon) {
  switch (icon) {
    case ICON.DARKMODE:
      toggleDarkMode();
      break;
    case ICON.BACKUP:
      showHelloWords();
      navigateToBackup();
      break;
    case ICON.DATASET:
      showHelloWords();
      navigateToDatasetManager();
      break;
    case ICON.FAVOURITE:
      showHelloWords();
      navigateToFavouriteList();
      break;
    case ICON.QUIZ:
      showHelloWords();
      navigateToQuiz();
      break;
    case ICON.DEFAULT:
      showDefaultTab();
      break;
    case ICON.DOWNLOAD_CSV:
      downloadCSV();
      break;
  }
  isOpen.value = false;
}
</script>

<style scoped>
.dropdown {
  position: relative;
  display: flex;
  align-items: center;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-hover);
  min-width: 160px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-color);
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: var(--background-color);
}

.dropdown-icon {
  width: 1rem;
  height: 1rem;
  fill: var(--text-color);
  flex-shrink: 0;
}
</style>
