import { For, Show, type Component } from 'solid-js'
import Chart from '@components/Chart'
import { useAppChartContext } from '@store/context/chart'

const fetchFromObject = (obj: object, prop: string) => {
    //console.log(obj)
    if (typeof obj === 'undefined' || obj === null) {
        return false
    }
    const _index = prop.indexOf('.')
    if (_index > -1) {
        return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1))
    }
    return obj[prop]
}

const NoCharts: Component = () => {
    return (
        <div
            class="flex items-center justify-center fixed h-[100%]"
            style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                '-webkit-transform': 'translate(-50%, -50%)',
            }}>
            <header
                style={{
                    color: '#059e8a',
                }}
                class="text-2xl font-bold">
                No charts to display yet.
                <br />
                Please add a chart in the settings page.
            </header>
        </div>
    )
}

const ChartList: Component = () => {
    const { getCharts } = useAppChartContext()
    return (
        <Show when={getCharts().length !== 0} fallback={<NoCharts />}>
            <ul class="flow-root items-center content-center justify-center flex-col">
                <For each={getCharts()}>
                    {(item, index) => (
                        <li data-key={index()} class={item.cName}>
                            {item.interval === 0 ? (item.interval = 3000) : null}
                            <Chart
                                ip={item.ip}
                                endpoint={item.endpoint}
                                title={item.title}
                                y_axis_title={item.y_axis_title}
                                line_color={item.line_color}
                                chart_id={item.chart_id}
                                object_id={item.object_id}
                                cName={item.cName}
                                interval={item.interval}
                            />
                        </li>
                    )}
                </For>
            </ul>
        </Show>
    )
}

export default function Charts() {
    return (
        <div class="chart-div pb-[20px]">
            <ChartList />
        </div>
    )
}
