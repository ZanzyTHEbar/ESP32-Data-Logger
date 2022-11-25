import { ChartData } from '@src/static/ChartData'
import { invoke } from '@tauri-apps/api/tauri'
// import { useState } from 'react'

export async function getChartRequest(): Promise<object | Error> {
  const data: object = {}

  for (const chartDataIndex in ChartData) {
    const chartData = ChartData[chartDataIndex]
    const response = await invoke('do_rest_request', {
      endpoint: chartData['ip'] + chartData['endpoint'],
      //deviceName: chartData['deviceName'],
      method: 'GET',
    })
    if (typeof response === 'string') {
      const parsedResponse = JSON.parse(response)
      data[chartData['object_id']] = parsedResponse
    } else {
      return new Error('Failed to fetch!')
    }
  }
  return data
}

// export function useChartRequestHook() {
//   const [data, setData] = useState({})
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   function doRequest() {
//     ChartData.forEach((chartData) => {
//       setLoading(true)

//       await invoke ('get_chart_data', chartData)

//       /* invoke('do_rest_request', {
//         endpoint: chartData['ip'] + chartData['endpoint'],
//         //deviceName: chartData['deviceName'],
//         method: 'GET',
//       })
//         .then((response) => {
//           if (typeof response === 'string') {
//             const parsedResponse = JSON.parse(response)
//             setData((prevData) => ({
//               ...prevData,
//               [chartData['object_id']]: parsedResponse,
//             }))
//           }
//         })
//         .catch((err) => {
//           console.log(err)
//           setError(err)
//         })
//         .finally(() => {
//           setLoading(false)
//         }) */
//     })
//   }
//   return { data, loading, error, doRequest }
// }
