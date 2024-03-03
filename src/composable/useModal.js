import { ref, watch, onMounted } from 'vue';

// Создаем composable
export const useModal = (initialState = false) => {
  // Используем ref для отслеживания состояния модального окна
  const isOpen = ref(initialState);

  // Метод для открытия модального окна
  const openModal = () => {
    isOpen.value = true;
  };

  // Метод для закрытия модального окна
  const closeModal = () => {
    isOpen.value = false;
  };

  // Выводим состояние модального окна в консоль при изменении
  watch(isOpen, (newValue) => {
    console.log(`Модальное окно: ${newValue ? 'открыто' : 'закрыто'}`);
  });

  // Выполняем что-то при монтировании компонента (может потребоваться в зависимости от вашего случая использования)
  onMounted(() => {
    console.log('Композиция модального окна монтирована');
  });

  // Возвращаем объект с методами и состоянием
  return {
    isOpen,
    openModal,
    closeModal,
  };
};
