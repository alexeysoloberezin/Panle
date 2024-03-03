class EventBusEvent extends Event {
    data

    constructor({ type, data }) {
        super(type)
        this.data = data
    }
}

class GlobalEvent extends EventTarget {
    _instance

    static getInstance() {
        if (!this._instance) this._instance = new GlobalEvent()
        return this._instance
    }

    emit(type, data) {
        this.dispatchEvent(new EventBusEvent({ type, data }))
    }
}

export default GlobalEvent.getInstance()


export const EVENTS = {
    OPEN_CONFIRMATION: 'open-confirmation'
}
