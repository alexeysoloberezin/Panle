<template>
  <div v-resize="onResize" class="pa-5">
    <v-card :key="JSON.stringify(period)" class="pa-4 card-visible position-relative" style="z-index: 100">
      <v-row align-content="center">
        <v-col cols="5">
          <PeriodSelect
            style="margin-top: -13px"
            v-model:date="date"
            v-model:period="period"
          />
        </v-col>
        <v-col cols="3">
          <v-select label="Custom time range" :items="timeRangeItems" v-model="timeRange" item-value="name"
                    item-title="name" variant="underlined">
          </v-select>
        </v-col>
        <v-col cols="2">
          <v-text-field label="UserId" :model-value="userId" @change="(e) => userId = e.target.value"
                        variant="underlined">
          </v-text-field>
        </v-col>
        <v-col cols="2">
          <ChooseGrid
            :grids="gridSystem"
            v-model="activeGridSystem"
          />
        </v-col>
      </v-row>
    </v-card>
    <v-row v-if="Array.isArray(date)"
           :key="JSON.stringify(date) + activeGridSystem + JSON.stringify(windowSize) + JSON.stringify(timeRange) + userId"
           class="mt-1">

      <template v-for="(chart, i) in chars" :key="chars.name">
        <v-col v-if="!devMode ? true : devMode === chart.name"
               :cols="getGridSystem.cols[i] || getGridSystem.cols[getGridSystem.cols.length - 1]"
               :md="getGridSystem.md[i] || getGridSystem.md[getGridSystem.md.length - 1]"
               :sm="getGridSystem.sm[i] || getGridSystem.sm[getGridSystem.sm.length - 1]"
               class="py-1"
        >
          <component
            :is="chart.component"
            :date="date"
            :url="url"
            :providerName="chart?.providerName"
            :providerNameTitle="chart?.providerNameTitle"
            :minH="chart.minH"
            :numberAster="chart?.numberAster"
            :heightProp="height"
            :inPrecent="chart.inPrecent || false"
            :userId="userId"
            :timeRange="timeRange"
            @update:period="changePeriod"
          ></component>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import 'chartjs-adapter-moment';
import '@vuepic/vue-datepicker/dist/main.css'
import zoomPlugin from 'chartjs-plugin-zoom';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  TimeScale,
  PointElement,
  Legend,
  LineElement,
  LineController,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import PeriodSelect from "@/components/ElasticCharts/PeriodSelect.vue";
import CPSChart from "@/components/ElasticCharts/CPSChart.vue";
import SecDialogChart from "@/components/ElasticCharts/SecDialogChart.vue";
import ExpensessChart from "@/components/ElasticCharts/ExpensessChart.vue";
import ColAnswer from "@/components/ElasticCharts/ColAnswer.vue";
import StatusCallChart from "@/components/ElasticCharts/StatusCallChart.vue";
import StatusCallChartPrecent from "@/components/ElasticCharts/StatusCallChartPrecent.vue";
import AutoBotColChart from "@/components/ElasticCharts/AutoBotColChart.vue";
import AutoBotColChartPrecent from "@/components/ElasticCharts/AutoBotColChartPrecent.vue";
import ErrorDetectChart from "@/components/ElasticCharts/ErrorDetectChart.vue";
import CallsAllChart from "@/components/ElasticCharts/CallsAllChart.vue";
import ElasticCharts from "@/js/Elastic/ElasticCharts";
import ChooseGrid from "@/components/ElasticCharts/ChooseGrid.vue";
import AsterChart from "@/components/ElasticCharts/AsterChart.vue";
import TimeZone from "@/components/ElasticCharts/TimeZone.vue"
import Operators from "@/components/ElasticCharts/Operators.vue";
import AllCalls from "@/components/ElasticCharts/AllCalls.vue"
import JustCalls from "@/components/ElasticCharts/JustCalls.vue";

const url = 'http://es-cl001-node05.local.rk-env.ru:9200'

// тут можно вписать имя для показа одного графика
const devMode = false

