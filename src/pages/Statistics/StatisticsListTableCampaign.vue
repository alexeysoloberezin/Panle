<script setup>
import GlobalEvents, { EVENTS } from "@/js/utils/globalEvents";
import { dateToString } from "@/js/utils/ui/dateString";
import {useCampaignStore} from "@/store/campaign";

const props = defineProps({
  items: [Array, Object],
  status: String,
  hideActions: Boolean,
  headers: [Array, Object]
})
const emit = defineEmits(['change:status', 'click:start-call', 'click:add-contacts', 'click:item'])
const router = useRouter()
const storeCampaign = useCampaignStore()
const campaignIds = computed(() => storeCampaign.campaignIds)
const statuses = {}
// const statuses = STATUSES_CALL_NAMES()
// todo
const handleClick = (id) => {
  emit('click:item', id)
}

const handleChangeStatus = (data) => {
  GlobalEvents.emit(EVENTS.OPEN_CONFIRMATION, {
    callback() {
      emit('change:status', data)
    }
  })
}

const isHeaderVisible = (key) => {
  if(props.headers === undefined) return true;
  return props.headers.find(header => header.key === key)
}

const goToCampaign = (id) => {
  router.push('/campaign/view/' + id)
}
</script>

<template>
  <div class="table-wrapper">
    <VTable >
      <thead>
      <tr>
        <th v-for="head in headers" :key="head.key"
            style="text-align: start !important"
        >
          {{ head.name }}
        </th>
      </tr>
      </thead>

      <tbody>
      <template
        v-for="item in items"
        :key="item.id"
      >
        <tr
          class="base-table__tr"
          @click="goToCampaign(item.listLog?.campaign.id)"
        >
          <td v-if="isHeaderVisible('title')" class="base-table__td">
            {{ item.listLog?.campaign.title || '-' }}
          </td>
          <td v-if="isHeaderVisible('updatedAt')" class=" base-table__td">
            {{ item.listLog?.campaign?.updatedAt
                ? dateToString(item.listLog?.campaign?.updatedAt)
                : '-'
            }}
          </td>
          <td v-if="isHeaderVisible('status')" class=" base-table__td">
            {{ item.listLog?.campaign.statusCall
              ? statuses[item.listLog.campaign.statusCall]
              : '-'
            }}
          </td>
          <td v-if="isHeaderVisible('totalCostCampaign')" class=" base-table__td">
            {{ item.totalCostCampaign ? item.totalCostCampaign + ' руб.' : '-'}}
          </td>
          <td v-if="isHeaderVisible('amountCalls')" class=" base-table__td">
            {{ item.amountCalls || '-' }}
          </td>
          <td  v-if="isHeaderVisible('amountCallsTime')" class=" base-table__td">
            {{ item.amountCallsTime ? (item.amountCallsTime / 60).toFixed(2) : '-' }}
          </td>
          <td  v-if="isHeaderVisible('amountAnswer')" class=" base-table__td">
            {{ item.amountAnswer || '-' }}
          </td>
          <td  v-if="isHeaderVisible('amountAction1')" class=" base-table__td">
            {{ item.amountAction1 || '-' }}
          </td>
          <td  v-if="isHeaderVisible('amountAction2')" class="base-table__td">
            {{ item.amountAction2 || '-' }}
          </td>
          <td  v-if="isHeaderVisible('amountSms')" class=" base-table__td">
            {{ item.amountSms || '-' }}
          </td>

          <td  v-if="isHeaderVisible('averageCostOneCall')" class=" base-table__td">
            {{ item.averageCostOneCall || '-' }}
          </td>
          <td  v-if="isHeaderVisible('averageCostOneLead')" class=" base-table__td">
            {{ item.averageCostOneLead ? item.averageCostOneLead + ' руб.' : '-' }}
          </td>
          <td  v-if="isHeaderVisible('averageCostOneLead2')" class=" base-table__td">
            {{ item.averageCostOneLead2 ? item.averageCostOneLead2 + ' руб.' : '-' }}
          </td>
        </tr>
      </template>
      </tbody>
    </VTable>
  </div>
</template>

<style>
.table-wrapper {
  overflow-x: auto;
  margin-top: 15px;
}

.table-wrapper th, .table-wrapper td {
  min-width: 220px; /* Замените на нужное вам значение */
}
</style>
