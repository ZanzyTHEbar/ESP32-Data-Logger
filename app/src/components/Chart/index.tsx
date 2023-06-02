/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from '@solidjs/router'
import {
    ChartData,
    ChartOptions,
    ChartTypeRegistry,
    Chart,
    Colors,
    Title,
    Tooltip,
    Legend,
    LineController,
    LinearScale,
    PointElement,
    LineElement,
    BarController,
    CategoryScale,
    BarElement,
    PolarAreaController,
    RadialLinearScale,
} from 'chart.js'
import { DefaultChart } from 'solid-chartjs'
import {
    FaSolidChartLine,
    FaSolidChartBar,
    FaSolidGear,
    FaSolidChartArea,
    FaSolidTrashCan,
} from 'solid-icons/fa'
import { IoSave } from 'solid-icons/io'
import { createSignal, onMount, createEffect, onCleanup, createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { useInterval } from 'solidjs-use'
import { error } from 'tauri-plugin-log-api'
import type { ChartSettings } from '@static/types/interfaces'
import type { Component } from 'solid-js'
import CustomTooltip from '@components/Tooltip'
import { useAppAPIContext } from '@src/store/context/api'
import { useAppChartContext } from '@store/context/chart'

interface IButtonGroup {
    handleDelete: () => void
    updateChartType: (event: any) => void
    downloadChart: () => void
    chart: ChartSettings
}

interface IChartDataSet {
    label: string
    data: any[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
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
                    class="py-1 px-2 mx-[1px] bg-blue-500 hover:bg-blue-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-blue-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomTooltip tooltip="Line Chart">
                        <FaSolidChartLine data-user="line" />
                    </CustomTooltip>
                </button>
                <button
                    data-user="bar"
                    onClick={(event) => props.updateChartType(event)}
                    class="py-1 px-2 mx-[1px] bg-blue-500 hover:bg-blue-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-blue-700 transition duration-100 ease-in focus:shadow-inner">
                    <CustomTooltip tooltip="Line Chart">
                        <FaSolidChartBar data-user="bar" />
                    </CustomTooltip>
                </button>
                <button
                    data-user="polarArea"
                    onClick={(event) => props.updateChartType(event)}
                    class="py-1 px-2 mx-[1px] bg-blue-500 hover:bg-blue-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-blue-700 transition duration-100 ease-in focus:shadow-inner">
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
                class="py-1 px-2 mx-[1px] bg-cyan-400 hover:bg-cyan-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-cyan-700 transition duration-100 ease-in focus:shadow-inner">
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
            <button
                onClick={() => props.downloadChart()}
                class="py-1 px-2 mx-[1px] bg-green-400 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
                <CustomTooltip tooltip="Save Chart to CSV">
                    <IoSave />
                </CustomTooltip>
            </button>
        </div>
    )
}

const CustomChart: Component<ChartSettings> = (props) => {
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
    const { setRemoveChart, getCharts, downloadCSV, jsonToCSV } = useAppChartContext()
    const { useRequestHook, getRESTResponse } = useAppAPIContext()
    const [chartData, setChartData] = createSignal<ChartData>()
    const [chartDataSet, setChartDataSet] = createSignal<IChartDataSet>()
    const [ref, setRef] = createSignal<HTMLCanvasElement | null>(null)
    const [chartConfig, setChartConfig] = createStore({
        width: 500,
        height: 500,
    })

    const [chartType, setChartType] = createSignal<keyof ChartTypeRegistry | undefined>(
        chartTypes[0],
    )

    const [restData, setChartRESTdata] = createStore<object[]>([{}])
    const chartRESTData = createMemo(() => restData)

    const [csvData, setChartCSVdata] = createStore<object[]>([{}])
    const chartCSVData = createMemo(() => csvData)

    const [chartOptions, setChartOptions] = createSignal<ChartOptions>({
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0,
        },
        plugins: {
            title: {
                display: true,
                text: props.title,
            },
        },
    })

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

    const updateDataset = (dataSet: IChartDataSet) => {
        const newDataSet = {
            label: dataSet.label,
            borderColor: dataSet.borderColor,
            backgroundColor: dataSet.backgroundColor,
            data: dataSet.data,
        }

        setChartData(
            produce((state) => {
                if (state) state.datasets.push(newDataSet)
            }),
        )
    }

    const updateChartData = () => {
        const data = {
            labels: chartRESTData().map((item) => item['object_label']),
            datasets: [
                {
                    label: props.title,
                    data: chartRESTData().map((item) => item['object_data']),
                    backgroundColor: [props.line_color],
                    borderColor: [props.line_color],
                    borderWidth: 1,
                },
            ],
        }
        setChartData(data)
    }

    const getChartData = async () => {
        useRequestHook(props.endpoint, props.ip, 'GET').catch((err) => {
            error(err)
        })
        if (getRESTResponse) {
            const response = getRESTResponse()
            //console.log('[Get Target Data]: ', response)
            if (response) {
                const targetKey = Object.keys(response).find((item) => item === props.object_id)
                const labelTargetKey = Object.keys(response).find(
                    (item) => item === props.object_id_label,
                )
                //console.log('[Get Target Data]: ', targetKey, labelTargetKey)

                let object_data = targetKey ? response[targetKey] : null
                let object_label = targetKey ? response[labelTargetKey!] : null

                if (object_data === null || object_label === null) {
                    // use the previous data if there is some
                    const previousData = chartRESTData()[chartRESTData().length - 1]
                    object_data = previousData[object_data]
                    object_label = previousData[object_label]
                }

                //console.log('[Get Target Data]: ', object_data, object_label)
                setChartRESTdata(
                    produce((state) => {
                        if (state.length >= 50) {
                            // add state to csv
                            state.shift()
                        }
                        setChartCSVdata(
                            produce((csvState) => {
                                csvState.push({
                                    object_data,
                                    object_label,
                                })
                            }),
                        )
                        state.push({
                            object_data,
                            object_label,
                        })
                    }),
                )
                //console.log('[Get Target Data]: ', chartRESTData())
                updateChartData()
            }
        }
    }

    createEffect(() => {
        const { reset } = useInterval(props.interval, {
            controls: true,
            callback: getChartData,
        })
        onCleanup(() => {
            reset()
        })
    })

    // TODO: Add support for multiple datasets
    const onRemoveDatasetClick = () => {}

    // TODO: Add support for changing size of chart
    const onDimensionsInput = (type: 'width' | 'height', event: any) => {
        setChartConfig(type, () => +event.target.value)
    }

    const onTypeSelect = (event: any) => {
        setChartType(event.currentTarget.dataset['user'] ?? ('' as keyof ChartTypeRegistry))
    }

    onMount(() => {
        Chart.register(
            Title,
            Tooltip,
            Legend,
            Colors,
            LineController,
            LineElement,
            PointElement,
            LinearScale,
            BarController,
            CategoryScale,
            BarElement,
            PolarAreaController,
            RadialLinearScale,
        )
        console.debug('[Chart Ref]:', ref())
    })

    //
    return (
        <div class="card">
            <ButtonGroup
                handleDelete={handleDelete}
                updateChartType={onTypeSelect}
                downloadChart={() => downloadCSV(jsonToCSV(chartCSVData()))}
                chart={props}
            />
            <div class="flex justify-center items-center content-center">
                <DefaultChart
                    class={`chartContainer ${props.cName}`}
                    ref={setRef}
                    width={chartConfig.width}
                    height={chartConfig.height}
                    fallback={<p>Chart is not available</p>}
                    type={chartType()!}
                    data={chartData()}
                    options={{ ...chartOptions() }}
                />
            </div>
        </div>
    )
}

export default CustomChart
