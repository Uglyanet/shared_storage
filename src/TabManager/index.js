import { v4 as uuidv4 } from 'uuid'
import { LocalStorageManager } from '../LocalStorageManager'

class TabManager {
    constructor() {
        this.id = uuidv4()
        window.onunload = () => {
            this.remove()
        }
    }

    init() {
        const tabs = this.getTabsState()
        const tab = {
            id: this.id,
            data: {},
            createdAt: new Date(),
            updatedAt: null
        }
        tabs.push(tab)

        LocalStorageManager.updateValueByKey('tabsState', tabs)
    }

    getTabState(id = this.id) {
        const tabs = this.getTabsState()
        return tabs.find(tab => tab.id === id)
    }

    getTabsState() {
        const tabs = LocalStorageManager.getValueByKey('tabsState')
        return tabs
    }

    update(data) {
        const tab = this.getTabState()
        const tabs = this.getTabsState().map(currentTab => {
            if (currentTab.id === this.id) {
                return {
                    ...tab,
                    updatedAt: new Date(),
                    data: {
                        ...currentTab.data,
                        ...data
                    }
                }
            }
            return currentTab
        })
        LocalStorageManager.updateValueByKey('tabsState', tabs)
    }

    remove() {
        const tabs = this.getTabsState()
        const newTabs = tabs.filter(tab => tab.id !== this.id)
        LocalStorageManager.updateValueByKey('tabsState', newTabs)
    }
}

export { TabManager }