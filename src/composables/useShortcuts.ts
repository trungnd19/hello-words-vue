import { ref, onMounted } from "vue";

export interface Shortcut {
  name: string;
  url: string;
  icon: string;
}

const MAX_SHORTCUTS = 10;
const STORAGE_KEY = "defaultTab_shortcuts";

const defaultShortcuts: Shortcut[] = [
  { name: "Quizlet", url: "https://quizlet.com", icon: "📚" },
  { name: "ChatGPT", url: "https://chat.openai.com", icon: "🤖" },
  { name: "Outlook", url: "https://outlook.live.com", icon: "✉" },
  { name: "GitHub", url: "https://github.com", icon: "⌘" },
  { name: "Notion", url: "https://notion.so", icon: "📝" },
];

export function useShortcuts() {
  const shortcuts = ref<Shortcut[]>([]);
  const showAddForm = ref(false);
  const newName = ref("");
  const newUrl = ref("");

  function loadShortcuts() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        shortcuts.value = JSON.parse(saved);
      } catch {
        shortcuts.value = [...defaultShortcuts];
      }
    } else {
      shortcuts.value = [...defaultShortcuts];
    }
  }

  function saveShortcuts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts.value));
  }

  function addShortcut() {
    if (!newName.value.trim() || !newUrl.value.trim()) return;
    if (shortcuts.value.length >= MAX_SHORTCUTS) return;
    let url = newUrl.value.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    shortcuts.value.push({ name: newName.value.trim(), url, icon: "custom" });
    saveShortcuts();
    newName.value = "";
    newUrl.value = "";
    showAddForm.value = false;
  }

  function removeShortcut(index: number) {
    shortcuts.value.splice(index, 1);
    saveShortcuts();
  }

  function getFaviconUrl(url: string) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "";
    }
  }

  onMounted(() => {
    loadShortcuts();
  });

  return {
    shortcuts,
    showAddForm,
    newName,
    newUrl,
    maxShortcuts: MAX_SHORTCUTS,
    addShortcut,
    removeShortcut,
    getFaviconUrl,
  };
}
