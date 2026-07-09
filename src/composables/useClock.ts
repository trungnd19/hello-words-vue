import { ref, computed, onMounted, onUnmounted } from "vue";

export function useClock() {
  const currentTime = ref("");
  const currentDate = ref("");
  let timer: number;

  const greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 6) return "Good night";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  function updateTime() {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    currentDate.value = now.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  onMounted(() => {
    updateTime();
    timer = window.setInterval(updateTime, 1000);
  });

  onUnmounted(() => {
    clearInterval(timer);
  });

  return { currentTime, currentDate, greeting };
}
