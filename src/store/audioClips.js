import {request} from "@/js/utils/actions/request";
import {endpoints} from "@/js/utils/actions/endpoints";
import makeDateParams from "@/js/utils/makeDateParams";

export const useAudioClipsStore = defineStore('audioClips', () => {
  const audioClips = ref({})
  const orderList = ref([])
  const pagination = ref({
    count: 0,
    perPage: 0
  })
  const loading = ref(false)

  const setAudioClips = ({entities, count, offset} = {
    entities: [],
    offset: 0,
    count: 0
  }) => {
    $reset();

    pagination.value = {
      count,
      perPage: offset
    }

    orderList.value = entities.map(item => item.id)
    entities.forEach(item => {
      audioClips.value[item.id] = item
    })
  }

  const getAudioClips = computed(() => {
    return audioClips.value;
  })

  const getAudioClipsSorted = computed(() => {
    return orderList.value.map(el => audioClips.value[el])
  })

  const loadAudioClips = async (
    {text, sortBySelected, status, date, page} = {text: '', sortBySelected: '', status: '', date: [], page: 1}
  ) => {
    loading.value = true

    try {
      const res = await request({
        method: 'get',
        url: endpoints.audioClips.LOAD_AUDIO_LISTS,
        params: makeDateParams({
          page,
          date,
          status,
          title: text,
          order: sortBySelected,
        })
      });

      if (res.status === 200) {
        setAudioClips(res.data)
      }
    }catch (err){
    }finally {
      loading.value = false
    }
  }


  const $reset = () => {
    audioClips.value = {}
    orderList.value = []
    pagination.value = {
      count: 0,
      perPage: 0
    }
  }

  return {audioClips, setAudioClips,  orderList, $reset,pagination, loading, getAudioClips, loadAudioClips, getAudioClipsSorted}
})
