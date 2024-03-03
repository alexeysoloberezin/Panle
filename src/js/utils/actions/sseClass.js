import { endpoints } from "@/js/utils/actions/endpoints";
import { useToast } from "vue-toastification";
import { useNotificationStore } from "@/store/notifications";
import { useUserStore } from "@/store/user";

const toast = useToast()

let eventSource = null

export class SseClass {
    name = null
    templateMessage = null
    cbHandleMessage = () => {}
    silent = false
    events = {};

  constructor(name, {
    templateMessage,
    cbHandleMessage,
    silent
  } = {
    templateMessage: null,
    cbHandleMessage: () => {},
    silent: false
  }) {
    this.silent = silent
    this.name = name
    this.templateMessage = templateMessage
    this.cbHandleMessage = cbHandleMessage
  }

  notificationEventSource = () => {
    if (!eventSource) {
      eventSource = new EventSource(`${import.meta.env.VITE_HOST}/${endpoints.sse.NOTIFICATION}`, {withCredentials: true});
    }

    this.addEvent(this.name, (_) => {
    })
    this.initListener()

    return eventSource
  }

  initListener = () => {
    eventSource.addEventListener('message', this.handleMessage);
    eventSource.addEventListener('error', this.handleError)
  }

    handleMessage = (data) => {
        console.log('handleMessage', {
            data: data.data,
            type: this.name
        })
        try {
            const notificationStore = useNotificationStore()
            let notifications = JSON.parse(data.data);
            notificationStore.saveNotifications(notifications)
            // notifications = notifications.filter(notify => notify.data.type.value === this.name)

            notifications.forEach(notify => {
                this.events[notify.type]?.(notify);

                if (this.silent) {
                    return;
                }

                if (this.templateMessage) {
                    toast(this.templateMessage(notify), { type: notify.status });
                    return
                }

                if (notify.text) {
                    toast(notify.text, { type: notify.status });
                }
            })

            if (this.cbHandleMessage) {
                this.cbHandleMessage(notifications)
            }
        } catch (e) {
            console.error(e)
        }
    }

    handleError = async (error) => {
        console.log(error)
        await useUserStore().loadUserInfo()
    }

    addEvent = (name, cb) => {
        if (this.events[name]) {
            this.removeEventSource(name)
        }
        this.events[name] = cb;
    }

    removeEventSource = (name) => {
        eventSource.removeEventListener('message', this.events[name])
        delete this.events[name];
    }

    closeEventSource = () => {
        eventSource?.close();
        eventSource = null
    }
}
