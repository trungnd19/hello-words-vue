import { ref } from "vue";
import { WordData } from "../stores/WordsStore";
import Papa from "papaparse";

export interface DatasetMeta {
  id: string;
  name: string;
  wordCount: number;
  createdAt: string;
}

export const BUILTIN_DATASETS = ["advanced", "intermediate"] as const;
export type BuiltinDatasetId = (typeof BUILTIN_DATASETS)[number];

const DATASETS_KEY = "customDatasets";
const ACTIVE_DATASET_KEY = "activeDataset";

function getStoredMetas(): DatasetMeta[] {
  return JSON.parse(localStorage.getItem(DATASETS_KEY) || "[]");
}

function getStoredActiveDataset(): string {
  return localStorage.getItem(ACTIVE_DATASET_KEY) || "advanced";
}

export function isBuiltinDataset(id: string): id is BuiltinDatasetId {
  return BUILTIN_DATASETS.includes(id as BuiltinDatasetId);
}

// Generate a short unique ID by combining timestamp (base36) with random chars
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getDatasetWords(datasetId: string): WordData[] {
  return JSON.parse(localStorage.getItem(`dataset_${datasetId}`) || "[]");
}

function validateJsonData(data: unknown): data is { word: { text: string; meaning: string }; sentences: unknown[] }[] {
  if (!Array.isArray(data) || data.length === 0) return false;
  return data.every(
    (item) =>
      item.word &&
      typeof item.word.text === "string" &&
      typeof item.word.meaning === "string" &&
      Array.isArray(item.sentences)
  );
}

function mapToWordData(data: any[]): WordData[] {
  return data.map((item) => ({
    word: {
      text: item.word.text || "",
      transliterations: item.word.transliterations || "",
      part_of_speech: item.word.part_of_speech || "",
      meaning: item.word.meaning || "",
      sound: item.word.sound || "",
    },
    sentences: (item.sentences || []).map((s: any) => ({
      text: s.text || "",
      transliterations: s.transliterations || "",
      meaning: s.meaning || "",
      sound: s.sound || "",
    })),
  }));
}

// Merge CSV rows into WordData objects — multiple rows with the same "word" column
// are grouped together, with each row's example fields appended as a sentence entry.
function parseCsvToWordData(rows: any[]): WordData[] {
  const wordMap = new Map<string, WordData>();

  for (const row of rows) {
    const wordText = (row.word || "").trim();
    if (!wordText) continue;

    // First occurrence of this word: create the base WordData entry
    if (!wordMap.has(wordText)) {
      wordMap.set(wordText, {
        word: {
          text: wordText,
          transliterations: (row.reading || "").trim(),
          part_of_speech: (row.part_of_speech || "").trim(),
          meaning: (row.meaning || "").trim(),
          sound: (row.sound || "").trim(),
        },
        sentences: [],
      });
    }

    // Subsequent rows with the same word only contribute their example sentence
    const exampleText = (row.example_text || "").trim();
    if (exampleText) {
      wordMap.get(wordText)!.sentences.push({
        text: exampleText,
        transliterations: (row.example_reading || "").trim(),
        meaning: (row.example_meaning || "").trim(),
        sound: (row.example_sound || "").trim(),
      });
    }
  }

  return Array.from(wordMap.values());
}

// global state
const datasets = ref<DatasetMeta[]>(getStoredMetas());
const activeDataset = ref<string>(getStoredActiveDataset());

function saveMetas() {
  localStorage.setItem(DATASETS_KEY, JSON.stringify(datasets.value));
}

function saveActiveDataset() {
  localStorage.setItem(ACTIVE_DATASET_KEY, activeDataset.value);
}

function saveDataset(id: string, name: string, words: WordData[]) {
  localStorage.setItem(`dataset_${id}`, JSON.stringify(words));
  datasets.value.push({ id, name, wordCount: words.length, createdAt: new Date().toISOString() });
  saveMetas();
}

export function useCustomDataset() {
  function getActiveDatasetWords(): WordData[] | null {
    if (isBuiltinDataset(activeDataset.value)) return null;
    return getDatasetWords(activeDataset.value);
  }

  function switchDataset(datasetId: string) {
    activeDataset.value = datasetId;
    saveActiveDataset();
  }

  function removeDataset(datasetId: string) {
    datasets.value = datasets.value.filter((d) => d.id !== datasetId);
    localStorage.removeItem(`dataset_${datasetId}`);
    saveMetas();

    // If the deleted dataset was active, fall back to built-in default
    if (activeDataset.value === datasetId) {
      activeDataset.value = "advanced";
      saveActiveDataset();
    }
  }

  async function importJSON(file: File): Promise<{ success: boolean; error?: string }> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateJsonData(data)) {
        return { success: false, error: "Invalid format. Each item must have word.text, word.meaning, and sentences array." };
      }

      const words = mapToWordData(data);
      const id = generateId();
      const name = file.name.replace(/\.json$/i, "");
      saveDataset(id, name, words);

      return { success: true };
    } catch {
      return { success: false, error: "Failed to parse JSON file." };
    }
  }

  async function importCSV(file: File): Promise<{ success: boolean; error?: string }> {
    try {
      const text = await file.text();

      return new Promise((resolve) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data as any[];
            if (!rows.length || !rows[0].word || !rows[0].meaning) {
              resolve({ success: false, error: "CSV must have 'word' and 'meaning' columns." });
              return;
            }

            const words = parseCsvToWordData(rows);
            if (words.length === 0) {
              resolve({ success: false, error: "No valid words found in CSV." });
              return;
            }

            const id = generateId();
            const name = file.name.replace(/\.csv$/i, "");
            saveDataset(id, name, words);

            resolve({ success: true });
          },
          error: () => {
            resolve({ success: false, error: "Failed to parse CSV file." });
          },
        });
      });
    } catch {
      return { success: false, error: "Failed to read file." };
    }
  }

  function importQuizlet(text: string, name: string): { success: boolean; error?: string } {
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      return { success: false, error: "No content found." };
    }

    // Quizlet exports use tab-separated format: front<TAB>back (one card per line).
    // Track invalid lines to report precise error messages to the user.
    const invalidLines: number[] = [];
    const words: WordData[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.includes("\t")) {
        invalidLines.push(i + 1);
        continue;
      }

      const parts = line.split("\t");
      const front = (parts[0] || "").trim();
      const back = (parts[1] || "").trim();

      if (!front || !back) {
        invalidLines.push(i + 1);
        continue;
      }

      words.push({
        word: {
          text: front,
          transliterations: "",
          part_of_speech: "",
          meaning: back,
          sound: "",
        },
        sentences: [],
      });
    }

    if (words.length === 0) {
      return { success: false, error: "No valid cards found. Each line must have front and back separated by a tab character." };
    }

    // Fail the entire import if any lines are malformed — avoids partial/confusing imports
    if (invalidLines.length > 0) {
      return { success: false, error: `Lines ${invalidLines.join(", ")} are invalid (missing tab separator or empty front/back). Please fix and try again.` };
    }

    const id = generateId();
    saveDataset(id, name || "Quizlet Import", words);

    return { success: true };
  }

  return {
    datasets,
    activeDataset,
    getDatasetWords,
    getActiveDatasetWords,
    switchDataset,
    removeDataset,
    importJSON,
    importCSV,
    importQuizlet,
  };
}
