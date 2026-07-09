import { onMounted, onUnmounted } from "vue";
import { useRoutePage } from "./useRoutePage";
import { useTabMode } from "./useTabMode";
import { useFavourite } from "./useFavourite";
import { useWord } from "../stores/WordsStore";

function isInputFocused(): boolean {
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    (active as HTMLElement).isContentEditable
  );
}

function revealAllSpoilers() {
  const spoilers = document.querySelectorAll(
    '[class*="spoiler"]:not([class*="revealed"])'
  );
  spoilers.forEach((el) => {
    (el as HTMLElement).click();
  });
}

export function useKeyboard() {
  const { currentPage, navigateToQuiz, navigateToWord } = useRoutePage();
  const { isDefaultTab, showHelloWords } = useTabMode();
  const { toggleFavourite } = useFavourite();
  const { assignNewWord } = useWord();

  function handleKeydown(e: KeyboardEvent) {
    // Don't trigger shortcuts when typing in inputs
    if (isInputFocused()) return;

    // Escape — go back to Words page from anywhere
    if (e.key === "Escape") {
      if (isDefaultTab.value) {
        showHelloWords();
        navigateToWord();
      } else if (currentPage.value !== "words") {
        navigateToWord();
      }
      return;
    }

    // Shortcuts below only work on Words page (not default tab, not other pages)
    if (isDefaultTab.value || currentPage.value !== "words") return;

    switch (e.key) {
      case " ": // Space — reveal all spoilers
        e.preventDefault();
        revealAllSpoilers();
        break;
      case "n":
      case "N":
        assignNewWord();
        break;
      case "f":
      case "F":
        toggleFavourite();
        break;
      case "q":
      case "Q":
        navigateToQuiz();
        break;
    }
  }

  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeydown);
  });
}
