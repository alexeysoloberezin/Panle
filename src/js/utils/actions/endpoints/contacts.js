export const contacts = {
    CREATE_LIST: 'contacts/create-list',
    ADD_CONTACTS: 'contacts/add-contacts',
    LOAD_LISTS: 'contacts/load-lists',
    CHANGE_STATUS_LIST: 'contacts/change-status-list',
    VIEW_LIST: (id) => `contacts/view-list/${id}`,
    LOAD_LIST: (id) => `contacts/load-list/${id}`,
    VIEW_LOGS: (id) => `contacts/view-logs/${id}`,
}
