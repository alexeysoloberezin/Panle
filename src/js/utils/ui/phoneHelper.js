import { Mask } from 'maska'

export const phoneMask = (value) => value.startsWith('8') ? '8 (###) ### ####' : '+7 (###) ### ####';

export const formatPhone = (phone) => {
    const mask = new Mask({ mask: phoneMask })
    return mask.masked(phone || '')
}
