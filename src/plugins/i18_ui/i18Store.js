import {useI18n} from "vue-i18n/dist/vue-i18n";
import {request} from "@/js/utils/actions/request";
import {useStorage} from '@vueuse/core'
import {useToast} from "vue-toastification";
import I18Core from "@/plugins/i18_ui/i18Core";
import {downloadJson} from "@/js/utils/actions/downloadFile";

const toast = useToast()

export const useI18Store = defineStore('I18Store', () => {
  const locales = useStorage('locales', null, undefined, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  })
  const i18n = useI18n()

  const activeLocale = useStorage('activeLocale', null)
  const saveLoading = ref(false)

  const availableLocales = computed(() => {
    if (!locales.value) return []
    return Object.keys(locales.value).map(key => ({
      key,
      name: locales.value[key]?.langSettings?.label || key
    }))
  })

  const readJsonFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        locales.value = JSON.parse(e.target.result)
      } catch (error) {
        console.error('Ошибка чтения файла:', error);
      }
    };
    reader.readAsText(file);
  }

  const setGetLocales = async (value) => {
    if(value){
      readJsonFile(value)
    }else{
      await downloadJson(locales.value, 'locales.json')
      return locales.value
    }
  }

  const fetchLocales = async () => {
    try {
      const res = await request.get('/settings/get-value?name=i18n')
      if (res.status === 200 || res.status === 201) {
        locales.value = res.data
        const keys = Object.keys(res.data)

        keys.forEach(locale => {
          i18n.availableLocales.push(locale)
          i18n.setLocaleMessage(locale, res.data[locale]);
        });

        if (!activeLocale.value) {
          activeLocale.value = I18Core.getLang()
        }
      }
    } catch (err) {
      console.log('err', err)
    }
  }

  const saveLocales = async () => {
    saveLoading.value = true
    try {
      const res = await request.post('/settings/set', {
        name: 'i18n',
        value: locales.value
      })
      if (res.status === 200 || res.status === 201) {
        toast.success(i18n.t('notifications.saved'))
      }

    } catch (err) {

    } finally {
      saveLoading.value = false
    }
  }

  const addLocaleString = ({name, key}) => {
    if (!locales.value) {
      return;
    }

    const obj = locales.value[activeLocale.value]

    const copy = I18Core.copyObject(obj)

    locales.value[key] = {
      ...copy,
      langSettings: {
        label: name
      }
    }
  }

  const deleteLocales = (key) => {
    const pass = prompt('Пароль?')
    if (pass === 'qaz') {
      delete locales.value[key]
    } else {
      toast.error('Пароль не корректный!')
    }
  }

  const addTextInBox = (parent, key) => {
    const keyName = prompt('Имя ключа')

    function getLocalizedValue(path, loc) {
      if (!path) {
        return null
      }

      const keys = path.split(',');
      let value = locales.value[loc];

      for (const key of keys) {
        if (value && value.hasOwnProperty(key)) {
          value = value[key];
        } else {
          return 'Key not found';
        }
      }

      return value;
    }

    if (keyName) {
      availableLocales.value.forEach(loc => {
        const res = getLocalizedValue(parent, loc.key)
        if (!res) {
          locales.value[loc.key][key][keyName] = ''
        } else {
          res[key][keyName] = ''
        }
      })
    }
  }

  return {
    locales,
    activeLocale,
    deleteLocales,
    setGetLocales,
    addTextInBox,
    fetchLocales,
    availableLocales,
    addLocaleString,
    saveLocales
  }
})
