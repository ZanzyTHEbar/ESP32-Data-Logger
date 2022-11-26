import { useChartContext } from '@src/utils/hooks/chartData'
import { invoke } from '@tauri-apps/api/tauri'
import { useState } from 'react'

export function useChartRequestHook() {
  const chartContext = useChartContext()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  function doRequest() {
    chartContext.forEach((chartData) => {
      setLoading(true)
      invoke('do_rest_request', {
        endpoint: chartData['ip'] + chartData['endpoint'],
        //deviceName: chartData['deviceName'],
        method: 'GET',
      })
        .then((response) => {
          if (typeof response === 'string') {
            const parsedResponse = JSON.parse(response)
            setData((prevData) => ({
              ...prevData,
              [chartData['object_id']]: parsedResponse,
            }))
          }
        })
        .catch((err) => {
          console.log(err)
          setError(err)
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }
  return { data, loading, error, doRequest }
}
