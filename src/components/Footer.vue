<template>
  <div class="footer">
    Made with ❤️ by <a href="https://buymeacoffee.com/trungnd19">trungnd19</a> ©
    2024
  </div>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.7;
}

.footer:hover {
  opacity: 1;
}

@media screen and (max-height: 600px), screen and (max-width: 600px) {
  .footer {
    display: none;
  }
}
</style>
