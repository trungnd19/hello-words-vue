import { readonly, ref } from "vue";

// global state, created in module scope
const audio = ref<HTMLAudioElement>();

export function useAudio() {
  async function playAudio(audioUrl: string) {
    try {
      if (audio.value && !audio.value.paused) {
        audio.value.pause();
        audio.value.currentTime = 0;
      }

      audio.value = new Audio(audioUrl);
      await audio.value.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }

  return {
    audio: readonly(audio),
    playAudio,
  };
}
