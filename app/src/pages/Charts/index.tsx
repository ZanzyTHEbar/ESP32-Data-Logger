import Chart from '@components/Chart'
import { ChartData } from '@src/static/ChartData'
import { useChartRequestHook } from '@src/utils/hooks/chartRequestHook'
// recursive function to get data from API
// handles nested objects
function fetchFromObject(obj, prop) {
  if (typeof obj === 'undefined' || obj === null) {
    return false
  }
  const _index = prop.indexOf('.')
  if (_index > -1) {
    return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1))
  }
  return obj[prop]
}

export default function Charts() {
  const isEmpty = Object.keys(ChartData[0]).length === 0
  const { data /* , loading, error */ } = useChartRequestHook()
  return (
    <div className="chart-div pb-[20px]">
      {ChartData.length === 1 && isEmpty ? (
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
      ) : (
        <ul className="flow-root items-center content-center justify-center flex-col">
          {ChartData.map((item, index) => (
            <li key={index} className={item['cName']}>
              {item['interval'] === 0 ? (item['interval'] = 3000) : null}
              <Chart
                title={item['title']}
                yAxis={item['y_axis_title']}
                lineColor={item['line_color']}
                data={fetchFromObject(data[item['object_id']], item['object_id'] || '')}
                interval={item['interval']}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
