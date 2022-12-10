import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      openState: true,
    };
  },
  actions: {
    reverseOpenState() {
      this.openState = !this.openState;
    },
  },
});
