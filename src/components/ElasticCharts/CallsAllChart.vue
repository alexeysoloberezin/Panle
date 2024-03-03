<template>
  <v-card v-if="chartData" class="mt-3 pb-3" :min-height="minH">
    <v-card-text class="pb-0 text-center text-sm text-md-body-1" style="min-height: 66px;">
      Количество Попыток:
    </v-card-text>
    <v-card-title class="d-flex text-center flex-column ">
      <div class="text-h5 text-md-h4">
        {{ chartData }}
      </div>
      <div class="text-sm text-md-body-1 mt-1">
        попытки
      </div>
    </v-card-title>
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
import CallsAllChart from "@/js/Elastic/variants/CallsAllСhart";

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

const props = defineProps(['url', 'date', 'timeRange', 'userId', 'minH'])
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
      text: 'Звонки'
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
      type: 'time',
      min: new Date(props.date[0]),
      max: new Date(props.date[1]),
      time: {
        unit: ElasticChart.calculateInterval(props.date, props?.timeRange, false, true).unit,
        tooltipFormat: 'DD MMM HH:mm',
        displayFormats: {
          minute: ElasticChart.getTimeFormat(props.date, props?.timeRange),
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
      beginAtZero: true,
      title: {
        display: true,
        text: 'Количество',
      },
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

  const allTry = new CallsAllChart()
  const chartD = allTry.getData(date.value, props?.userId)

  const {error, messageError, data} = await allTry.fetchData(chartD)

  if(error){
    message.value = messageError
  }else{
    chartData.value = data
  }
}


onMounted(async () => {
  fetchRequest1()
});
</script>
