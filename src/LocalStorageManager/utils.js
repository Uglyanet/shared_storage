const prefix = 'SharedStore'
const separator = ':'

const keysConfig = [
    {
        key: 'history',
        defaultValue: []
    },
    {
        key: 'tabsState',
        defaultValue: []
    },
    {
        key: 'state',
        defaultValue: {}
    }
]

const getFullKey = (key) => {
    return `${prefix}${separator}${key}`
}

export { keysConfig, getFullKey }