<script setup lang="ts">
import { onMounted } from "vue";
import { useQuiz } from "../composables/useQuiz";
import { useRoutePage } from "../composables/useRoutePage";
import { sanitizeHtml } from "../utils/sanitize";

const { navigateToWord } = useRoutePage();
const { score, currentQuestion, selectedAnswer, isAnswered, nextQuestion, submitAnswer, resetQuiz } = useQuiz();

onMounted(() => {
  resetQuiz();
  nextQuestion();
});

function handleAnswer(option: string) {
  submitAnswer(option);
}

function handleNext() {
  nextQuestion();
}

function getOptionClass(option: string) {
  if (!isAnswered.value) return "";
  if (option === currentQuestion.value?.correctAnswer) return "option--correct";
  if (option === selectedAnswer.value) return "option--wrong";
  return "option--dimmed";
}
</script>

<template>
  <div class="quiz-container">
    <div class="quiz-header">
      <p class="quiz-header__title">Quiz Mode</p>
      <button @click="navigateToWord">&larr; Back to Word</button>
    </div>

    <div class="quiz-score">
      <span class="score-correct">{{ score.correct }} correct</span>
      <span class="score-divider">·</span>
      <span class="score-wrong">{{ score.wrong }} wrong</span>
    </div>

    <template v-if="currentQuestion">
      <div class="quiz-card">
        <p class="quiz-card__label">
          {{ currentQuestion.type === "word-to-meaning" ? "What does this mean?" : "Which word matches?" }}
        </p>
        <p class="quiz-card__prompt japanese-font">
          {{ currentQuestion.prompt }}
        </p>
      </div>

      <div class="quiz-options">
        <button
          v-for="option in currentQuestion.options"
          :key="option"
          class="quiz-option"
          :class="getOptionClass(option)"
          :disabled="isAnswered"
          @click="handleAnswer(option)"
        >
          <span :class="{ 'japanese-font': currentQuestion.type === 'meaning-to-word' }">
            {{ option }}
          </span>
        </button>
      </div>

      <div v-if="isAnswered" class="quiz-reveal">
        <div class="quiz-reveal__word">
          <strong class="japanese-font">{{ currentQuestion.wordData.word.text }}</strong>
          <span v-if="currentQuestion.wordData.word.transliterations" class="japanese-font">
            ({{ currentQuestion.wordData.word.transliterations }})
          </span>
        </div>
        <p class="quiz-reveal__meaning">{{ currentQuestion.wordData.word.meaning }}</p>
        <div v-if="currentQuestion.wordData.sentences.length" class="quiz-reveal__example">
          <p class="japanese-font" v-html="sanitizeHtml(currentQuestion.wordData.sentences[0].text)"></p>
          <p class="quiz-reveal__example-meaning">{{ currentQuestion.wordData.sentences[0].meaning }}</p>
        </div>
        <button class="btn-primary quiz-next" @click="handleNext">
          Next question &rarr;
        </button>
      </div>
    </template>

    <div v-else class="quiz-empty">
      <p>Dataset needs at least 4 words for Quiz mode.</p>
      <button @click="navigateToWord">&larr; Back to Word</button>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  margin-top: 3rem;
  padding-bottom: 1.5rem;
  width: calc(100vw - 80px);
  max-width: 600px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.quiz-header__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--word-color);
  margin: 0;
}

.quiz-score {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.score-correct {
  color: #2f855a;
  font-weight: 500;
}

.score-wrong {
  color: #c53030;
  font-weight: 500;
}

.score-divider {
  color: var(--text-secondary);
}

.quiz-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.quiz-card__label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 0.75rem;
}

.quiz-card__prompt {
  font-size: 2rem;
  font-weight: 600;
  color: var(--word-color);
  margin: 0;
  line-height: 1.4;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.quiz-option {
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-option:hover:not(:disabled) {
  border-color: var(--accent-color);
  box-shadow: var(--shadow);
}

.quiz-option:disabled {
  cursor: default;
}

.option--correct {
  border-color: #2f855a;
  background-color: rgba(47, 133, 90, 0.08);
  color: #2f855a;
  font-weight: 500;
}

.option--wrong {
  border-color: #c53030;
  background-color: rgba(197, 48, 48, 0.08);
  color: #c53030;
}

.option--dimmed {
  opacity: 0.5;
}

.quiz-reveal {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.quiz-reveal__word {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.quiz-reveal__meaning {
  color: var(--text-secondary);
  margin: 0.25rem 0 0.75rem;
}

.quiz-reveal__example {
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.quiz-reveal__example p {
  margin: 0.25rem 0;
}

.quiz-reveal__example-meaning {
  color: var(--text-secondary);
}

.quiz-next {
  margin-top: 1rem;
  width: 100%;
}

.quiz-empty {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

@media screen and (max-width: 600px) {
  .quiz-container {
    width: calc(100vw - 32px);
  }

  .quiz-card__prompt {
    font-size: 1.5rem;
  }
}
</style>
