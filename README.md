# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

Mapping function
const map = json.map((item) => {
  const word = {
    text: item.item.cue.text,
    transliterations: item.item.cue.transliterations.Hrkt,
    part_of_speech: item.item.cue.part_of_speech,
    meaning: item.item.response.text,
    sound: item.sound,
  };

  const sentences = item.sentences.map((sentence) => {
    return {
      text: sentence.cue.text,
      transliterations: sentence.cue.transliterations.Hrkt,
      part_of_speech: sentence.cue.part_of_speech,
      meaning: sentence.response.text,
      sound: sentence.sound,
    };
  });

  return {
    word: word,
    sentences: sentences,
  };
});

console.log(map);