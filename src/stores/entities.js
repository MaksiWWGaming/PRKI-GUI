import { ref } from "vue";
import { defineStore } from "pinia";

export const useEntitiesStore = defineStore("entities", () => {
  // State
  const entities = ref([]);

  // Sample initial data
  const initialEntities = [];

  // Initialize store
  function initializeStore() {
    const storedEntities = localStorage.getItem("vue_app_entities");
    if (storedEntities) {
      entities.value = JSON.parse(storedEntities);
    } else {
      entities.value = [...initialEntities];
      localStorage.setItem("vue_app_entities", JSON.stringify(entities.value));
    }
  }

  return {
    // State
    entities,

    // Actions
    initializeStore,
  };
});