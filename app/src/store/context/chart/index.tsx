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
                //* check for duplicates
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

    const resetSelectedChart = () => {
        setState(
            produce((draft) => {
                draft.selectedChart = {
                    ip: '',
                    endpoint: '',
                    title: '',
                    y_axis_title: '',
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
