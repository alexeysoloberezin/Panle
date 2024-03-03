export const initToggle = (value, cb) => {
    return computed({
        get() {
            return value
        },
        set(e) {
            cb(e)
        }
    })
}

export const toggleChangeViaVModel = (value, cb) => initToggle(value, cb)
