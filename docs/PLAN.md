# Plan: Hello Words v2 Enhancement

## TL;DR
8 phases: (1) UI redesign warm neutral tone, (2) Mini default-tab UI toggle, (3) Custom word set import (CSV/JSON), (4) Quiz Mode, (5) Keyboard Shortcuts, (6) Backup/Restore, (7) Streak Counter, (8) Demo website on separate repo + Vercel.

---

## Phase 1: UI Redesign — Warm Neutral & Modern Minimalist

**Goal**: Nâng cấp visual từ basic → elegant minimalist, tone warm neutral (beige/cream/soft brown).

**Steps**:
1. Cập nhật CSS variables trong `src/style.css`:
   - Light: background cream `#faf8f5`, text `#2d2a26`, accent warm brown `#8b6f47`, spoiler `#d4c5b0`
   - Dark: background `#1c1917`, text `#e7e0d8`, accent `#c9a96e`, spoiler `#3d3530`
   - Thêm `--accent-color`, `--card-bg`, `--border-color`, `--shadow`
2. `Words.vue` — thay border top/bottom bằng card style: subtle shadow, rounded corners, padding thoáng hơn
3. `Header.vue` — icon buttons có hover state mượt hơn (scale + opacity transition)
4. Button "Learn other word!" — redesign: filled accent background, rounded, hover darken
5. `FavouriteList.vue` — table → card-based hoặc styled table với alternating rows, border-radius
6. `Pagination.vue` — button style thống nhất, disabled state rõ ràng
7. `Footer.vue` — typography nhẹ hơn, opacity thấp
8. Typography: tăng line-height, letter-spacing nhẹ cho readability
9. Responsive check: đảm bảo mobile vẫn đẹp

**Files cần sửa**:
- `src/style.css` — global variables, base styles
- `src/pages/Words.vue` — card layout, spacing
- `src/pages/FavouriteList.vue` — table styling
- `src/components/Header.vue` — icon button hover
- `src/components/Pagination.vue` — button consistency
- `src/components/Footer.vue` — subtle styling
- `index.html` — có thể thêm font (Inter hoặc giữ Segoe UI)

---

## Phase 2: Mini Default-Tab UI (Toggle)

**Goal**: Nút toggle cho phép ẩn Hello Words → hiển thị mini new-tab UI (search bar + clock + shortcuts).

**Steps**:
1. Tạo `src/pages/DefaultTab.vue`:
   - Clock (giờ lớn, cập nhật realtime)
   - Search bar (submit → redirect Google/Bing tùy browser detect hoặc cho user chọn)
   - Shortcuts grid: hiển thị top sites (dùng `chrome.topSites.permission` nếu có, fallback manual)
2. Tạo `src/composables/useTabMode.ts`:
   - State `tabMode: 'hello-words' | 'default-tab'` (reactive ref, KHÔNG lưu localStorage)
   - Mỗi tab mới luôn mặc định `'hello-words'` — đây là core purpose của extension
   - Nút toggle chỉ chuyển mode trên tab hiện tại, không persist
3. Thêm toggle button vào `Header.vue` (icon switch/grid)
4. Cập nhật `MainPage.vue` — thêm condition: nếu `tabMode === 'default-tab'` → render `DefaultTab.vue`
5. Cập nhật `manifest.json` — thêm `permissions: ["topSites"]` (optional, enhance UX)

**Files cần tạo**:
- `src/pages/DefaultTab.vue`
- `src/composables/useTabMode.ts`

**Files cần sửa**:
- `src/pages/MainPage.vue` — thêm DefaultTab condition
- `src/components/Header.vue` — thêm toggle button
- `public/manifest.json` — thêm permission (optional)

---

## Phase 3: Custom Word Set Import (CSV + JSON)

**Goal**: User import bộ từ riêng → từ đó extension chỉ random từ dataset custom.

**Steps**:
1. Tạo `src/composables/useCustomDataset.ts`:
   - State: `customDatasets: DatasetMeta[]` (tên, ngày import, số từ)
   - `activeDataset: 'default' | string` (id dataset đang active)
   - Lưu datasets vào `localStorage("customDatasets")`, data vào `localStorage("dataset_{id}")`
   - Functions: `importCSV()`, `importJSON()`, `removeDataset()`, `switchDataset()`
