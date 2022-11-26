import { LocalStorageManager } from "../LocalStorageManager";

class NetworkManager {
    constructor({ id, dispatch, executors }) {
        this.id = id
        this.channel = new BroadcastChannel("SharedStore");
        this.initReceiver({ dispatch, executors })
    }

    getMessageMeta() {
        return {
            createdAt: new Date(),
            senderId: this.id
        }
    }

    send(message) {
        const history = LocalStorageManager.getValueByKey('history')
        const newMessage = { ...message, ...this.getMessageMeta() }
        history.push(newMessage)
        LocalStorageManager.updateValueByKey('history', history.slice(-20))
        this.channel.postMessage(JSON.stringify(newMessage));
    }

    initReceiver({ dispatch, executors }) {
        this.channel.onmessage = (event) => {
            const { data: stringData } = event
            const { type, data, params } = JSON.parse(stringData)
            switch (type) {
                case 'EXECUTOR':
                    executors[data](params)
                    break;
                case 'REDUCER':
                    dispatch(data)
                    break;

                default:
                    break;
            }
        };

        this.channel.onmessageerror = (event) => {
            console.error(event)
        }
    }
}

export { NetworkManager }