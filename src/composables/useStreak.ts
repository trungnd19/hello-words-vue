import { ref, onMounted, onUnmounted } from "vue";

interface StreakData {
  currentStreak: number;
  lastActiveDate: string;
  longestStreak: number;
  totalWordsRevealed: number;
}

const STORAGE_KEY = "streakData";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function loadStreakData(): StreakData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to parse streakData from localStorage", e);
    }
  }
  return {
    currentStreak: 0,
    lastActiveDate: "",
    longestStreak: 0,
    totalWordsRevealed: 0,
  };
}

function saveStreakData(data: StreakData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Global reactive state
const streakData = ref<StreakData>(loadStreakData());

export function useStreak() {
  function recordActivity() {
    const today = getToday();
    const data = streakData.value;

    data.totalWordsRevealed++;

    if (data.lastActiveDate === today) {
      // Already active today, just increment total
      saveStreakData(data);
      return;
    }

    if (data.lastActiveDate === getYesterday()) {
      // Consecutive day
      data.currentStreak++;
    } else if (data.lastActiveDate === "") {
      // First time ever
      data.currentStreak = 1;
    } else {
      // Streak broken
      data.currentStreak = 1;
    }

    data.lastActiveDate = today;
    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }

    saveStreakData(data);
  }

  // Event delegation: detect spoiler clicks
  function handleSpoilerClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!target) return;

    // vue-spoiler library renders elements with class containing "spoiler"
    const spoilerEl = target.closest('[class*="spoiler"]');
    if (spoilerEl) {
      recordActivity();
    }
  }

  function setupListener() {
    document.addEventListener("click", handleSpoilerClick, true);
  }

  function cleanupListener() {
    document.removeEventListener("click", handleSpoilerClick, true);
  }

  onMounted(setupListener);
  onUnmounted(cleanupListener);

  return {
    streakData,
    recordActivity,
  };
}
