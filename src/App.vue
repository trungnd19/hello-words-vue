<script setup lang="ts">
import MainPage from "./pages/MainPage.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import KeyboardGuide from "./components/KeyboardGuide.vue";
import BackgroundOverlay from "./components/BackgroundOverlay.vue";
import { useDark } from "./stores/useDark";
import { useKeyboard } from "./composables/useKeyboard";
import { useTabMode } from "./composables/useTabMode";

const { isDefaultTab } = useTabMode();

const { setTheme } = useDark();
setTheme();
useKeyboard();
</script>

<template>
  <BackgroundOverlay />
  <Header />
  <MainPage />
  <Footer />
  <KeyboardGuide v-if="!isDefaultTab" />
</template>

<style scoped></style>
