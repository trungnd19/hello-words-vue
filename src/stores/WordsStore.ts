import { readonly, ref } from "vue";
import { useFavourite } from "../composables/useFavourite";

export interface Word {
  text: string;
  transliterations: string;
  part_of_speech: string;
  meaning: string;
  sound: string;
}

export interface Sentence extends Omit<Word, "part_of_speech"> {}

export interface WordData {
  word: Word;
  sentences: Sentence[];
}

// global state, created in module scope
const currentWord = ref<WordData>({
  word: {
    text: "有力",
    transliterations: "ゆうりょく",
    part_of_speech: "Adjectival Noun",
    meaning: "powerful, influential",
    sound: "https://assets1.iknow.jp/assets/legacy/JLL/audio/Int/JW00769A.mp3",
  },
  sentences: [
    {
      text: "あの都市はオリンピックの有力な候補地です。",
      transliterations:
        "あの とし は オリンピック の ゆうりょくな こうほ ち です。",
      meaning: "That city is a strong candidate to host the Olympics.",
      sound:
        "https://assets3.iknow.jp/assets/legacy/JLL/audio/Int/JS00769A.mp3",
    },
  ],
});

const TOTAL_DATA_FILES = 10;

function getRandomIndex(arrayLength: number) {
  return Math.floor(Math.random() * arrayLength);
}

function getRandom() {
  return Math.floor(Math.random() * TOTAL_DATA_FILES) + 1;
}

const { setIsFavouriteOnNewWord } = useFavourite();

export function useWord() {
  async function getDataSource() {
    try {
      const response = await fetch(`/data_${getRandom()}.json`);

      if (!response.ok) {
        throw new Error(`Failed to fetch file`);
      }

      const source = await response.json();
      const sourceLength = source.length;

      return source[getRandomIndex(sourceLength)];
    } catch (error) {
      console.error(`Error fetching JSON file`, error);
      return null;
    }
  }

  async function assignNewWord() {
    const newWord = await getDataSource();
    if (newWord) {
      currentWord.value = newWord;
    }
    setIsFavouriteOnNewWord();
  }

  return {
    currentWord: readonly(currentWord),
    getDataSource,
    assignNewWord,
  };
}
