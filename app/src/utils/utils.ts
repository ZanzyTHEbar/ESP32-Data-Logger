import type { ChartSettings } from '@static/types/interfaces'

export const fillArrayWithRandomNumbers = (min: number, max: number, length = 10) => {
    const array: number[] = []

    for (let i = 0; i < length; i++) {
        const randomNumber = Math.floor(Math.random() * (max - min)) + min
        array.push(randomNumber)
    }

    return array
}

export const generateRandomString = (length = 5): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    let result = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        result += chars.charAt(randomIndex)
    }

    return result
}

export function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateRandomColors = (length: number) => {
    const colors: string[] = []
    for (let i = 0; i < length; i++) {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
        colors.push(randomColor)
    }
    return colors
}

export const generateRandomDataset = (labels: string[], index: number) => ({
    label: 'Dataset ' + index,
    borderColor: generateRandomColors(1)[0],
    backgroundColor: generateRandomColors(1)[0],
    data: fillArrayWithRandomNumbers(
        generateRandomNumber(10, 500),
        generateRandomNumber(501, 1000),
        labels.length,
    ),
})

export const generateRandomChartData = (datasetsLength = 2) => {
    const labels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const datasets: object[] = []

    for (let i = 0; i < datasetsLength; i++) {
        datasets.push(generateRandomDataset(labels, i + 1))
    }

    return {
        labels,
        datasets,
    }
}

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
