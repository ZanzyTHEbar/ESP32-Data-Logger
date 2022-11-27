import { Tooltip } from '@components/Tooltip'
import {
  faLineChart,
  faBarChart,
  faAreaChart,
  faTrashCan,
  faSave,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import localStorageHandler from '@src/utils/Helpers/localStorageHandler'
import { useChartContext } from '@src/utils/hooks/chartData'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Boost from 'highcharts/modules/boost'
import React, { useState, useRef, useEffect } from 'react'
import type HighchartsTypes from 'highcharts-react-official'
Boost(Highcharts)
//! Docs: https://api.highcharts.com/highcharts/
//! Docs: https://www.highcharts.com/docs/

interface Ibuttongroup {
  handleSave: () => void
  handleDelete: () => void
  // eslint-disable-next-line autofix/no-unused-vars
  updateChartType: (value: string) => void
}
function ButtonGroup({ handleDelete, handleSave, updateChartType }: Ibuttongroup) {
  return (
    <div id="button-row" className="flex justify-end py-[2px]">
      <div id="chart-types">
        <Tooltip tooltip="Line Chart">
          <button
            data-user="line"
            onClick={(event) => updateChartType(event.currentTarget.dataset['user'] ?? '')}
            className="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
            <FontAwesomeIcon data-user="line" icon={faLineChart} />
          </button>
        </Tooltip>
        <Tooltip tooltip="Bar Chart">
          <button
            data-user="bar"
            onClick={(event) => updateChartType(event.currentTarget.dataset['user'] ?? '')}
            className="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
            <FontAwesomeIcon data-user="bar" icon={faBarChart} />
          </button>
        </Tooltip>
        <Tooltip tooltip="Area Chart">
          <button
            data-user="area"
            onClick={(event) => updateChartType(event.currentTarget.dataset['user'] ?? '')}
            className="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
            <FontAwesomeIcon data-user="area" icon={faAreaChart} />
          </button>
        </Tooltip>
      </div>
      <Tooltip tooltip="Save Chart">
        <button
          onClick={handleSave}
          className="py-1 px-2 mx-[1px] bg-blue-400 hover:bg-blue-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-blue-700 transition duration-100 ease-in focus:shadow-inner">
          <FontAwesomeIcon icon={faSave} />
        </button>
      </Tooltip>
      <Tooltip tooltip="Delete Chart">
        <button
          onClick={handleDelete}
          className="py-1 px-2 mx-[1px] bg-red-400 hover:bg-red-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-red-700 transition duration-100 ease-in focus:shadow-inner">
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </Tooltip>
      {/* <button className="pie-chart">
                        <FontAwesomeIcon icon={faPieChart} />
                    </button> */}
    </div>
  )
}
export default function Chart(props) {
  const chartContext = useChartContext()
  const [hoverData, setHoverData] = useState('')
  const chartRef = useRef<HighchartsTypes.RefObject>(null)
  const [chartOptions] = useState({
    chart: {
      zoomType: 'x',
      panning: true,
      panKey: 'shift',
    },
    title: { text: props.title, style: { color: 'black', fontWeight: 'bold' } },
    subtitle: {
      text: 'Use buttons to change chart type',
    },
    accessibility: {
      enabled: false,
    },
    boost: {
      useGPUTranslations: true,
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' },
      title: {
        style: { color: 'black' },
      },
      labels: { style: { color: 'black' } },
    },
    yAxis: {
      title: { text: props.yAxis, style: { color: 'black' } },
      labels: { style: { color: 'black' } },
    },
    credits: { enabled: false },
    series: [
      {
        showInLegend: true,
        connectNulls: true,
        showCheckbox: false,
        crisp: true,
        shadow: {
          color: '#f5f5f5',
          offsetX: 1.5,
          offsetY: 1.5,
          opacity: 0.25,
        },
        data: [],
        name: props.title,
      },
    ],
    plotOptions: {
      line: {
        animation: false,
        dataLabels: { enabled: true },
      },
      series: {
        boostThreshold: 5000,
        color: props.lineColor,
        point: {
          events: {
            mouseOver: (e: { target: { category: React.SetStateAction<string> } }) => {
              setHoverData(e.target.category)
            },
          },
        },
      },
    },
  })
  useEffect(() => {
    const interval = setInterval(() => {
      if (!chartRef || !chartRef.current) {
        return
      }
      const chart = chartRef.current.chart
      if (chart.series[0].data.length > 40) {
        chart.series[0].addPoint([new Date().getTime(), props.data], true, true, true)
      } else {
        chart.series[0].addPoint([new Date().getTime(), props.data], true, false, true)
      }
    }, props.interval)
    return () => clearInterval(interval)
  }, [props.data, props.interval])
  const updateChartType = (value: string) => {
    if (!chartRef || !chartRef.current) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type: any = value ?? ''
    const chart = chartRef.current.chart
    chart.series[0].update({
      type: type,
    })
  }
  const handleDelete = () => {
    if (chartContext.length >= 1) {
      const charts = chartContext.filter((item) => item['chart_id'] !== props.chart_id)
      chartContext.splice(0, chartContext.length, ...charts)
      // check if the same chart is in local storage
      const localCharts = JSON.parse(localStorage.getItem('charts') ?? '[]')
      const localChart = localCharts.filter((item) => item['object_id'] !== props.object_id)
      localChart.splice(0, localCharts.length, ...localChart)
      localStorage.setItem('charts', JSON.stringify(localChart))
    }
  }
  const handleSave = () => {
    if (chartContext.length >= 1) {
      const chart = {
        ip: props.ip,
        endpoint: props.endpoint,
        object_id: props.object_id,
        chart_id: props.chart_id,
        title: props.title,
        y_axis_title: props.yAxis,
        line_color: props.lineColor,
        interval: props.interval,
      }
      // store the chart in local storage as a json array

      // check if the chart already exists in the array
      const chartsArray = JSON.parse(localStorage.getItem('charts') ?? '[]')
      const chartExists = chartsArray.find((item) => item['object_id'] === props.object_id)
      if (chartExists) {
        // if it exists, update the chart
        const charts = chartsArray.map((item) => {
          if (item['object_id'] === props.object_id) {
            return chart
          }
          return item
        })
        localStorage.setItem('charts', JSON.stringify(charts))
      } else {
        // if it doesn't exist, add the chart
        chartsArray.push(chart)
        localStorage.setItem('charts', JSON.stringify(chartsArray))
      }
    }
  }

  return (
    <div className="card">
      <ButtonGroup
        handleDelete={handleDelete}
        handleSave={handleSave}
        updateChartType={updateChartType}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[true, true, true]}
        containerProps={{ className: 'chartContainer' }}
        ref={chartRef}
      />
      <h3>Hovering over {Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', parseInt(hoverData))}</h3>
    </div>
  )
}