const smallCardH = '160px'
const bigCardH = 220
const chars = [
  {
    component: SecDialogChart,
    minH: smallCardH,
    name: 'SecDialogChart',
  },
  {
    component: ExpensessChart,
    minH: smallCardH,
    name: 'ExpensessChart',
  },
  {
    component: CallsAllChart,
    minH: smallCardH,
    name: 'CallsAllChart',
  },
  {
    component: ColAnswer,
    minH: smallCardH,
    name: 'ColAnswer',
  },
  {
    component: TimeZone,
    name: 'TimeZone',
  },
  {
    component: AllCalls,
    name: 'AllCalls',
  },
  {
    component: Operators,
    name: 'Operators',
  },
  {
    component: CPSChart,
    name: 'CPSChart',
  },
  {
    component: StatusCallChart,
    name: 'StatusCallChart',
  },
  {
    component: StatusCallChartPrecent,
    name: 'StatusCallChartPrecent',
  },
  {
    component: AutoBotColChart,
    name: 'AutoBotColChart',
  },
  {
    component: AutoBotColChartPrecent,
    name: 'AutoBotColChartPrecent',
  },
  {
    component: ErrorDetectChart,
    name: 'ErrorDetectChart',
  },
  {
    component: JustCalls,
    providerName: "ПАО \"МегаФон\"",
    providerNameTitle: "МФ",
    name: 'JustCalls_MF',
  },
  {
    component: JustCalls,
    providerName: "ПАО \"МТС\"",
    providerNameTitle: "МТС",
    name: 'JustCalls_MTS',
  },
  {
    component: JustCalls,
    providerName: "ПАО \"ВЫМПЕЛКОМ\"",
    providerNameTitle: "Билайн",
    name: 'JustCalls_Billine',
  },
  {
    component: JustCalls,
    providerName: "ООО \"Т2 Мобайл\"",
    providerNameTitle: "Теле2",
    name: 'JustCalls_Tele2',
  },
  {
    component: AsterChart,
    inPrecent: false,
    numberAster: '001',
    name: 'AsterChart',
  },
  {
    component: AsterChart,
    inPrecent: true,
    numberAster: '001',
    name: 'AsterChartPrecent',
  },
  {
    component: AsterChart,
    inPrecent: false,
    numberAster: '002',
    name: 'AsterChart',
  },
  {
    component: AsterChart,
    inPrecent: true,
    numberAster: '002',
    name: 'AsterChartPrecent',
  },
  {
    component: AsterChart,
    inPrecent: false,
    numberAster: '003',
    name: 'AsterChart',
  },
  {
    component: AsterChart,
    inPrecent: true,
    numberAster: '003',
    name: 'AsterChartPrecent',
  },
]

const period = ref(null)
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  zoomPlugin,
  TimeScale,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const isGrid = ref('inline')
const cols = computed(() => isGrid.value === 'grid' ? '4' : '12')
const date = ref(null)
const userId = ref(null)
const windowSize = ref(window.innerWidth)
const elastic = new ElasticCharts()


const onResize = elastic.debounce(() => {
  windowSize.value = window.innerWidth
}, 500)

const customPer = (period) => {
  period.value = period
}

const changePeriod = (dates) => {
  period.value = 'custom'
  date.value = dates
}

const activeGridSystem = ref(0)
const gridSystem = [
  {
    cols: [6, 6, 6, 6, 12],
    md: [3, 3, 3, 3, 6],
    sm: [6, 6, 6, 6, 4],
    height: bigCardH,
  },
  {
    cols: [6, 6, 6, 6, 12],
    md: [3, 3, 3, 3, 12],
    sm: [6, 6, 6, 6, 12],
    height: bigCardH,
  },
  {
    cols: [6, 6, 6, 6, 12],
    md: [3, 3, 3, 3, 6],
    sm: [6, 6, 6, 6, 6],
    height: bigCardH,
  },
  {
    cols: [6, 6, 6, 6, 12],
    md: [3, 3, 3, 3, 3],
    sm: [6, 6, 6, 6, 6],
    height: bigCardH,
  },
  {
    cols: [6, 6, 6, 6, 12],
    md: [6, 6, 6, 6, 12],
    sm: [6, 6, 6, 6, 12],
    height: bigCardH,
  },
]
const getGridSystem = computed(() => {
  return gridSystem[activeGridSystem.value || 0]
})
const height = computed(() => {
  return gridSystem[activeGridSystem.value || 0].height
})

