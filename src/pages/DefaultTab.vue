<script setup lang="ts">
import { ref } from "vue";
import { useTabMode } from "../composables/useTabMode";
import { useRoutePage } from "../composables/useRoutePage";
import { useClock } from "../composables/useClock";
import { useShortcuts } from "../composables/useShortcuts";

const { showHelloWords } = useTabMode();
const { navigateToWord } = useRoutePage();
const { currentTime, currentDate, greeting } = useClock();
const { shortcuts, showAddForm, newName, newUrl, maxShortcuts, addShortcut, removeShortcut, getFaviconUrl } = useShortcuts();

const searchQuery = ref("");

function handleSearch() {
  if (!searchQuery.value.trim()) return;
  const query = encodeURIComponent(searchQuery.value.trim());
  window.location.href = `https://www.google.com/search?q=${query}`;
}
</script>

<template>
  <div class="default-tab">
    <div class="default-tab__content">
      <div class="clock">
        <p class="clock__greeting">{{ greeting }}</p>
        <p class="clock__time">{{ currentTime }}</p>
        <p class="clock__date">{{ currentDate }}</p>
      </div>

      <form class="search" @submit.prevent="handleSearch">
        <input
          v-model="searchQuery"
          type="text"
          class="search__input"
          placeholder="Search Google..."
          aria-label="Search Google"
          autofocus
        />
      </form>

      <div class="shortcuts">
        <a
          v-for="(shortcut, index) in shortcuts"
          :key="shortcut.url"
          :href="shortcut.url"
          class="shortcut"
          :title="shortcut.name"
        >
          <button
            class="shortcut__remove"
            title="Remove"
            @click.prevent.stop="removeShortcut(index)"
          >×</button>
          <span class="shortcut__icon">
            <img
              v-if="shortcut.icon === 'custom'"
              :src="getFaviconUrl(shortcut.url)"
              :alt="shortcut.name"
              class="shortcut__favicon"
              width="24"
              height="24"
            />
            <template v-else>{{ shortcut.icon }}</template>
          </span>
          <span class="shortcut__name">{{ shortcut.name }}</span>
        </a>

        <!-- Add button -->
        <button
          v-if="shortcuts.length < maxShortcuts && !showAddForm"
          class="shortcut shortcut--add"
          title="Add shortcut"
          @click="showAddForm = true"
        >
          <span class="shortcut__icon shortcut__icon--add">+</span>
          <span class="shortcut__name">Add</span>
        </button>
      </div>

      <!-- Add form -->
      <form v-if="showAddForm" class="add-form" @submit.prevent="addShortcut">
        <p class="add-form__title">Add shortcut</p>
        <input
          v-model="newName"
          type="text"
          class="add-form__input"
          placeholder="Name (e.g. Reddit)"
          maxlength="20"
          aria-label="Shortcut name"
        />
        <input
          v-model="newUrl"
          type="text"
          class="add-form__input"
          placeholder="URL (e.g. reddit.com)"
          maxlength="200"
          aria-label="Shortcut URL"
        />
        <div v-if="newUrl.trim()" class="add-form__preview">
          <img
            :src="getFaviconUrl(newUrl.startsWith('http') ? newUrl : 'https://' + newUrl)"
            width="16"
            height="16"
            alt=""
            class="add-form__preview-icon"
          />
          <span class="add-form__preview-text">{{ newName || newUrl }}</span>
        </div>
        <div class="add-form__actions">
          <button type="submit" class="add-form__btn add-form__btn--save">Add</button>
          <button type="button" class="add-form__btn add-form__btn--cancel" @click="showAddForm = false">Cancel</button>
        </div>
      </form>
    </div>

    <button class="back-btn" @click="() => { showHelloWords(); navigateToWord(); }">
      ← Back to Hello Words
    </button>
  </div>
</template>

<style scoped>
.default-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  width: 100%;
}

.default-tab__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.clock {
  text-align: center;
}

.clock__greeting {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem;
}

.clock__time {
  font-size: 5rem;
  font-weight: 700;
  color: var(--word-color);
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.clock__date {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0.75rem 0 0;
}

.search {
  width: 100%;
  max-width: 500px;
  min-width: 320px;
}

.search__input {
  width: 100%;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-family: inherit;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  background-color: var(--card-bg);
  color: var(--text-color);
  box-shadow: var(--shadow);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.search__input:focus {
  border-color: var(--accent-color);
  outline: none;
  box-shadow: var(--shadow-hover);
}

.search__input::placeholder {
  color: var(--text-secondary);
}

.shortcuts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
  max-width: 480px;
  width: 100%;
}

.shortcut {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  color: var(--text-color);
  padding: 0.5rem 0.6rem;
  border-radius: 12px;
  width: 60px;
  transition: background-color 0.2s ease;
}

.shortcut:hover {
  background-color: var(--card-bg);
  box-shadow: var(--shadow);
}

.shortcut__remove {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--text-secondary);
  color: var(--bg-color, #fff);
  font-size: 12px;
  line-height: 1;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  padding: 0;
}

.shortcut:hover .shortcut__remove {
  display: flex;
}

.shortcut__icon {
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-color);
}

.shortcut__icon--add {
  font-size: 1.5rem;
  border-style: dashed;
  opacity: 0.6;
}

.shortcut--add {
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  color: var(--text-color);
}

.shortcut--add:hover .shortcut__icon--add {
  opacity: 1;
}

.shortcut__favicon {
  border-radius: 4px;
  background: #f0f0f0;
  padding: 2px;
}

.shortcut__name {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 300px;
  padding: 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow);
  position: relative;
  z-index: 1;
}

.add-form__title {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color);
}

.add-form__preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.add-form__preview-icon {
  border-radius: 3px;
  background: #f0f0f0;
  padding: 1px;
}

.add-form__preview-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-form__input {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-color);
}

.add-form__input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.add-form__actions {
  display: flex;
  gap: 0.5rem;
}

.add-form__btn {
  flex: 1;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  font-family: inherit;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.add-form__btn--save {
  background: var(--accent-color);
  color: #fff;
}

.add-form__btn--cancel {
  background: var(--border-color);
  color: var(--text-color);
}

.back-btn {
  margin-top: 3rem;
  font-size: 0.85em;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.back-btn:hover {
  opacity: 1;
}

@media screen and (max-width: 600px) {
  .clock__time {
    font-size: 3.5rem;
  }

  .search {
    max-width: 90vw;
  }

  .shortcuts {
    gap: 1rem;
  }
}
</style>
