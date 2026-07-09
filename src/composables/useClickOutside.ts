import { onMounted, onUnmounted, type Ref } from "vue";

export function useClickOutside(
  elementRef: Ref<HTMLElement | null>,
  callback: () => void
) {
  function handler(e: MouseEvent) {
    if (elementRef.value && !elementRef.value.contains(e.target as Node)) {
      callback();
    }
  }

  onMounted(() => document.addEventListener("click", handler));
  onUnmounted(() => document.removeEventListener("click", handler));
}
