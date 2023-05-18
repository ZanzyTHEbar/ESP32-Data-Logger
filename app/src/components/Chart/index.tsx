import { useNavigate } from '@solidjs/router'
import { invoke } from '@tauri-apps/api/tauri'
import { ChartData, ChartTypeRegistry } from 'chart.js'
import { Chart, DefaultChart, Title, Tooltip, Legend } from 'solid-chartjs/dist'
import {
    FaSolidChartLine,
    FaSolidChartBar,
    FaSolidGear,
    FaSolidChartArea,
    FaSolidTrashCan,
} from 'solid-icons/fa'
import { createSignal, createResource, onMount, For } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { ChartSettings } from '@static/types/interfaces'
import type { Component } from 'solid-js'
import CustomTooltip from '@components/Tooltip'
import { useAppChartContext } from '@store/context/chart'
import { generateRandomChartData, generateRandomDataset } from '@utils/utils'

interface IButtonGroup {
    handleDelete: () => void
    updateChartType: (event: any) => void
    chart: ChartSettings
}

const ButtonGroup = (props: IButtonGroup) => {
    const navigate = useNavigate()

    const { setSelectedChart } = useAppChartContext()

    return (
        <div id="button-row" class="flex justify-end py-[2px]">
            <div id="chart-types">
                <button
                    data-user="line"
                    onClick={(event) => props.updateChartType(event)}
                    class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomTooltip tooltip="Line Chart">
                        <FaSolidChartLine data-user="line" />
                    </CustomTooltip>
                </button>
                <button
                    data-user="bar"
                    onClick={(event) => props.updateChartType(event)}
                    class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomTooltip tooltip="Line Chart">
                        <FaSolidChartBar data-user="bar" />
                    </CustomTooltip>
                </button>
                <button
                    data-user="polarArea"
                    onClick={(event) => props.updateChartType(event)}
                    class="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomTooltip tooltip="Line Chart">
                        <FaSolidChartArea data-user="area" />
                    </CustomTooltip>
                </button>
            </div>
            <button
                onClick={() => {
                    setSelectedChart(props.chart)
                    navigate('/settings')
                }}
                class="py-1 px-2 mx-[1px] bg-blue-400 hover:bg-blue-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-blue-700 transition duration-100 ease-in focus:shadow-inner">
                <CustomTooltip tooltip="Chart Settings">
                    <FaSolidGear data-user="settings" />
                </CustomTooltip>
            </button>
            <button
                onClick={() => props.handleDelete()}
                class="py-1 px-2 mx-[1px] bg-red-400 hover:bg-red-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-red-700 transition duration-100 ease-in focus:shadow-inner">
                <CustomTooltip tooltip="Delete Chart">
                    <FaSolidTrashCan />
                </CustomTooltip>
            </button>
            {/* <button class="pie-chart">
                        <FontAwesomeIcon icon={faPieChart} />
                    </button> */}
        </div>
    )
}

const CustomChart: Component<ChartSettings> = (props) => {
    const { setRemoveChart, getCharts } = useAppChartContext()
    const [chartData, setChartData] = createSignal<ChartData>(generateRandomChartData())
    const [ref, setRef] = createSignal<HTMLCanvasElement | null>(null)
    const [chartConfig, setChartConfig] = createStore({
        width: 500,
        height: 500,
    })

    const chartTypes: (keyof ChartTypeRegistry)[] = [
        'line',
        'bar',
        'doughnut',
        'radar',
        'polarArea',
        'bubble',
        'pie',
        'scatter',
    ]
    const [chartType, setChartType] = createSignal<keyof ChartTypeRegistry | undefined>(
        chartTypes[0],
    )

    const handleDelete = () => {
        if (getCharts().settings.length >= 1) {
            //* get chart data
            const chartData = getCharts().settings.find(
                (item) => item['chart_id'] === props.chart_id,
            )
            //* remove chart from state
            setRemoveChart(chartData)
        }
    }

    const handleChartUpdate = async (source, { value, refetching }) => {
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
                    const targetKey = Object.keys(parsedResponse).find((item) => {
                        if (chartData) item === chartData.object_id
                    })
                    console.log(targetKey)
                    return targetKey ? parsedResponse[targetKey] : null
                }
            }
        } catch (err) {
            console.log(err)
            return null
        }
    }

    /* const onRandomizeClick = () => {
        setChartData((prev) => generateRandomChartData(prev.datasets.length))
    } */
    const onAddDatasetClick = () => {
        setChartData((prev) => {
            const datasets = prev.datasets
            datasets.push(generateRandomDataset(prev.labels as string[], prev.datasets.length + 1))
            return { ...prev, datasets }
        })
    }
    const onRemoveDatasetClick = () => {
        setChartData((prev) => {
            const datasets = prev.datasets
            datasets.pop()
            return { ...prev, datasets }
        })
    }

    const onDimensionsInput = (type: 'width' | 'height', event: any) => {
        setChartConfig(type, () => +event.target.value)
    }

    const onTypeSelect = (event: any) => {
        setChartType(event.currentTarget.dataset['user'] ?? ('' as keyof ChartTypeRegistry))
    }

    onMount(() => {
        Chart.register(Title, Tooltip, Legend)
        console.debug('[Chart Ref]:', ref())
    })

    //
    return (
        <div class="card">
            <ButtonGroup handleDelete={handleDelete} updateChartType={onTypeSelect} chart={props} />
            <div class="flex justify-center items-center content-center">
                <div class="w-[500px]">
                    <DefaultChart
                        class={`chartContainer ${props.cName}`}
                        ref={setRef}
                        width={chartConfig.width}
                        height={chartConfig.height}
                        fallback={<p>Chart is not available</p>}
                        type={chartType()!}
                        data={chartData()}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: props.title,
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CustomChart
