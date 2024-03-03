<script setup>
import { VDataTableVirtual } from "vuetify/labs/VDataTable";
import { formatPhone } from "@/js/utils/ui/phoneHelper";
import {useI18n} from "vue-i18n/dist/vue-i18n";
import { useUserStore } from "@/store/user";

const props = defineProps({
  items: Array,
  showSearch: {
    type: Boolean,
    default: true
  },
  status: String
})
const emit = defineEmits(['change:is-active'])
const router = useRouter()

const {t} = useI18n()
const headers = [
  { title: t('table.id'), key: 'id', align: 'start', sortable: false },
  { title: t('table.phone'), key: 'phone', align: 'center', sortable: false },
  { title: t('table.FName'), key: 'firstname', align: 'center', sortable: false },
  { title: t('table.Region'), key: 'region', align: 'center', sortable: false },
  { title: t('table.city'), key: 'city', align: 'center', sortable: false },
  { title: t('table.timeZone'), key: 'timezone', align: 'center', sortable: false },
  { title: t('table.Operator'), key: 'operator', align: 'center', sortable: false },
  { title: t('table.lastEdit'), key: 'updatedAt', align: 'center', sortable: false },
  // { title: 'Действия', key: 'status', align: 'center', sortable: false },
]
const fakeSearch = ref('')
const search = ref('')
let timer = null;
const userStore = useUserStore()

watch(fakeSearch, () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    search.value = fakeSearch.value;
  }, 300)
})
</script>

<template>
  <VTextField
    v-model="fakeSearch"
    v-if="showSearch"
    append-icon="mdi-magnify"
    :label="$t('form.searchPhone')"
    single-line
    hide-details
  />
  <VDataTableVirtual
    :items="items"
    :headers="headers"
    fixed-header
    :search="search"
  >
    <template #item="{item}">
      <tr
        class="table-tr"
      >
        <td class="table-td">
          {{ item.selectable.id }}
        </td>
        <td class="text-center">
          {{ userStore.user.ownTrunk ? item.selectable.phone : formatPhone(item.selectable.phone) }}
        </td>
        <td class="text-center">
          {{ item.selectable.lastname }} {{ item.selectable.firstname }} {{ item.selectable.secondname }}
        </td>
        <td class="text-center">
          {{ item.selectable.region || '—' }}
        </td>
        <td class="text-center">
          {{ item.selectable.city || '—' }}
        </td>
        <td class="text-center">
          {{ item.selectable.timezone || '—' }}
        </td>
        <td class="text-center">
          {{ item.selectable.operator || '—' }}
        </td>
        <td class="text-center">
          {{ (new Date(item.selectable.updatedAt)).toLocaleString() }}
        </td>
        <!--<td class="text-center"></td>-->
      </tr>
    </template>
  </VDataTableVirtual>
</template>

<style lang="scss" scoped>
.table {
  &-tr {
    transition: 0.15s;

    &:hover {
      background-color: #E7E9F6;
    }

    &:active {
      background-color: #B6BEE3;
    }
  }

  &-td {
    cursor: pointer;
  }

}
</style>
