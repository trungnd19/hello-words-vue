<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWord } from "../stores/WordsStore";
import AudioIcon from "../components/Audio.vue";
import HeartBtn from "../components/HeartBtn.vue";
import { Spoiler } from "vue-spoiler";
import { sanitizeHtml } from "../utils/sanitize";

const { currentWord, assignNewWord } = useWord();
const isReady = ref(false);

onMounted(async () => {
  await assignNewWord();
  isReady.value = true;
});

function getDifferentWord() {
  assignNewWord();
}
</script>

<template>
  <template v-if="isReady">
  <Transition mode="out-in">
    <div class="container" :key="currentWord.word.text">
      <div class="card-heart">
        <HeartBtn />
      </div>
      <div class="word">
        <h1 class="word__text japanese-font">{{ currentWord.word.text }}</h1>
        <div class="word__info">
          <div class="word__audio">
            <AudioIcon v-if="currentWord.word.sound" :audioUrl="currentWord.word.sound" />
            <div class="word__transliteration japanese-font">
              <Spoiler
                :key="currentWord.word.transliterations"
                :tagBackgroundColor="`var(--spoiler-color)`"
                >{{ currentWord.word.transliterations }}</Spoiler
              >
            </div>
          </div>
          <div v-if="currentWord.word.part_of_speech" class="word__type">{{ currentWord.word.part_of_speech }}</div>
          <div class="word__meaning">
            <span class="text-bold word__meaning-title">Meaning: </span>
            <Spoiler
              :key="currentWord.word.meaning"
              :tagBackgroundColor="`var(--spoiler-color)`"
            >
              {{ currentWord.word.meaning }}</Spoiler
            >
          </div>
        </div>
      </div>

      <div v-if="currentWord.sentences && currentWord.sentences.length" class="sentence">
        <span class="text-bold">Example:</span>
        <ul class="sentence__list">
          <li v-for="sentence in currentWord.sentences" :key="sentence.text">
            <div>
              <div
                class="sentence__text japanese-font"
                v-html="sanitizeHtml(sentence.text)"
              ></div>
              <div class="sentence__transliteration">
                <span
                  ><AudioIcon v-if="sentence.sound" :audioUrl="sentence.sound" /><Spoiler
                    :tagBackgroundColor="`var(--spoiler-color)`"
                    ><span
                      class="japanese-font"
                      v-html="sanitizeHtml(sentence.transliterations)"
                    ></span></Spoiler
                ></span>
              </div>

              <div class="sentence__meaning">
                <Spoiler :tagBackgroundColor="`var(--spoiler-color)`">{{
                  sentence.meaning
                }}</Spoiler>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
  <button class="btn-primary action-btn" @click="getDifferentWord">
    Learn other word!
  </button>
  </template>
</template>

<style scoped>
.container {
  position: relative;
  width: calc(100vw - 80px);
  max-width: 1024px;
  margin-top: 3rem;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: var(--shadow);
}

.card-heart {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.word__info > *:not(:last-child) {
  margin-bottom: 12px;
}

.word__info {
  margin-bottom: 2rem;
}

.word__type {
  display: inline-block;
  padding: 0.25em 0.75em;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.85em;
  color: var(--text-secondary);
}

.sentence {
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.sentence__list > *:not(:last-child) {
  margin-bottom: 24px;
}

.word__audio {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sentence__transliteration :deep(.audio-icon) {
  margin-bottom: -3px;
  margin-right: 4px;
}

.action-btn {
  margin-top: 1.5rem;
}

.word__meaning-title {
  margin-right: 0.2rem;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

:deep(.spoiler) {
  display: inline !important;
}
</style>
