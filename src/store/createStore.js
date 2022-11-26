import { TabManager } from "../TabManager";
import { LocalStorageManager } from '../LocalStorageManager'
import { NetworkManager } from '../NetworkManager'

export const createStore = (reducer, executors) => {
    let state;
    let listeners = []

    const tabManager = new TabManager()

    const dispatchForNetwork = action => {
        state = reducer(state, action)
        listeners.forEach(listener => listener(state))
    }

    const networkManager = new NetworkManager({ id: tabManager.id, dispatch: dispatchForNetwork, executors })
    LocalStorageManager.init()
    const storedState = LocalStorageManager.getValueByKey('state')
    state = storedState
    tabManager.init()

    const getState = () => state

    const dispatch = action => {
        state = reducer(state, action)
        networkManager.send({ type: 'REDUCER', data: action })
        LocalStorageManager.updateValueByKey('state', state)
        listeners.forEach(listener => listener(state))
    }

    const executor = (type, params={}) => {
        networkManager.send({ type: 'EXECUTOR', data: type, params })
    }

    const subscribe = listener => listeners.push(listener)

    dispatch({})

    return { getState, dispatch, subscribe, executor }
}