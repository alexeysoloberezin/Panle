import {createI18n} from "vue-i18n/dist/vue-i18n";

export const langs = {
  'en-US': 'en',
  'ru-RU': "ru"
}

class I18Core {
  getLang(){
    const userLanguage = navigator.language || navigator.userLanguage;
    return langs[userLanguage] || 'ru'
  }
  getInstance(){
    let data =  localStorage.getItem('locales')
    let activeLocale =  localStorage.getItem('activeLocale')
    if(data){
      data = JSON.parse(data)
    }else{
      data = {}
    }

    return createI18n({
      locale: activeLocale || this.getLang(),
      fallbackLocale: 'en',
      legacy: false,
      messages: {
        ru: {},
        en: {},
        ...data,
      }
    })
  }

  copyObject(obj) {
    const result = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Рекурсивно копируем вложенные объекты
        result[key] = this.copyObject(obj[key]);
      } else {
        // Задаем пустую строку для всех значений
        result[key] = '';
      }
    }
    return result;
  }
}

const core = new I18Core()
export default core;