2. Tạo `src/pages/DatasetManager.vue`:
   - List datasets đã import (tên, số từ, ngày, nút delete, nút activate)
   - Import button: mở file picker, validate format
   - CSV parsing: dùng papaparse (đã có trong deps), map columns → WordData format
   - JSON parsing: validate structure matches WordData[]
3. CSV format spec cho user:
   - Columns: `word`, `reading`, `part_of_speech`, `meaning`, `example_text`, `example_reading`, `example_meaning`
   - Nhiều example → nhiều row cùng word (group by word text)
4. Cập nhật `WordsStore.ts` — `getDataSource()`:
   - Check `activeDataset` → nếu custom → random từ localStorage dataset
   - Nếu default → giữ logic fetch JSON file hiện tại
5. Thêm navigation vào DatasetManager từ Header hoặc từ page riêng
6. Cập nhật `useRoutePage.ts` — thêm state cho trang Dataset Manager

**Files cần tạo**:
- `src/composables/useCustomDataset.ts`
- `src/pages/DatasetManager.vue`

**Files cần sửa**:
- `src/stores/WordsStore.ts` — thêm logic đọc từ custom dataset
- `src/composables/useRoutePage.ts` — thêm route cho DatasetManager
- `src/components/Header.vue` — thêm nút navigate đến DatasetManager
- `src/pages/MainPage.vue` — thêm render DatasetManager

---

## Phase 4: Quiz Mode

**Goal**: Quiz trắc nghiệm 4 đáp án, hỗ trợ cả default + custom dataset, 3 quiz types có thể mix.

**Quiz Types**:
- Type 1 (Meaning): Hiển thị kanji → 4 đáp án `meaning`
- Type 2 (Reading): Hiển thị kanji → 4 đáp án `transliterations`
- Type 3 (Word): Hiển thị `meaning` → 4 đáp án kanji

**Steps**:
1. Tạo `src/composables/useQuiz.ts`:
   - Input: word list (từ default JSON hoặc custom dataset localStorage)
   - Random `quizType` mỗi câu (mix mode), hoặc user chọn fixed type
   - Generate question: pick 1 correct + 3 distractors (cùng field tương ứng type)
   - Đảm bảo distractors khác nhau và khác correct answer
   - Track score trong session (đúng/sai/tổng)
   - Validate dataset ≥ 4 từ, nếu không → warning
2. Tạo `src/pages/QuizMode.vue`:
   - UI: hiển thị câu hỏi + 4 button đáp án
   - Feedback: đúng (highlight xanh) / sai (highlight đỏ + show đáp án đúng)
   - Sau mỗi câu: reveal full word info (reading, meaning, example) để user học
   - Score counter hiển thị ở góc
   - Nút "Next question" sau khi trả lời
   - Optional: chọn quiz type hoặc mix mode trước khi bắt đầu
3. Cập nhật `useRoutePage.ts` — thêm route state cho QuizMode
4. Cập nhật `MainPage.vue` — render QuizMode
5. Cập nhật `Header.vue` — thêm nút navigate đến Quiz

**Files mới**: `src/composables/useQuiz.ts`, `src/pages/QuizMode.vue`
**Files sửa**: `useRoutePage.ts`, `MainPage.vue`, `Header.vue`

---

## Phase 5: Keyboard Shortcuts

**Goal**: Power-user UX — thao tác nhanh không cần click.

**Steps**:
1. Tạo `src/composables/useKeyboard.ts`:
   - Listen `keydown` event trên document
   - Chỉ active khi ở trang Words (không conflict với search input, quiz, etc.)
2. Shortcuts:
   - `Space` — reveal tất cả spoilers trên trang
   - `N` — next word (gọi `assignNewWord()`)
   - `F` — toggle favourite
   - `Q` — navigate đến Quiz mode
   - `Escape` — quay lại trang Words (từ bất kỳ page nào)
3. Register listener ở `App.vue` hoặc `MainPage.vue`
4. Optional: hiển thị shortcut hint nhỏ ở góc màn hình (có thể toggle ẩn/hiện)

**Files mới**: `src/composables/useKeyboard.ts`
**Files sửa**: `App.vue` hoặc `MainPage.vue`

---

## Phase 6: Backup / Restore

**Goal**: Export/import toàn bộ user data (favourites, custom datasets, preferences) thành 1 file JSON.

**Steps**:
1. Tạo `src/composables/useBackup.ts`:
   - `exportBackup()`: thu thập tất cả localStorage keys liên quan → tạo JSON blob → download
   - `importBackup()`: file picker → validate JSON structure → ghi vào localStorage → reload state
   - Keys cần backup: `words` (favourites), `darkMode`, `customDatasets`, `dataset_{id}`, streak data
