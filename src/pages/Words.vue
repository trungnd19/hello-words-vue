<script setup lang="ts">
import AudioIcon from "../components/Audio.vue";
import { useWord } from "../stores/WordsStore";
import { Spoiler } from "vue-spoiler";

const { currentWord, assignNewWord } = useWord();
assignNewWord();

function getDifferentWord() {
  assignNewWord();
}
</script>

<template>
  <Transition appear mode="out-in">
    <div class="container" :key="currentWord.word.text">
      <div class="word">
        <h1 class="word__text japanese-font">{{ currentWord.word.text }}</h1>
        <div class="word__info">
          <div class="word__audio">
            <AudioIcon :audioUrl="currentWord.word.sound" />
            <div class="word__transliteration japanese-font">
              <Spoiler
                :key="currentWord.word.transliterations"
                :tagBackgroundColor="`var(--spoiler-color)`"
                >{{ currentWord.word.transliterations }}</Spoiler
              >
            </div>
          </div>
          <div class="word__type">{{ currentWord.word.part_of_speech }}</div>
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

      <div class="sentence">
        <span class="text-bold">Example:</span>
        <ul class="sentence__list">
          <li v-for="sentence in currentWord.sentences" :key="sentence.text">
            <div>
              <div
                class="sentence__text japanese-font"
                v-html="sentence.text"
              ></div>
              <div class="sentence__transliteration">
                <span
                  ><AudioIcon :audioUrl="sentence.sound" /><Spoiler
                    :tagBackgroundColor="`var(--spoiler-color)`"
                    ><span
                      class="japanese-font"
                      v-html="sentence.transliterations"
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
  <button class="action-btn" @click="getDifferentWord">
    Learn other word!
  </button>
</template>

<style scoped>
.container {
  width: calc(100vw - 80px);
  max-width: 1024px;
  margin-top: 4rem;
  border-bottom: 1px solid #d3d3d4;
  border-top: 1px solid #d3d3d4;
  padding-bottom: 1.5rem;
}

.word__info > *:not(:last-child) {
  margin-bottom: 10px;
}

.word__info {
  margin-bottom: 1.5rem;
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
  margin-top: 1rem;
}

.word__meaning-title {
  margin-right: 0.2rem;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

:deep(.spoiler) {
  display: inline !important;
}
</style>
