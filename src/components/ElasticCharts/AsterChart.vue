<template>
  <v-card v-if="Array.isArray(date)" class="mt-3 pa-3">
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
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
import AsterChart from "@/js/Elastic/variants/AsterChart";

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

const props = defineProps(['url', 'date', 'timeRange', 'userId', 'heightProp', 'inPrecent', 'numberAster'])
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

const max = props.isPrecent ? {max: 100} : {}
const chartOptions = {
  responsive: true,
  plugins: {
    datalabels: {
      display: false,
      listeners: {
        enter: function (context, event) {
          debugger
          // Highlight the bar when entering
          console.log('enter')
          const index = context.dataIndex;
          highlightBars(index, true);
          return true
        },
        leave: function (context, event) {
          // Remove the highlight when leaving
          console.log('leave')
          const index = context.dataIndex;
          highlightBars(index, false);
          return true
        }
      },
    },
    title: {
      display: true,
      text: `Статусы по звонкам aster ${props?.numberAster} ` + (props.inPrecent ? 'в процентах %' : '')
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.dataset.data[context.dataIndex];

          // Проверка, является ли value числом
          const label = context.dataset.label;
          return label + ': ' + value + (props.inPrecent ? ' %' : '');

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
      max: props.inPrecent ? 100 : null,
      callback: function (value) {
        return value + props?.inPrecent ? "%" : ''
      }
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
};

function highlightBars(index, highlight) {
  // Assuming you have a reference to your chart instance, let's call it 'myChart'
  const chartInstance = chartData.value;

  // Iterate through all datasets and highlight the corresponding bar
  chartInstance.data.datasets.forEach(dataset => {
    dataset.backgroundColor[index] = highlight ? 'blue' : '#3498db';
  });

  // Update the chart to reflect the changes
  chartInstance.update();
}

const fetchRequest1 = async () => {
  message.value = ''

  const chartD = AsterChart.getData(date.value, props?.timeRange, props?.userId, props?.numberAster)

  const {error, messageError, data} = await AsterChart.fetchData(chartD, props?.inPrecent)

  if (error) {
    message.value = messageError
  } else {
    chartData.value = {...data}
  }
}


onMounted(async () => {
  fetchRequest1()
});
</script>
