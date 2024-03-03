export const CALL_STATUSES = {
    cancel: 'Контакт отменил звонок',
    answer: 'Контакт ответил',
    not_successful: 'Неуспешный звонок',
    noanswer: "На вызов не ответили",
    busy: "Получен сигнал занято",
    congestion: "Канал перегружен",
    chanunavail: "Канал недоступен"
}
export const CALL_STATUSES_ARRAY = () =>  Object.keys(CALL_STATUSES).map(key => ({ key, name_ru: CALL_STATUSES[key] }))

export const CALL_ACTION = {
    inaction: 'Бездействие',
    answer_machine: 'Автоответчик',
    one: 'Один',
    two: 'Два',
    three: 'Три',
    four: 'Четыре',
    five: 'Пять',
    six: 'Шесть',
    seven: 'Семь',
    eight: 'Восемь',
    nine: 'Девять',
    zero: 'Ноль',
    yes: 'Да',
    no: 'Нет',
}
export const CALL_DIRECTION = {
    incoming: 'Входящий',
    outgoing: 'Исходящий',
}

export const CALL_COMPLETED = {
    contact: 'Контакт',
    system: 'Система',
}

export const SMS_STATUSES = {
    send: 'Отправлено',
    not_deliver: 'Не доставлено',
    expired: 'Не в сети',
    deliver: 'Доставлено',
    read: 'Прочитано',
    partly_deliver: 'Отправлено, но не доставлено'
}
