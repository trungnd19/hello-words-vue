# Hello Words! — Project Architecture

## Overview
Chrome/Edge extension (Manifest V3) học từ vựng tiếng Nhật. Override `newtab` → hiển thị random 1 từ mỗi lần mở tab mới.

## Tech Stack
- Vue 3 + TypeScript + Vite
- Không backend, không router, không Pinia
- Data: 20 file JSON tĩnh (`public/data_1.json` → `data_20.json`)
- `vue-spoiler`: lib tự viết (publish npm), che meaning/reading kiểu Reddit spoiler
- `papaparse` + `file-saver`: export CSV
- `@types/chrome`: type cho Chrome extension API

## Architecture Patterns
- **State management**: Module-scoped `ref` + composable function → singleton pattern (thay Pinia)
- **Routing**: Fake routing bằng `isFavouritePage` ref trong `useRoutePage.ts` (không dùng vue-router)
- **Dark mode**: CSS variables + `data-theme` attribute trên `<html>`
- **Storage**: `localStorage("words")` cho favourite, `localStorage("darkMode")` cho theme

## Key Files
| Layer | File | Vai trò |
|-------|------|---------|
| Entry | `App.vue` | Header + MainPage + Footer |
| Store | `stores/WordsStore.ts` | Global `currentWord`, fetch random word |
| Store | `stores/useDark.ts` | Dark mode state + toggle |
| Composable | `composables/useFavourite.ts` | CRUD favourite (localStorage) |
| Composable | `composables/useRoutePage.ts` | Điều hướng page bằng ref |
| Composable | `composables/useAudio.ts` | Play audio pronunciation |
| Composable | `composables/useDownloadCSV.ts` | Export favourite → CSV |
| Page | `pages/Words.vue` | Hiển thị từ + ví dụ + spoiler |
| Page | `pages/FavouriteList.vue` | Table favourite (search, pagination, delete) |
| Page | `pages/MainPage.vue` | Switch giữa Words và FavouriteList (Transition) |
| Component | `components/Header.vue` | HeartBtn, BookmarkBtn, DarkModeBtn, DownloadCSV |

## Data Structure
```ts
interface Word {
  text: string;           // 漢字
  transliterations: string; // ひらがな reading
  part_of_speech: string;
  meaning: string;        // English meaning
  sound: string;          // Audio URL (iKnow.jp)
}

interface Sentence {
  text: string;           // Example sentence (có <b> tag highlight)
  transliterations: string;
  meaning: string;
  sound: string;
}

interface WordData {
  word: Word;
  sentences: Sentence[];
}
```

## Coding Principles
- **Ưu tiên code sạch, dễ hiểu** — thể hiện best practice Vue 3
- **Bundle size nhỏ** — hạn chế tối đa external lib, tự code functionality
- **Tốc độ** — không backend, mọi thứ local/static
- **Composition API only** — `<script setup lang="ts">`
- **Separation of concerns** — logic tách composable, UI tách component
- **Không over-engineer** — giải pháp đơn giản nhất phù hợp với scope extension

## Build & Run
```bash
npm i
npm run dev      # dev server
npm run build    # production build → load vào chrome://extensions
```
