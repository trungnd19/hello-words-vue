<script setup lang="ts">
import Words from "./components/Words.vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import { useDark } from "./stores/useDark";

const { setTheme } = useDark();
setTheme();
</script>

<template>
  <Header />
  <Words />
  <Footer />
</template>

<style scoped></style>
