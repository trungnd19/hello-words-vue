import { readonly, ref } from "vue";

// global state, created in module scope
const isFavouritePage = ref(false);

export function useRoutePage() {
  function navigateToFavouriteList() {
    isFavouritePage.value = true;
  }

  function navigateToWord() {
    isFavouritePage.value = false;
  }

  return {
    isFavouritePage: readonly(isFavouritePage),
    navigateToFavouriteList,
    navigateToWord,
  };
}
