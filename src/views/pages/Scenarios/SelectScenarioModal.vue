<script setup>
import { initToggle } from "@/composable/toggle";
import { useScenariosStore } from "@/store/scenarios";
import ScenariosListTable from "@/views/pages/Scenarios/ScenariosListTable.vue";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";

const props = defineProps({
  value: {
    type: Boolean
  }
})
const emit = defineEmits(['update:modelValue', 'scenario:selected'])
const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})
onMounted(() => {
  loadScenarios();
})



const storeScenario = useScenariosStore()
const pagination = computed(() => storeScenario.pagination)
const loading = computed(() => storeScenario.loading)
// Functions

const loadScenarios = async (params = {}) => {
  await storeScenario.loadScenarios({...params, status: 'active'});
}

const handleSelectScenario = (id) => {
  emit('scenario:selected', id)
  isOpen.value = false;
}

const headers = reactive(tableWrapperDefaultValues().headersSmall)
</script>

<template>
  <VDialog
    v-model="isOpen"
    width="auto">
    <VCard>
      <VCardTitle>{{ $t('data.helpers.chooseScenarios') }}</VCardTitle>
      <VCardText>
        <VRow>
          <TableWrapper :items="storeScenario.getScenariosSorted"
                        :lazy-pagination="true"
                        :lazy-options="pagination"
                        :hide-fields="['search', 'date', 'status', 'sortBy', 'fieldsTable']"
                        :loading="loading"
                        @update:refreshTable="loadScenarios"
                        :search-label="$t('form.searchByPhoneAndCompany')"
                        :headers="headers"
                        :table-name="'ScenarioModal'"
          >
            <template #body="{ data }">
              <ScenariosListTable
                :items="data.items"
                :headers="data.headers"
                @click:item="handleSelectScenario"
              />
            </template>
          </TableWrapper>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
