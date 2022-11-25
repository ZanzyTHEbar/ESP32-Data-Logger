/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  faLineChart,
  faBarChart,
  faAreaChart,
  faTrashCan,
  faSave,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChartData } from '@src/static/ChartData'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
//import Highcharts from "highcharts/highmaps";
import { useState, useRef, useEffect } from 'react'
import type HighchartsTypes from 'highcharts-react-official'

//! Docs: https://api.highcharts.com/highcharts/
//! Docs: https://www.highcharts.com/docs/

export default function Chart(props) {
  const [hoverData, setHoverData] = useState('')
  const chartRef = useRef<HighchartsTypes.RefObject>(null)
  const [chartOptions] = useState({
    title: { text: props.title },
    subtitle: {
      text: 'Use buttons to change chart type',
    },
    accessibility: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' },
    },
    yAxis: {
      title: { text: props.yAxis },
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
      },
    ],
    plotOptions: {
      line: {
        animation: false,
        dataLabels: { enabled: true },
      },
      series: {
        color: props.lineColor,
        point: {
          events: {
            mouseOver: (e) => {
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

  const updateChartType = (e: any) => {
    if (!chartRef || !chartRef.current) {
      return
    }
    const dataType: string = e.target.dataset
    const type: any = dataType['user']
    //console.log(dataType)
    //console.log(type)
    const chart = chartRef.current.chart
    chart.series[0].update({
      type: type,
    })
  }
  const handleDelete = () => {
    if (ChartData.length >= 1) {
      const charts = ChartData.filter((item) => item['object_id'] !== props.object_id)
      ChartData.splice(0, ChartData.length, ...charts)
      console.log(ChartData)
    }
  }

  return (
    <div className="card">
      <div id="button-row" className="flex justify-end py-[2px]">
        <div id="chart-types">
          <button
            data-user="line"
            onClick={updateChartType}
            className="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
            <FontAwesomeIcon data-user="line" icon={faLineChart} />
          </button>
          <button
            data-user="bar"
            onClick={updateChartType}
            className="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
            <FontAwesomeIcon data-user="bar" icon={faBarChart} />
          </button>
          <button
            data-user="area"
            onClick={updateChartType}
            className="py-1 px-2 mx-[1px] bg-green-500 hover:bg-green-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-green-700 transition duration-100 ease-in focus:shadow-inner">
            <FontAwesomeIcon data-user="area" icon={faAreaChart} />
          </button>
        </div>
        <button
          onClick={handleDelete}
          className="py-1 px-2 mx-[1px] bg-blue-400 hover:bg-blue-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-blue-700 transition duration-100 ease-in focus:shadow-inner">
          <FontAwesomeIcon icon={faSave} />
        </button>
        <button
          onClick={handleDelete}
          className="py-1 px-2 mx-[1px] bg-red-400 hover:bg-red-600 focus:outline-none text-white font-medium text-sm rounded-md text-rounded shadow-md hover:shadow-xl focus:bg-red-700 transition duration-100 ease-in focus:shadow-inner">
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
        {/* <button className="pie-chart">
                        <FontAwesomeIcon icon={faPieChart} />
                    </button> */}
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        allowChartUpdate={true}
        immutable={false}
        updateArgs={[true, true, true]}
        containerProps={{ className: 'chartContainer' }}
        ref={chartRef}
      />
      <h3>Hovering over {hoverData}</h3>
    </div>
  )
}
