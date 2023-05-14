//import { BsSave2 } from 'solid-icons/bs'
import { invoke } from '@tauri-apps/api/tauri'
import {
    FaSolidChartLine,
    FaSolidChartBar,
    FaSolidChartArea,
    FaSolidTrashCan,
} from 'solid-icons/fa'
import {
    createSignal,
    onMount,
    onCleanup,
    createMemo,
    createEffect,
    Component,
    Signal,
    createResource,
} from 'solid-js'
import type { AppStoreChart } from '@static/types/interfaces'
import { Tooltip } from '@components/Tooltip'
import { useAppChartContext } from '@store/context/chart'
import { createStore, unwrap, reconcile } from 'solid-js/store'

interface IButtonGroup {
    handleDelete: () => void
    updateChartType: (value: string) => void
}

const ButtonGroup = (props: IButtonGroup) => {
    return (
        <div id="button-row" class="flex justify-end py-[2px]">
            <div id="chart-types">
                <Tooltip tooltip="Line Chart">
                    <button
                        data-user="line"
                        onClick={(event) =>
                            props.updateChartType(event.currentTarget.dataset['user'] ?? '')
                        }
                        class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                        <FaSolidChartLine data-user="line" />
                    </button>
                </Tooltip>
                <Tooltip tooltip="Bar Chart">
                    <button
                        data-user="bar"
                        onClick={(event) =>
                            props.updateChartType(event.currentTarget.dataset['user'] ?? '')
                        }
                        class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                        <FaSolidChartBar data-user="bar" />
                    </button>
                </Tooltip>
                <Tooltip tooltip="Area Chart">
                    <button
                        data-user="area"
                        onClick={(event) =>
                            props.updateChartType(event.currentTarget.dataset['user'] ?? '')
                        }
                        class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                        <FaSolidChartArea data-user="area" />
                    </button>
                </Tooltip>
            </div>
            {/* <Tooltip tooltip="Save Chart">
                <button
                    onClick={() => props.handleSave()}
                    class="py-1 px-2 mx-[1px] bg-blue-400 hover:bg-blue-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-blue-700 transition duration-100 ease-in focus:shadow-inner">
                    <BsSave2 />
                </button>
            </Tooltip> */}
            <Tooltip tooltip="Delete Chart">
                <button
                    onClick={() => props.handleDelete()}
                    class="py-1 px-2 mx-[1px] bg-red-400 hover:bg-red-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-red-700 transition duration-100 ease-in focus:shadow-inner">
                    <FaSolidTrashCan />
                </button>
            </Tooltip>
            {/* <button class="pie-chart">
                        <FontAwesomeIcon icon={faPieChart} />
                    </button> */}
        </div>
    )
}

const Chart: Component<AppStoreChart> = (props) => {
    const { setRemoveChart, getCharts } = useAppChartContext()
    const [chartRef, setChartRef] = createSignal(null)
    const updateChartType = (value: string) => {}

    const handleDelete = () => {
        if (getCharts().length >= 1) {
            //* get chart data
            const chartData = getCharts().find((item) => item['chart_id'] === props.chart_id)
            //* remove chart from state
            setRemoveChart(chartData)
        }
    }

    const handleChartUpdate = async (source, { value, refetching }) => {
        const chartData = getCharts().find((item) => item.chart_id === props.chart_id)
        try {
            if (chartData) {
                const response = await invoke('do_rest_request', {
                    endpoint: chartData.endpoint,
                    deviceName: chartData.ip,
                    method: 'GET',
                })
                if (typeof response === 'string') {
                    const parsedResponse = JSON.parse(response)

                    //* grab the target object key from the response
                    const targetKey = Object.keys(parsedResponse).find(
                        (item) => item === chartData.object_id,
                    )
                    console.log(targetKey)
                    return targetKey ? parsedResponse[targetKey] : null
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    const [resource] = createResource(handleChartUpdate)

    return (
        <div class="card">
            <ButtonGroup handleDelete={handleDelete} updateChartType={updateChartType} />
            <canvas class={`chartContainer ${props.cName}`} />
        </div>
    )
}

export default Chart
