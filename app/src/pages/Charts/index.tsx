import Chart from '@components/Chart'
import { ChartData } from '@src/static/ChartData'
//import { getChartRequest } from '@src/utils/Helpers/chartRequest'
import { useChartRequestHook } from '@src/utils/Helpers/chartRequest'
import { useState, useEffect } from 'react'

function fetchFromObject(obj: object, prop: string) {
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

function NoCharts() {
  return (
    <div
      className="flex items-center justify-center fixed h-[100%]"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        WebkitTransform: 'translate(-50%, -50%)',
      }}>
      <header
        style={{
          color: '#059e8a',
        }}
        className="text-2xl font-bold">
        No charts to display yet.
        <br />
        Please add a chart in the settings page.
      </header>
    </div>
  )
}

function ChartList({ chartData }) {
  return (
    <>
      {chartData !== null ? (
        <ul className="flow-root items-center content-center justify-center flex-col">
          {ChartData.map((item, index) => (
            <li key={index} className={item['cName']}>
              {item['interval'] === 0 ? (item['interval'] = 3000) : null}
              <Chart
                title={item['title']}
                yAxis={item['y_axis_title']}
                lineColor={item['line_color']}
                object_id={item['object_id']}
                data={fetchFromObject(chartData[item['object_id']], item['object_id'] || '')}
                interval={item['interval']}
              />
            </li>
          ))}
        </ul>
      ) : (
        <NoCharts />
      )}
    </>
  )
}

function ChartContent() {
  const [chartData, setData] = useState<object | null>(null)
  const { data, doRequest } = useChartRequestHook()
  useEffect(() => {
    const id = setInterval(async () => {
      const empty: boolean = Object.keys(ChartData).length === 0
      if (!empty) {
        doRequest()
        setData(data)
      } else if (empty) {
        setData(null)
      } else {
        setData(null)
      }
    }, 1000)
    return () => {
      clearInterval(id)
    }
  }, [data, doRequest])
  return <ChartList chartData={chartData} />
}

export default function Charts() {
  return (
    <div className="chart-div pb-[20px]">
      <ChartContent />
    </div>
  )
}
