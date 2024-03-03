<template>
  <v-card v-if="chartData" class="mt-3 pb-3" :min-height="minH">
    <v-card-text class="pb-0 text-center text-sm text-md-body-1" style="min-height: 66px;">
      Затраты:
    </v-card-text>
    <v-card-title class="d-flex text-center flex-column ">
      <div class="text-h5 text-md-h4">
        {{ chartData }}
      </div>
      <div class="text-sm text-md-body-1 mt-1">
        Рублей
      </div>
    </v-card-title>
  </v-card>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import 'chartjs-adapter-moment';
import ExpensessChart from "@/js/Elastic/variants/ExpensessChart";

const props = defineProps(['url', 'date', 'timeRange', 'userId', 'minH'])
const emit = defineEmits(['update:period'])
const date = ref(props?.date || null)

const message = ref('')

const chartData = ref(null);

const fetchRequest1 = async () => {
  message.value = ''

  const chartD = ExpensessChart.getData(date.value, props?.userId)

  const {error, messageError, data} = await ExpensessChart.fetchData(chartD)

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