2. UI: thêm vào Settings section hoặc trong Header dropdown
   - Nút Export (download file `hello-words-backup-{date}.json`)
   - Nút Import (file picker + confirm dialog trước khi overwrite)
3. Validate import: check required fields, handle version mismatch nếu format thay đổi

**Files mới**: `src/composables/useBackup.ts`
**Files sửa**: `Header.vue` hoặc tạo Settings page

---

## Phase 7: Streak Counter & Stats

**Goal**: Gamification nhẹ — đếm ngày liên tiếp user học + stats cơ bản.

**Streak logic**: User reveal ít nhất 1 spoiler trong ngày = tính đã học ngày đó.

**Steps**:
1. Tạo `src/composables/useStreak.ts`:
   - `localStorage("streakData")`: `{ currentStreak: number, lastActiveDate: string, longestStreak: number, totalWordsRevealed: number }`
   - `recordActivity()`: gọi khi user reveal spoiler lần đầu trong ngày
   - Logic: so sánh `lastActiveDate` với today → nếu hôm qua → streak++, nếu hôm nay → skip, nếu xa hơn → reset về 1
2. Hook vào spoiler reveal event (watch hoặc emit từ Spoiler component)
3. UI hiển thị streak: icon lửa + số ngày, ở góc hoặc trong Header
4. Optional: trang Stats hiển thị longest streak, total words seen, etc.

**Files mới**: `src/composables/useStreak.ts`
**Files sửa**: component Spoiler (emit event khi reveal), `Header.vue` hoặc tạo Stats widget

---

## Phase 8: Demo Website (Separate Repo)

**Goal**: Landing page demo extension + guided tour (driver.js) + About page. Deploy Vercel.

**Steps**:
1. Tạo repo mới `hello-words-demo` (hoặc tên khác)
2. Scaffold Vue 3 + Vite project
3. Copy UI components từ extension (reuse) → embed vào demo frame
4. Tích hợp `driver.js` (~5kb) cho onboarding guided tour:
   - Step 1: Highlight từ vựng → "Mỗi lần mở tab bạn sẽ thấy 1 từ mới"
   - Step 2: Highlight spoiler → "Click để reveal nghĩa và cách đọc"
   - Step 3: Highlight heart → "Thêm vào learning list"
   - Step 4: Highlight bookmark → "Xem toàn bộ list đã lưu"
   - Step 5: Highlight dark mode → "Chuyển chế độ tối"
5. About page: giới thiệu extension, link Edge Store, tech stack, author
6. Deploy Vercel (connect GitHub repo, auto-deploy on push)

**Scope**: Repo riêng, không ảnh hưởng extension repo hiện tại. Sẽ thực hiện sau khi Phase 1-7 hoàn thành.

---

## Verification

1. Phase 1: Chạy `npm run dev` → visual check light/dark mode, responsive 320px-1280px
2. Phase 2: Toggle giữa Hello Words ↔ Default Tab, verify clock updates, search redirects đúng
3. Phase 3: Import CSV test file + JSON test file → verify random word từ custom dataset, switch back default, delete dataset
4. Phase 4: Quiz — test 3 types + mix mode, score tracking, feedback UI
5. Phase 5: Keyboard shortcuts work on Words page, don't conflict with input fields
6. Phase 6: Export → import trên browser khác → data intact
7. Phase 7: Reveal spoiler → streak tăng, skip 1 ngày → streak reset
8. Phase 8: Deploy Vercel → check guided tour flow, responsive, About page
9. Build extension: `npm run build` → load vào Chrome/Edge → test end-to-end

## Decisions

- UI tone: Warm neutral (beige/cream/brown)
- Default tab: Tự build mini UI (clock + search + shortcuts), không redirect
- Dataset format: Hỗ trợ cả CSV và JSON
- Demo site: Repo riêng + Vercel + driver.js cho guided tour
- Thứ tự ưu tiên: Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
- localStorage cho tất cả data (giữ nguyên philosophy no-backend)
- Phase 2: tabMode KHÔNG persist localStorage — mỗi tab mới luôn show Hello Words (core purpose)
- Phase 4: Quiz mix random 3 types, cần ≥ 4 từ trong dataset
- Phase 7: Streak tính khi user reveal ≥ 1 spoiler/ngày (không quá passive, không quá strict)
