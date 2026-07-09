import { ref } from "vue";
import { WordData } from "../stores/WordsStore";
import { useCustomDataset } from "./useCustomDataset";

export type QuizType = "word-to-meaning" | "meaning-to-word";

export interface QuizQuestion {
  type: QuizType;
  prompt: string;
  correctAnswer: string;
  options: string[];
  wordData: WordData;
}

const score = ref({ correct: 0, wrong: 0 });
const currentQuestion = ref<QuizQuestion | null>(null);
const selectedAnswer = ref<string | null>(null);
const isAnswered = ref(false);

const TOTAL_DATA_FILES = 20;

function getRandomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

// Fisher-Yates shuffle — produces an unbiased random permutation
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function useQuiz() {
  const { getActiveDatasetWords } = useCustomDataset();

  async function getWordPool(): Promise<WordData[]> {
    const customWords = getActiveDatasetWords();
    if (customWords && customWords.length > 0) {
      return customWords;
    }

    // Fetch from default static files — load 3 random files for variety.
    // Using a Set guarantees 3 distinct file indices (no duplicate fetches).
    const words: WordData[] = [];
    const fileIndices = new Set<number>();
    while (fileIndices.size < 3) {
      fileIndices.add(Math.floor(Math.random() * TOTAL_DATA_FILES) + 1);
    }

    for (const idx of fileIndices) {
      try {
        const response = await fetch(`/data_${idx}.json`);
        if (response.ok) {
          const data = await response.json();
          words.push(...data);
        }
      } catch {
        // skip failed fetches
      }
    }

    return words;
  }

  // Get the answer field: for "word-to-meaning" the answer is the meaning,
  // for "meaning-to-word" the answer is the word text.
  function getFieldValue(word: WordData, type: QuizType): string {
    return type === "word-to-meaning" ? word.word.meaning : word.word.text;
  }

  // Get the question prompt: the opposite of getFieldValue —
  // shows the word when asking for meaning, shows meaning when asking for word.
  function getPromptValue(word: WordData, type: QuizType): string {
    return type === "word-to-meaning" ? word.word.text : word.word.meaning;
  }

  // Pick 3 wrong answers that differ from the correct one.
  // Uses random sampling with a 50-attempt cap to avoid infinite loops
  // when the pool has many duplicates or is too small.
  function pickDistractors(wordPool: WordData[], correctIndex: number, type: QuizType): number[] {
    const correctValue = getFieldValue(wordPool[correctIndex], type);
    const distractorIndices = new Set<number>();
    let attempts = 0;

    while (distractorIndices.size < 3 && attempts < 50) {
      const idx = getRandomIndex(wordPool.length);
      // Reject if same index or same display value as correct answer
      if (idx !== correctIndex && getFieldValue(wordPool[idx], type) !== correctValue) {
        distractorIndices.add(idx);
      }
      attempts++;
    }

    return Array.from(distractorIndices);
  }

  // Build a 4-option multiple-choice question with randomized direction.
  // Returns null if the pool is too small or not enough unique distractors exist.
  function generateQuestion(wordPool: WordData[]): QuizQuestion | null {
    if (wordPool.length < 4) return null;

    // Randomly decide quiz direction: show word → guess meaning, or vice versa
    const type: QuizType = Math.random() < 0.5 ? "word-to-meaning" : "meaning-to-word";
    const correctIndex = getRandomIndex(wordPool.length);
    const correctWord = wordPool[correctIndex];

    const distractors = pickDistractors(wordPool, correctIndex, type);
    if (distractors.length < 3) return null;

    const correctAnswer = getFieldValue(correctWord, type);
    const options = [
      correctAnswer,
      ...distractors.map((i) => getFieldValue(wordPool[i], type)),
    ];

    return {
      type,
      prompt: getPromptValue(correctWord, type),
      correctAnswer,
      options: shuffleArray(options),
      wordData: correctWord,
    };
  }

  async function nextQuestion() {
    selectedAnswer.value = null;
    isAnswered.value = false;

    const pool = await getWordPool();
    if (pool.length < 4) {
      currentQuestion.value = null;
      return;
    }

    currentQuestion.value = generateQuestion(pool);
  }

  function submitAnswer(answer: string) {
    if (isAnswered.value) return;

    selectedAnswer.value = answer;
    isAnswered.value = true;

    if (answer === currentQuestion.value?.correctAnswer) {
      score.value.correct++;
    } else {
      score.value.wrong++;
    }
  }

  function resetQuiz() {
    score.value = { correct: 0, wrong: 0 };
    currentQuestion.value = null;
    selectedAnswer.value = null;
    isAnswered.value = false;
  }

  return {
    score,
    currentQuestion,
    selectedAnswer,
    isAnswered,
    nextQuestion,
    submitAnswer,
    resetQuiz,
  };
}
