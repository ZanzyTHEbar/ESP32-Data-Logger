import { createContext, useContext, createMemo, type Component, Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
//import { useAppMDNSContext } from '../mdns'
import type { Context } from '@static/types'
import type { AppStoreChart, ChartSettings } from '@static/types/interfaces'

interface AppChartContext {
    getCharts: Accessor<AppStoreChart>
    getSelectedChart: Accessor<ChartSettings | undefined>
    getSelectedChartId: Accessor<string | undefined>
    setAddChart: (chart: ChartSettings) => void
    setRemoveChart: (chart: ChartSettings | undefined) => void
    setRemoveAllCharts: () => void
    setSelectedChart: (chart: ChartSettings) => void
    setEditChart: (chart: ChartSettings) => void
    resetSelectedChart: () => void
    jsonToCSV: (data: object) => string
    downloadCSV: (data: string) => void
}

const AppChartContext = createContext<AppChartContext>()
export const AppChartProvider: Component<Context> = (props) => {
    //const { getMdnsAddresses } = useAppMDNSContext()
    /**
     ** {
     **    ip: '',
     **    endpoint: '',
     **    title: '',
     **    y_axis_title: '',
     **    line_color: '',
     **    interval: 0,
     **    object_id: '',
     **    chart_id: '',
     **    cName: '',
     ** },
     **/
    const defaultState: AppStoreChart = {
        settings: [],
        selectedChart: {
            ip: '',
            endpoint: '',
            title: '',
            y_axis_title: '',
            object_id_label: '',
            line_color: '',
            interval: 3000,
            object_id: '',
            chart_id: '',
            cName: 'graphContainer',
        },
    }

    const setAddChart = (chart: ChartSettings) => {
        setState(
            produce((draft) => {
                //* check for duplicates
                const duplicate = draft.settings.find((item) => item.chart_id === chart.chart_id)
                if (!duplicate) {
                    draft.settings.push(chart)
                }
            }),
        )
    }

    const setEditChart = (chart: ChartSettings) => {
        setState(
            produce((draft) => {
                //* check for chart in state
                let prev_chart = draft.settings.find((item) => item.chart_id === chart.chart_id)
                if (prev_chart) {
                    //* push new chart and remove old one
                    prev_chart = chart
                    draft.settings = draft.settings.filter(
                        (item: { chart_id: string }) => item.chart_id !== chart.chart_id,
                    )
                    draft.settings.push(prev_chart)
                }
            }),
        )
    }

    const setRemoveChart = (chart: ChartSettings | undefined) => {
        setState(
            produce((draft) => {
                //* remove chart from state
                if (chart) {
                    draft.settings = draft.settings.filter(
                        (item: { chart_id: string }) => item.chart_id !== chart.chart_id,
                    )
                }
            }),
        )
    }

    const setRemoveAllCharts = () => {
        setState(
            produce((draft) => {
                //* remove all charts from state
                draft.settings.splice(0, draft.settings.length)
            }),
        )
    }

    const setSelectedChart = (chart: ChartSettings) => {
        setState(
            produce((draft) => {
                draft.selectedChart = chart
            }),
        )
    }

    const jsonToCSV = (data: object[]) => {
        console.log('[JSON TO CSV]: ', data)
        // Empty array for storing the values
        const csvRows: string[] = []

        // extract keys from the first object
        const headers = Object.keys(data[1])

        // As for making csv format, headers must
        // be separated by comma and pushing it
        // into array
        csvRows.push(headers.join(','))

        console.log('[HEADERS]: ', headers)

        // Looping through the data values and make
        // sure to align values with respect to headers
        data.forEach((item: object) => {
            const values = headers.map((e) => {
                console.log(item[e])
                return item[e]
            })

            // check if the values are of object type
            // then stringify the values
            if (typeof values === 'object') {
                values.map((e) => {
                    JSON.stringify(e)
                })
            }

            // check if the values are of array type
            // then stringify the values
            if (values instanceof Array) {
                values.map((e) => {
                    JSON.stringify(e)
                })
            }

            csvRows.push(values.join(','))
        })

        // Pushing Object values into array
        // with comma separation
        //const values = Object.values(data).join(',')
        //csvRows.push(values)

        // Returning the array joining with new line
        return csvRows.join('\n')
    }

    const downloadCSV = (data: string) => {
        // Creating a Blob for having a csv file format
        // and passing the data with type
        const blob = new Blob([data], { type: 'text/csv' })

        // Creating an object for downloading url
        const url = window.URL.createObjectURL(blob)

        // Creating an anchor(a) tag of HTML
        const a = document.createElement('a')

        // Passing the blob downloading url
        a.setAttribute('href', url)

        // Setting the anchor tag attribute for downloading
        // and passing the download file name
        a.setAttribute('download', 'download.csv')

        // Performing a download with click
        a.click()
    }

    const resetSelectedChart = () => {
        setState(
            produce((draft) => {
                draft.selectedChart = {
                    ip: '',
                    endpoint: '',
                    title: '',
                    y_axis_title: '',
                    object_id_label: '',
                    line_color: '',
                    interval: 3000,
                    object_id: '',
                    chart_id: '',
                    cName: 'graphContainer',
                }
            }),
        )
    }

    const [state, setState] = createStore<AppStoreChart>(defaultState)
    const getCharts = createMemo(() => state)

    const getSelectedChart = createMemo(() => getCharts().selectedChart)
    const getSelectedChartId = createMemo(() => getCharts().selectedChart?.chart_id)

    return (
        <AppChartContext.Provider
            value={{
                getCharts,
                getSelectedChart,
                getSelectedChartId,
                setAddChart,
                setRemoveChart,
                setRemoveAllCharts,
                setSelectedChart,
                setEditChart,
                resetSelectedChart,
                jsonToCSV,
                downloadCSV,
            }}>
            {props.children}
        </AppChartContext.Provider>
    )
}

export const useAppChartContext = () => {
    const context = useContext(AppChartContext)
    if (context === undefined) {
        throw new Error('useAppChartContext must be used within an AppChartProvider')
    }
    return context
}
