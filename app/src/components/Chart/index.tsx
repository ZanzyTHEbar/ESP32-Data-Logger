/* eslint-disable @typescript-eslint/no-explicit-any */
import { faLineChart, faBarChart, faAreaChart } from '@fortawesome/free-solid-svg-icons'
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
      document.querySelectorAll('#button-row button').forEach(function (button) {
        button.addEventListener('click', function () {
          const type: any = button.className.split('-')[0]
          chart.series[0].update({
            type: type,
          })
        })
      })
    }, props.interval)
    return () => clearInterval(interval)
  }, [props.data, props.interval])

  const handleDelete = () => {
    //console.log(ChartData.length);
    if (ChartData.length > 1) ChartData.pop()
    else if (ChartData.length === 1) {
      //console.log("here");
      ChartData.pop()
      ChartData.push({})
    }
  }

  return (
    <div className="card">
      <div className="container mx-auto">
        <div id="button-row">
          <button className="line-chart">
            <FontAwesomeIcon icon={faLineChart} />
          </button>
          <button className="column-chart">
            <FontAwesomeIcon icon={faBarChart} />
          </button>
          <button className="area-chart">
            <FontAwesomeIcon icon={faAreaChart} />
          </button>
          <button
            onClick={handleDelete}
            className="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner">
            Delete Last
          </button>
          {/* <button className="pie-chart">
                        <FontAwesomeIcon icon={faPieChart} />
                    </button> */}
        </div>
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
