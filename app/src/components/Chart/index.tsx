//import { BsSave2 } from 'solid-icons/bs'
import { invoke } from '@tauri-apps/api/tauri'
import { Chart, ChartType } from 'chart.js/auto'
import {
    FaSolidChartLine,
    FaSolidChartBar,
    FaSolidChartArea,
    FaSolidTrashCan,
} from 'solid-icons/fa'
import { createSignal, Component, createResource, onMount } from 'solid-js'
import type { AppStoreChart } from '@static/types/interfaces'
import CustomPopover from '@components/Header/CustomPopover'
import { useAppChartContext } from '@store/context/chart'

interface IButtonGroup {
    handleDelete: () => void
    updateChartType: (value: string) => void
}

const ButtonGroup = (props: IButtonGroup) => {
    return (
        <div id="button-row" class="flex justify-end py-[2px]">
            <div id="chart-types">
                <button
                    data-user="line"
                    onClick={(event) =>
                        props.updateChartType(event.currentTarget.dataset['user'] ?? '')
                    }
                    class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomPopover styles="h-full" popoverContent="Line Chart" />
                    <FaSolidChartLine data-user="line" />
                </button>
                <button
                    data-user="bar"
                    onClick={(event) =>
                        props.updateChartType(event.currentTarget.dataset['user'] ?? '')
                    }
                    class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomPopover styles="h-full" popoverContent="Bar Chart" />
                    <FaSolidChartBar data-user="bar" />
                </button>
                <button
                    data-user="area"
                    onClick={(event) =>
                        props.updateChartType(event.currentTarget.dataset['user'] ?? '')
                    }
                    class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomPopover styles="h-full" popoverContent="Area Chart" />
                    <FaSolidChartArea data-user="area" />
                </button>
            </div>
            {/*
                <button
                    onClick={() => props.handleSave()}
                    class="py-1 px-2 mx-[1px] bg-blue-400 hover:bg-blue-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-blue-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomPopover styles="h-full" popoverContent="Save Chart" />
                    <BsSave2 />
                </button>
             */}
            <button
                onClick={() => props.handleDelete()}
                class="py-1 px-2 mx-[1px] bg-red-400 hover:bg-red-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-red-700 transition duration-100 ease-in focus:shadow-inner">
                <CustomPopover styles="h-full" popoverContent="Delete Chart" />
                <FaSolidTrashCan />
            </button>
            {/* <button class="pie-chart">
                        <FontAwesomeIcon icon={faPieChart} />
                    </button> */}
        </div>
    )
}

const CustomChart: Component<AppStoreChart> = (props) => {
    const { setRemoveChart, getCharts } = useAppChartContext()
    const [chartRef, setChartRef] = createSignal<HTMLCanvasElement>()
    const [chartType, setChartType] = createSignal('line')
    const [localChart, setLocalChart] = createSignal<Chart>()

    const updateChartType = (value: string) => {
        setChartType(value)
    }

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
            return null
        }
    }

    const [resource] = createResource(handleChartUpdate)

    onMount(() => {
        if (chartRef()) {
            const canvas = chartRef() as HTMLCanvasElement
            const type = chartType() as ChartType
            const chart = new Chart(canvas, {
                type: type,
                data: {},
            })
            setLocalChart(chart)
        }
    })

    return (
        <div class="card">
            <ButtonGroup handleDelete={handleDelete} updateChartType={updateChartType} />
            <div class="w-[500px]">
                <canvas
                    role="img"
                    id="dimensions"
                    ref={setChartRef}
                    class={`chartContainer ${props.cName}`}
                />
            </div>
            <br />
        </div>
    )
}

export default CustomChart
