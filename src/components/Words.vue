<script setup lang="ts">
import AudioIcon from "./Audio.vue";
import Spoiler from "./Spoiler.vue";
import { useWord } from "../stores/WordsStore";

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
        <h1 class="word__text">{{ currentWord.word.text }}</h1>
        <div class="word__info">
          <div class="word__audio">
            <AudioIcon :audioUrl="currentWord.word.sound" />
            <div class="word__transliteration">
              <Spoiler :key="currentWord.word.transliterations">{{
                currentWord.word.transliterations
              }}</Spoiler>
            </div>
          </div>
          <div class="word__type">{{ currentWord.word.part_of_speech }}</div>
          <div class="word__meaning">
            <span class="text-bold word__meaning-title">Meaning: </span>
            <Spoiler :key="currentWord.word.meaning">
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
              <div class="sentence__text" v-html="sentence.text"></div>
              <div class="sentence__transliteration">
                <span
                  ><AudioIcon :audioUrl="sentence.sound" /><Spoiler
                    ><span v-html="sentence.transliterations"></span></Spoiler
                ></span>
              </div>

              <div class="sentence__meaning">
                <Spoiler>{{ sentence.meaning }}</Spoiler>
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
  margin-bottom: 10px; /* Adjust the margin value as needed */
}

.word__info {
  margin-bottom: 1.5rem;
}

.sentence__list > *:not(:last-child) {
  margin-bottom: 24px; /* Adjust the margin value as needed */
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
</style>
