<template>
  <v-card v-if="Array.isArray(date)" class="mt-3 pa-3" >
    <div v-if="!message">
      <Bar :type="'bar'" :data="chartData" :options="chartOptions" :height="heightProp"/>
    </div>
    <div v-else>
      {{ message }}
    </div>
  </v-card>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {Bar} from 'vue-chartjs';
import 'chartjs-adapter-moment';
import zoomPlugin from 'chartjs-plugin-zoom';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  TimeScale,
  PointElement,
  Legend,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ElasticCharts from "@/js/Elastic/ElasticCharts";
import AutoBotColChart from "@/js/Elastic/variants/AutoBotColChart";
import TimeZone from "@/js/Elastic/variants/TimeZone";
import Operators from "@/js/Elastic/variants/Operators";
import AllCalls from "@/js/Elastic/variants/AllCalls";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  zoomPlugin,
  TimeScale,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const ElasticChart = new ElasticCharts()

const props = defineProps(['url', 'date', 'timeRange', 'userId', 'heightProp'])
const emit = defineEmits(['update:period'])
const date = ref(props?.date || null)

const message = ref('')

const chartData = ref({
  type: 'line',
  labels: [],
  datasets: [
    {
      label: 'Count of records',
      backgroundColor: '#3498db',
      data: [],
    },
  ],
});

const onZoomDebounced = ElasticChart.debounce(function ({chart}) {
  const minX = chart.scales['x'].min;
  const maxX = chart.scales['x'].max;
  emit('update:period', [new Date(minX).toISOString(), new Date(maxX).toISOString()])
}, 1100);

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Распределение статусов по звонкам ВСЕ',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let value = context.dataset.data[context.dataIndex];
          const label = context.dataset.label;
          return label + ': ' + value + ' %';
        },
      },
    },
    zoom: {
      zoom: {
        onZoom: onZoomDebounced,
        wheel: {
          enabled: false,
        },
        drag: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'x',
      },
    },
  },
  scales: {
    x: {
      position: 'left',
    },
    y: {
      type: 'linear',
      position: 'left',
      beginAtZero: true,
      title: {
        display: true,
        text: ' %',
      },
      max: 100,
      callback: function(value){return value+ "%"}
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
};

const fetchRequest1 = async () => {
  message.value = ''

  const chartD = AllCalls.getData(date.value, props?.timeRange, props?.userId)

  const {error, messageError, data} = await AllCalls.fetchData(chartD, true)

  if(error){
    message.value = messageError
  }else{
    chartData.value = {...data}
  }
}


onMounted(async () => {
  fetchRequest1()
});
</script>
