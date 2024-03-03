<script setup>
import { initToggle } from "@/composable/toggle";
import { useContactsStore } from "@/store/contacts";
import ContactsListTable from "@/views/pages/Contacts/ContactsListTable.vue";
import TableWrapper from "@/components/Table/TableWrapper.vue";
import {tableWrapperDefaultValues} from "@/components/Table/TableWrapperDefaultValues";

const props = defineProps({
  value: {
    type: Boolean
  }
})
const emit = defineEmits(['update:modelValue', 'contactsList:selected'])
const isOpen = initToggle(props.value, (e) => {
  emit('update:modelValue', e)
})
onMounted(() => {
  loadContactsList();
})
const storeContacts = useContactsStore()
const pagination = computed(() => storeContacts.pagination)
const loading = computed(() => storeContacts.loading)

const loadContactsList = async (params = {}) => {
  await storeContacts.loadContactsList({...params, status: 'active'});
}
// Functions
const handleSelectContactsList = (id) => {
  emit('contactsList:selected', id)
  isOpen.value = false;
}

const headers = reactive(tableWrapperDefaultValues().headersSmall)
</script>

<template>
  <VDialog
    v-model="isOpen"
    width="auto">
    <VCard>
      <VCardTitle>{{ $t('data.helpers.chooseContacts') }}</VCardTitle>
      <VCardText>
        <VRow>
          <TableWrapper :items="storeContacts.getContactsListSorted"
                        :lazy-pagination="true"
                        :lazy-options="pagination"
                        :hide-fields="['search', 'date', 'status', 'sortBy', 'fieldsTable']"
                        :loading="loading"
                        @update:refreshTable="loadContactsList"
                        :headers="headers"
                        :table-name="'contactsListModal'"
          >
            <template #body="{ data }">
              <ContactsListTable
                :items="data.items"
                :headers="data.headers"
                @click:item="handleSelectContactsList"
              />
            </template>
          </TableWrapper>


        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
</template>
