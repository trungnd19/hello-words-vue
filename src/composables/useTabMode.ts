import { ref } from "vue";

const isDefaultTab = ref(false);

export function useTabMode() {
  function showDefaultTab() {
    isDefaultTab.value = true;
  }

  function showHelloWords() {
    isDefaultTab.value = false;
  }

  return {
    isDefaultTab,
    showDefaultTab,
    showHelloWords,
  };
}
