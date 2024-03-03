<script setup>
import { useToast } from "vue-toastification";
import { initToggle } from "@/composable/toggle";
import { dateToString } from "@/js/utils/ui/dateString";
import CallLogModal from "@/views/pages/Campaigns/CallLogModal.vue";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const toast = useToast()
const router = useRouter()
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  value: {
    type: Boolean
  },
  campaign: {
    type: Object
  }
})
const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})
const isOpenCallLog = ref(false)
const currentItem = ref(null)

// Functions
const {t} = useI18n()
const openCallLog = (item) => {
  currentItem.value = item;
  isOpenCallLog.value = true;
}
const headers = reactive([
  {
    name: t('table.id'),
    key: 'id',
  },
  {
    name: t('table.title'),
    key: 'title',
    classes: 'text-center'
  },
])

</script>

<template>
  <VDialog
    v-model="isOpen"
    scrollable
    width="512">
    <VCard class="Vertical">
      <VCardTitle>Журнал прозвонов</VCardTitle>
      <VCardText>

        <TableWrapper :items="campaign.callsListLog || []"
                      :hide-fields="['search', 'date', 'status', 'sortBy', 'fieldsTable']"
                      :headers="headers"
                      :table-name="'campaignListLogModal'"
        >
          <template #body="{ data }">
            <VTable fixed-header height="300">
              <thead>
              <tr>
                <th v-for="head in headers" :key="head.key">
                  {{ head.name }}
                </th>
              </tr>
              </thead>

              <tbody>
              <tr
                class="base-table__tr"
                v-for="item in data.items"
                :key="item.id"
                @click="openCallLog(item)"
              >
                <td class="base-table__td">
                  {{ item.id }}
                </td>
                <td class="base-table__td">
                  {{ dateToString(item.createdAt) }}
                </td>
              </tr>
              </tbody>
            </VTable>
          </template>
        </TableWrapper>


      </VCardText>
    </VCard>

    <CallLogModal v-if="isOpenCallLog" v-model="isOpenCallLog" :item="currentItem" :campaign="campaign"/>
  </VDialog>
</template>
