import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import { scenarios } from "@/js/utils/actions/endpoints/scenarios";
import { preventMultipleUse } from "@/js/utils/helpers";
import makeDateParams from "@/js/utils/makeDateParams";

export const useScenariosStore = defineStore('scenarios', () => {
    const scenarios = ref({})
    const orderList = ref([])
    const pagination = ref({
        count: 0,
        perPage: 0
    })
    const loading = ref(false)

    const setScenario = (item) => {
        if (item?.id) {
            scenarios.value[item.id] = item;
        }
    }

    const setScenarios = ({entities, count, offset} = {
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
            scenarios.value[item.id] = item
        })
    }


    const getScenarios = computed(() => {
        return scenarios.value;
    })

    const getScenariosSorted = computed(() => {
        return orderList.value.map(el => scenarios.value[el])
    })

    const loadScenarios = async (
      {text, sortBySelected, status, date, page} = {text: '', sortBySelected: '', status: '', date: [], page: 1}
    ) => {
        await preventMultipleUse(loadScenarios, async () => {
            loading.value = true

            try {
                const res = await request({
                    method: 'get',
                    url: endpoints.scenarios.LOAD_SCENARIOS_LIST,
                    params: makeDateParams({
                        page,
                        date,
                        status,
                        title: text,
                        order: sortBySelected,
                    })
                });

                if (res.status === 200) {
                    setScenarios(res.data)
                }
            }catch (err){
            }finally {
                loading.value = false
            }
        })
    }

    const loadList = async (id) => {
        const res = await request.get(endpoints.scenarios.VIEW_LIST(id));
        if (res.status === 200) {
            await setScenario(res.data)
        }
    }

    const $reset = () => {
        scenarios.value = {}
        orderList.value = []
        pagination.value = {
            count: 0,
            perPage: 0
        }
    }

    return { scenarios,orderList, setScenarios,$reset,pagination, loading, getScenariosSorted, getScenarios, loadScenarios, loadList }
})
