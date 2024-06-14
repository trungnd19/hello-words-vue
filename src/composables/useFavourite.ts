import { ref } from "vue";
import { WordData, useWord } from "../stores/WordsStore";

// // global state, created in module scope
const isFavourite = ref();

export function getLocalStorageWords(): WordData[] {
  return JSON.parse(localStorage.getItem("words") || "[]");
}

export function useFavourite() {
  const { currentWord } = useWord();

  function findWordInStorage() {
    const localStorageWords = getLocalStorageWords();
    return localStorageWords.find(
      (wordItem) => wordItem?.word?.text === currentWord.value?.word?.text
    );
  }

  function toggleFavourite() {
    const localStorageWords = getLocalStorageWords();

    // true => xóa khỏi local
    if (findWordInStorage()) {
      const idx = localStorageWords.findIndex(
        (item) => item.word.text === currentWord.value.word.text
      );

      localStorageWords.splice(idx, 1);
      localStorage.setItem("words", JSON.stringify(localStorageWords));
    } else {
      localStorageWords.push(currentWord.value as WordData);
      localStorage.setItem("words", JSON.stringify(localStorageWords));
    }

    isFavourite.value = !isFavourite.value;
  }

  function removeWordFromFavourite(removeWord: WordData) {
    const localStorageWords = getLocalStorageWords();

    const idx = localStorageWords.findIndex(
      (item) => item.word.text === removeWord.word.text
    );

    localStorageWords.splice(idx, 1);
    localStorage.setItem("words", JSON.stringify(localStorageWords));
  }

  function setIsFavouriteOnNewWord() {
    isFavourite.value = findWordInStorage();
  }

  return {
    findWordInStorage,
    toggleFavourite,
    isFavourite,
    setIsFavouriteOnNewWord,
    removeWordFromFavourite,
  };
}
