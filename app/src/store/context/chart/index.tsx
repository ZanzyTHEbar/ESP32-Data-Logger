import {
    createContext,
    useContext,
    createMemo,
    type Component,
    Accessor,
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
//import { useAppMDNSContext } from '../mdns'
import type { Context } from '@static/types'
import type { AppStoreChart } from '@static/types/interfaces'

interface AppChartContext {
    getCharts: Accessor<AppStoreChart[]>
    setAddChart: (chart: AppStoreChart) => void
    setRemoveChart: (chart: AppStoreChart | undefined) => void
}

const AppChartContext = createContext<AppChartContext>()
export const AppChartProvider: Component<Context> = (props) => {
    //const { getMdnsAddresses } = useAppMDNSContext()
    const defaultState: AppStoreChart[] = [
        {
            ip: '',
            endpoint: '',
            title: '',
            y_axis_title: '',
            line_color: '',
            interval: 0,
            object_id: '',
            chart_id: '',
            cName: '',
        },
    ]

    const [state, setState] = createStore<AppStoreChart[]>(defaultState)
    const getCharts = createMemo(() => state)

    const setAddChart = (chart: AppStoreChart) => {
        setState(
            produce((draft) => {
                //* check for duplicates
                const duplicate = draft.find((item) => item.chart_id === chart.chart_id)
                if (!duplicate) {
                    draft.push(chart)
                }
            }),
        )
    }

    const setRemoveChart = (chart: AppStoreChart | undefined) => {
        setState(
            produce((draft) => {
                //* remove chart from state
                if (chart) {
                    const index = draft.findIndex((item) => item.chart_id === chart.chart_id)
                    if (index !== -1) {
                        draft.splice(index, 1)
                    }
                }
            }),
        )
    }

    return (
        <AppChartContext.Provider
            value={{
                getCharts,
                setAddChart,
                setRemoveChart,
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
