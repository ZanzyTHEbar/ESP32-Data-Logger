import type { ChartSettings } from '@static/types/interfaces'

export const clearObject = (value: ChartSettings) => {
    console.log('value', value)
    for (const key in value) {
        if (typeof value[key] === 'string') {
            if (value[key] === 'graphContainer') {
                value[key] = 'graphContainer'
                break
            }
            value[key] = ''
        } else if (typeof value[key] === 'number') {
            value[key] = 3000
        } else if (value[key] instanceof Array) {
            value[key] = []
        } else if (value[key] === null) {
            value[key] = null
        }
    }
}
