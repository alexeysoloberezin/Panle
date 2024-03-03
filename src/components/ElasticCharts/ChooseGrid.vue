<template>
  <v-dialog fullscreen>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="outlined" text="Отображение"> </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-btn
          text="Close Dialog"
          variant="outlined"
          class="mx-4"
          @click="isActive.value = false"
        ></v-btn>
        <h2 class="mx-4 mt-2">Вы можете выбрать отображения графиков</h2>
        {{ getGrid }}
        <div v-for="(grid, k) in getGrid" :key="k" class="pa-4">
          <div class="d-flex align-center gap-3 mb-2">
            <h3 >Тип {{ k + 1 }}</h3>
            <v-checkbox v-model="value" :value="k"></v-checkbox>
          </div>
          <v-row  >
            <v-col v-for="(col, i) in grid.cols" :cols="grid.cols[i]" :md="grid.md[i]" :sm="grid.sm[i]">
              <div style="background: rgba(38,81,128,0.32)" class="text-center pa-2 rounded">
                {{ i + 1 }}
              </div>
            </v-col>
          </v-row>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close Dialog"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  grids: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  }
})
const emit = defineEmits('update:modelValue')

const getGrid = computed(() => {
  return props.grids.map(grid => {
    return {
      ...grid,
      md: grid.md.concat(Array(6).fill(grid.md[grid.md.length - 1])),
      sm: grid.sm.concat(Array(6).fill(grid.sm[grid.sm.length - 1])),
      cols: grid.cols.concat(Array(6).fill(grid.cols[grid.cols.length - 1]))
    }
  })
})

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>

</style>
