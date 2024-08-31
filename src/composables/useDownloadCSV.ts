import { ref } from "vue";
import { WordData, useWord } from "../stores/WordsStore";
import { getLocalStorageWords } from "./useFavourite";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export function useDownloadCSV() {
  function transformWordListForCSV(wordList: WordData[]) {
    const transformedArray = wordList.map((item) => {
      const examples = item.sentences
        .map((sentence) => {
          return `${sentence.text}\n${sentence.transliterations}\n${sentence.meaning}`;
        })
        .join("\n\n"); // Combine all examples with a double line break between each

      return {
        Word: item.word.text,
        Transliterations: item.word.transliterations,
        "Part-of-speech": item.word.part_of_speech,
        Meaning: item.word.meaning,
        Example: examples,
      };
    });

    return transformedArray;
  }

  function downloadCSV() {
    const favouriteWordsList = getLocalStorageWords();

    if (!favouriteWordsList.length) {
      alert("No word added to learning list yet!");
      return;
    }

    const transformedWordsList = transformWordListForCSV(favouriteWordsList);

    const csv = "\uFEFF" + Papa.unparse(transformedWordsList);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "wordsList.csv"); // Trigger download
  }

  return {
    downloadCSV,
  };
}
