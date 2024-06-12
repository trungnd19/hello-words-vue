<script setup lang="ts">
import Words from "./components/Words.vue";
import DarkModeBtn from "./components/DarkModeBtn.vue";
import Footer from "./components/Footer.vue";

import { useDark } from "./stores/useDark";

const { setTheme } = useDark();
setTheme();
</script>

<template>
  <DarkModeBtn />
  <Words />
  <Footer />
</template>

<style scoped></style>
