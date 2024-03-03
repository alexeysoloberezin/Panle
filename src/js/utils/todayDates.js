export function todayDates(){
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Устанавливаем начальное время в 00:00
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 0); // Устанавливаем конечное время в 23:59
  return [today, endOfToday]
}
