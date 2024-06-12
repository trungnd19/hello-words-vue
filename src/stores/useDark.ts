import { readonly, ref } from "vue";

function getInitialDarkMode() {
  const userPreference = localStorage.getItem("darkMode");
  return userPreference === "dark" ? true : false;
}

// Function to save the dark mode preference to local storage
function saveDarkModePreference(isDarkMode: string) {
  localStorage.setItem("darkMode", isDarkMode);
}

// global state, created in module scope
const darkMode = ref(getInitialDarkMode());

export function useDark() {
  function setTheme() {
    const themeValue = darkMode.value ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", themeValue);
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value;
    const themeValue = darkMode.value ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", themeValue);
    saveDarkModePreference(themeValue);
  }

  return {
    darkMode: readonly(darkMode),
    toggleDarkMode,
    setTheme,
  };
}
