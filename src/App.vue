<script setup lang="ts">
import MainPage from "./components/MainPage.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import { useDark } from "./stores/useDark";

const { setTheme } = useDark();
setTheme();
</script>

<template>
  <Header />
  <MainPage />
  <Footer />
</template>

<style scoped></style>
