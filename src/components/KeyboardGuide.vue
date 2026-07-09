<template>
  <div class="keyboard-guide-wrapper" ref="wrapperRef">
    <div
      class="keyboard-guide-btn"
      @click="showGuide = !showGuide"
      title="Keyboard shortcuts"
    >
      <svg viewBox="0 0 24 24" width="1.2em" height="1.2em">
        <path
          fill="currentColor"
          d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"
        />
      </svg>
    </div>

    <Transition name="fade">
      <div v-if="showGuide" class="keyboard-guide-panel">
        <div class="guide-title">Keyboard Shortcuts</div>
        <ul class="guide-list">
          <li><kbd>Space</kbd> <span>Reveal all spoilers</span></li>
          <li><kbd>N</kbd> <span>Next word</span></li>
          <li><kbd>F</kbd> <span>Toggle favourite</span></li>
          <li><kbd>Q</kbd> <span>Go to Quiz</span></li>
          <li><kbd>Esc</kbd> <span>Back to Words</span></li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useClickOutside } from "../composables/useClickOutside";

const showGuide = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

useClickOutside(wrapperRef, () => {
  showGuide.value = false;
});
</script>

<style scoped>
.keyboard-guide-wrapper {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 100;
}

.keyboard-guide-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.keyboard-guide-btn:hover {
  opacity: 1;
}

.keyboard-guide-panel {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-hover);
  z-index: 100;
  min-width: 200px;
}

.guide-title {
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin-bottom: 0.6rem;
}

.guide-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.guide-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-color);
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  padding: 0.15rem 0.5rem;
  font-size: 0.75rem;
  font-family: inherit;
  font-weight: 600;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
