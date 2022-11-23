import { ChartData } from '@src/static/ChartData'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react'

export function useChartRequestHook() {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const interval = setInterval(() => {
            ChartData.forEach((chartData) => {
                setLoading(true)
                invoke('do_rest_request', {
                    endpoint: chartData['ip'] + chartData['endpoint'],
                    //deviceName: chartData['deviceName'],
                    method: 'GET',
                })
                    .then((response) => {
                        if (typeof response === 'string') {
                            const parsedResponse = JSON.parse(response)
                            //console.log(parsedResponse)
                            setData((prevData) => ({
                                ...prevData,
                                [chartData['object_id']]: parsedResponse,
                            }))
                            //console.log(data)
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
        }, 300)
        return () => clearInterval(interval)
    }, [data])
    return { data, loading, error }
}
