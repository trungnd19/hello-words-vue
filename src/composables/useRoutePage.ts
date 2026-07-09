import { computed, readonly, ref } from "vue";
import { useTabMode } from "./useTabMode";

type Page = "words" | "favourite" | "dataset" | "quiz" | "backup";

export const ICON = {
  DARKMODE: "darkmode",
  BACKUP: "backup",
  DATASET: "dataset",
  FAVOURITE: "favourite",
  QUIZ: "quiz",
  DEFAULT: "default",
  DOWNLOAD_CSV: "downloadCsv",
} as const;

export type HeaderIcon = (typeof ICON)[keyof typeof ICON];

// global state, created in module scope
const currentPage = ref<Page>("words");

const isFavouritePage = computed(() => currentPage.value === "favourite");
const isDatasetPage = computed(() => currentPage.value === "dataset");
const isQuizPage = computed(() => currentPage.value === "quiz");
const isBackupPage = computed(() => currentPage.value === "backup");

export function useRoutePage() {
  const { isDefaultTab } = useTabMode();

  const inlineIcons = computed<HeaderIcon[]>(() => {
    if (isDefaultTab.value) return [];
    switch (currentPage.value) {
      case "words":
        return [ICON.FAVOURITE, ICON.QUIZ, ICON.DEFAULT];
      case "quiz":
        return [ICON.DEFAULT];
      case "dataset":
        return [];
      case "backup":
        return [];
      case "favourite":
        return [ICON.DOWNLOAD_CSV, ICON.DEFAULT];
      default:
        return [];
    }
  });

  const dropdownIcons = computed<HeaderIcon[]>(() => {
    if (isDefaultTab.value) return [ICON.DARKMODE, ICON.BACKUP, ICON.DATASET];
    switch (currentPage.value) {
      case "words":
        return [ICON.DARKMODE, ICON.BACKUP, ICON.DATASET];
      case "quiz":
        return [ICON.DARKMODE, ICON.BACKUP, ICON.DATASET];
      case "dataset":
        return [ICON.DARKMODE, ICON.DEFAULT, ICON.BACKUP];
      case "backup":
        return [ICON.DARKMODE, ICON.DEFAULT, ICON.DATASET];
      case "favourite":
        return [ICON.DARKMODE, ICON.BACKUP, ICON.DATASET];
      default:
        return [ICON.DARKMODE, ICON.BACKUP, ICON.DATASET];
    }
  });

  function navigateToFavouriteList() {
    currentPage.value = "favourite";
  }

  function navigateToWord() {
    currentPage.value = "words";
  }

  function navigateToDatasetManager() {
    currentPage.value = "dataset";
  }

  function navigateToQuiz() {
    currentPage.value = "quiz";
  }

  function navigateToBackup() {
    currentPage.value = "backup";
  }

  return {
    currentPage: readonly(currentPage),
    isFavouritePage,
    isDatasetPage,
    isQuizPage,
    isBackupPage,
    inlineIcons,
    dropdownIcons,
    navigateToFavouriteList,
    navigateToWord,
    navigateToDatasetManager,
    navigateToQuiz,
    navigateToBackup,
  };
}