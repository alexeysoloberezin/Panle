<template>
  <v-card v-if="chartData" class="mt-3 pb-3" :min-height="minH">
    <v-card-text style="min-height: 66px;" class="pb-0 px-1 text-center text-sm text-md-body-1">
      Количество секунд диалога:
    </v-card-text>
    <v-card-title class="d-flex text-center flex-column ">
      <div class="text-h5 text-md-h4">
        {{ chartData }}
      </div>
      <div class="text-sm text-md-body-1 mt-1">
        секунд
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
import CPSChart from "@/js/Elastic/variants/CPSChart";
import SecDialogChart from "@/js/Elastic/variants/SecDialogChart";

const props = defineProps(['url', 'date', 'timeRange', 'userId', 'minH'])
const emit = defineEmits(['update:period'])
const date = ref(props?.date || null)

const message = ref('')

const chartData = ref(null);

const fetchRequest1 = async () => {
  message.value = ''

  const chartD = SecDialogChart.getData(date.value, props?.userId)

  const {error, messageError, data} = await SecDialogChart.fetchData(chartD)

  if (error) {
    message.value = messageError
  } else {
    chartData.value = data
  }
}

onMounted(async () => {
  fetchRequest1()
});
</script>
