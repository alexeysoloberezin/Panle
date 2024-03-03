import {useI18n} from "vue-i18n/dist/vue-i18n";

export const STATUSES = {
    ACTIVE: "active",
    ARCHIVE: "archive"
}
export const STATUSES_CALL = {
    NOT_RUNNING: "not_running",
    LAUNCHED: "launched",
    PAUSE: "pause",
    COMPLETED: "completed",
    RESUMED: "resumed"
}

export const getStatusesCall = () => {
    const keys = Object.values(STATUSES_CALL)
    const { t } = useI18n()

    return keys.map(key => ({
        name_ru: t('STATUSES_CALL_NAMES.' + key),
        name: STATUSES_CALL[key],
        key
    }))
}

export const STATUSES_SMS_NAMES = (t) => {
    return {
        send: t('STATUSES_SMS_NAMES.send'),
        not_deliver: t('STATUSES_SMS_NAMES.not_deliver'),
        expired: t('STATUSES_SMS_NAMES.expired'),
        deliver: t('STATUSES_SMS_NAMES.deliver'),
        read: t('STATUSES_SMS_NAMES.read'),
        partly_deliver: t('STATUSES_SMS_NAMES.partly_deliver'),
    }
}

export const GET_STATUSES_SMS_NAMES = (t) => Object.keys(STATUSES_SMS_NAMES(t)).map(el => ({ name_ru: STATUSES_SMS_NAMES(t)[el], key: el }))


export const STATUSES_CALL_NAMES_FOR_CAMPAIGNS = (t) => {
    return {
        launched: t('STATUSES_CALL_NAMES_FOR_CAMPAIGNS.launched'),
        pause: t('STATUSES_CALL_NAMES_FOR_CAMPAIGNS.pause'),
        completed: t('STATUSES_CALL_NAMES_FOR_CAMPAIGNS.completed'),
    }
}
export const GET_STATUSES_CALL_NAMES_FOR_CAMPAIGNS = (t) => Object.keys(STATUSES_CALL_NAMES_FOR_CAMPAIGNS(t)).map(el => ({ name_ru: STATUSES_CALL_NAMES_FOR_CAMPAIGNS(t)[el], key: el }))
