export const campaign = {
    CREATE: 'campaign/create',
    CREATE_REPORT: (id) => `campaign/create-report/${id}`,
    EDIT: `campaign/edit`,
    LOAD_CAMPAIGNS: 'campaign/load',
    CHANGE_STATUS: `campaign/change-status`,
    START_CALL: 'campaign/start-call',
    PAUSE_CALL: 'campaign/pause-call',
    STOP_CALL: 'campaign/stop-call',
    VIEW_LIST: (id) => `campaign/view/${id}`,
    VIEW_LOGS: (id) => `campaign/view-logs/${id}`,
    LOAD_LOGS: (id) => `campaign/load-logs/${id}`,
}
