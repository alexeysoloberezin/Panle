// localstorage.js

import { ref, onMounted } from 'vue';

function useLocalStorage(key, initialValue) {
  const value = ref(initialValue);

  const loadFromLocalStorage = () => {
    const item = localStorage.getItem(key);
    if (item) {
      value.value = JSON.parse(item);
    }
  };

  onMounted(() => {
    loadFromLocalStorage();
  });

  const saveToLocalStorage = () => {
    localStorage.setItem(key, JSON.stringify(value.value));
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(key);
    value.value = initialValue;
  };

  watch(value, () => {
    localStorage.setItem(key, JSON.stringify(value.value));
  });

  return {
    value,
    saveToLocalStorage,
    clearLocalStorage,
  };
}

export default useLocalStorage;