const timeRange = ref('auto')
const timeRangeItems = [
  {
    name: 'auto',
    fetchName: 'auto',
    value: 'auto'
  },
  {
    name: '1m',
    fetchName: '1m',
    value: elastic.TIME_INTERVALS_IN_MILISEC.ONE_MINUTES
  },
  {
    name: '5m',
    fetchName: '5m',
    value: elastic.TIME_INTERVALS_IN_MILISEC.FIVE_MINUTES
  },
  {
    name: '10m',
    fetchName: '10m',
    value: elastic.TIME_INTERVALS_IN_MILISEC.TEN_MINUTES
  },
  {
    name: '30m',
    fetchName: '30m',
    value: elastic.TIME_INTERVALS_IN_MILISEC.THIRTY_MINUTES
  },
  {
    name: '1h',
    fetchName: '1h',
    value: elastic.TIME_INTERVALS_IN_MILISEC.ONE_HOUR
  },
  {
    name: '3h',
    fetchName: '3h',
    value: elastic.TIME_INTERVALS_IN_MILISEC.THREE_HOURS
  },
  {
    name: '12h',
    fetchName: '12h',
    value: elastic.TIME_INTERVALS_IN_MILISEC.TWENTY_HOURS
  },
  {
    name: '1d',
    fetchName: '1d',
    value: elastic.TIME_INTERVALS_IN_MILISEC.TWENTY_FORE_HOURS
  },
]

const show = ref(false)
const chartData = ref({
  type: 'bar',
  labels: [],

  datasets: [
    {
      label: 'Count of records',
      backgroundColor: '#3498db',
      data: [],
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Количество с распределением общее',
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: false,
        },
        pinch: {
          enabled: true
        },
        mode: 'x',
      }
    }
  },
  scales: {
    x: {
      type: 'time', // Correct type for time scale
      time: {
        unit: 'minute',
        tooltipFormat: 'DD MMM HH:mm', // Adjust the format as needed
        displayFormats: {
          minute: 'MMM DD HH:mm', // Adjust the display format as needed
        },
      },
      position: 'bottom',
      title: {
        display: true,
        text: 'Time',
      },
    },
    y: {
      type: 'linear',
      position: 'left',
      title: {
        display: true,
        text: 'Count of records',
      },
    },
  },
};

const fetchAll = () => {
  fetchRequest1()
}
const fetchRequest1 = async () => {
  const data = {
    "aggs": {
      "0": {
        "terms": {
          "field": "result.keyword",
          "order": {
            "_count": "desc"
          },
          "size": 5
        },
        "aggs": {
          "1": {
            "date_histogram": {
              "field": "dt_call_start",
              "fixed_interval": "10m",
              "time_zone": "Asia/Singapore"
            }
          }
        }
      }
    },
    "size": 0,
    "fields": [
      {
        "field": "@timestamp",
        "format": "date_time"
      },
      {
        "field": "dt_call_end",
        "format": "date_time"
      },
      {
        "field": "dt_call_start",
        "format": "date_time"
      },
      {
        "field": "dt_conv_start",
        "format": "date_time"
      },
      {
        "field": "end",
        "format": "date_time"
      },
      {
        "field": "start",
        "format": "date_time"
      }
    ],
    "script_fields": {},
    "stored_fields": [
      "*"
    ],
    "runtime_mappings": {},
    "_source": {
      "excludes": []
    },
    "query": {
      "bool": {
        "must": [],
        "filter": [
          {
            "range": {
              "dt_call_start": {
                "format": "strict_date_optional_time",
                "gte": Array.isArray(date.value) && date.value.length > 1 ? date.value[0] : "",
                "lte": Array.isArray(date.value) && date.value.length > 1 ? date.value[1] : ""
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    }
  };

  try {
    const response = await axios.post(
      'http://es-cl001-node05.local.rk-env.ru:9200/robot-ivr-cdr/_search',
      data
    );

    if (response.data) {
      const buckets = response.data.aggregations['0'].buckets[0]['1'].buckets;

      chartData.value = {
        labels: buckets.map((bucket) => new Date(bucket.key_as_string)),
        datasets: [
          {
            label: 'Count of records',
            backgroundColor: '#3498db',
            data: buckets.map((bucket) => bucket.doc_count),
          },
        ],
      };

      show.value = true;
    }
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  fetchAll()
});
onBeforeMount(async () => {
  period.value = 'today'
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Устанавливаем начальное время в 00:00
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 0); // Устанавливаем конечное время в 23:59
  date.value = [today, endOfToday]
})
</script>
