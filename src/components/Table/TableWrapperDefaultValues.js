import {useI18n} from "vue-i18n/dist/vue-i18n";


export const tableWrapperDefaultValues = () => {
  const {t} = useI18n()

  return {
    headersSmall: [
      {
        name: t('table.id'),
        key: 'id',
      },
      {
        name: t('table.title'),
        key: 'title',
        classes: 'text-center'
      },
      {
        name: t('table.date'),
        key: 'createdAt',
      },
    ],
    headers: [
      {
        name: t('table.id'),
        key: 'id',
      },
      {
        name: t('table.title'),
        key: 'title',
        classes: 'text-center'
      },
      {
        name: t('table.date'),
        key: 'createdAt',
      },
      {
        name: t('table.status'),
        key: 'statusCall',
      },
      {
        name: t('table.actions'),
        key: 'actions',
      },
    ],
    headersCampaign: [
      {
        name: t('table.title'),
        key: 'title',
      },
      {
        name: t('table.updatedAt'),
        key: 'updatedAt',
      },
      {
        name: t('table.status'),
        key: 'status',
      },
      {
        name: t('table.totalCost'),
        key: 'totalCostCampaign',
      },
      {
        name: t('table.amountCalls'),
        key: 'amountCalls',
      },
      {
        name: t('table.amountCallsTime'),
        key: 'amountCallsTime',
      },
      {
        name: t('table.amountAnswer'),
        key: 'amountAnswer',
      },
      {
        name: t('table.amountAction', {count: 1}),
        key: 'amountAction1',
      },
      {
        name: t('table.amountAction', {count: 2}),
        key: 'amountAction2',
        initialHide: true
      },
      {
        name: t('table.amountSms'),
        key: 'amountSms',
      },
      {
        name: t('table.averageCostOneCall'),
        key: 'averageCostOneCall',
      },
      {
        name: t('table.averageCostOneLead'),
        key: 'averageCostOneLead',
      },
      {
        name: t('table.averageCostOneLead2'),
        key: 'averageCostOneLead2',
        initialHide: true
      },
    ],
    headerBase: [
      {
        name: t('table.id'),
        key: 'id',
      },
      {
        name: t('table.title'),
        key: 'title',
        classes: 'text-center'
      },
      {
        name: t('table.createdAt'),
        key: 'createdAt',
      },
      {
        name: t('table.actions'),
        key: 'actions',
      },
    ],
    contacts: [
      {
        name: t('table.id'),
        key: 'id',
      },
      {
        name: t('table.title'),
        key: 'title',
        classes: 'text-center'
      },
      {
        name: t('table.contactsCount'),
        key: 'contactsCount',
      },
      {
        name: t('table.createdAt'),
        key: 'createdAt',
      },
      {
        name: t('table.actions'),
        key: 'actions',
      },
    ],
    sms: [
      {
        name: t('table.id'),
        key: 'id',
      },
      {
        name: t('table.date'),
        key: 'createdAt',
      },
      {
        name: t('table.phone'),
        key: 'phone',
      },
      {
        name: t('table.cost'),
        key: 'cost',
      },
      {
        name: t('table.campaign'),
        key: 'campaign',
      },
    ],
    statistics: [
      {
        name: t('table.id'),
        key: 'id',
      },
      {
        name: t('table.date'),
        key: 'createdAt',
      },
      {
        name: t('table.direction'),
        key: 'direction',
      },
      {
        name: t('table.phone'),
        key: 'phone',
      },
      {
        name: t('table.direction'),
        key: 'duration',
      },
      {
        name: t('table.cost'),
        key: 'cost',
      },
      {
        name: t('table.campaign'),
        key: 'campaign',
      },
      {
        name: t('table.audio_recording'),
        key: 'audio_recording',
      },
    ]
  }
}


