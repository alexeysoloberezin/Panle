import { ref, onMounted, onBeforeUnmount } from 'vue';

export default function useRealtimeFetcher(action, interval = 5000) {

  const fetch = async () => {
    console.log('fetch')
    await action()
  }

  const startRealtimeUpdates = () => {
    const intervalId = setInterval(fetch, interval);

    // Остановка реального времени обновлений при удалении композиции
    onBeforeUnmount(() => {
      clearInterval(intervalId);
    });
  };

  // Запуск реального времени обновлений при монтировании композиции
  onMounted(startRealtimeUpdates);

  return {

  };
}
