import { getFullKey, keysConfig } from './utils'

class LocalStorageManager {
    static init = () => {
        keysConfig.forEach(({ key, defaultValue }) => {
            const currentValue = this.getValueByKey(key)

            if (!currentValue) {
                localStorage.setItem(getFullKey(key), JSON.stringify(defaultValue))
            }

        })
    }

    static updateValueByKey = (key, newValue) => {
        localStorage.setItem(getFullKey(key), JSON.stringify(newValue))
    }

    static getValueByKey = (key) => {
        const fullKey = getFullKey(key)

        return JSON.parse(localStorage.getItem(fullKey))
    }

}

export { LocalStorageManager }