// use context api to share data between components
// https://reactjs.org/docs/context.html

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface IChartContext {
  children: ReactNode
}

type IChartDataContext = {
  ip: string
  endpoint: string
  title: string
  y_axis_title: string
  line_color: string
  interval: number
  object_id: string
  chart_id: string
  cName: string
}

type IUpdateChartDataContext = {
  // eslint-disable-next-line autofix/no-unused-vars
  (data: IChartDataContext): void | undefined | null
}

const ChartDataContext = createContext<IChartDataContext[]>([])
// eslint-disable-next-line @typescript-eslint/no-empty-function
const UpdateChartDataContext = createContext<IUpdateChartDataContext>(() => {})

const useChartContext = () => {
  return useContext(ChartDataContext)
}

const useChartContextUpdate = () => {
  return useContext(UpdateChartDataContext)
}

const ChartProvider = ({ children }: IChartContext) => {
  const [chartData, setChartData] = useState<IChartDataContext[]>([])

  const updateChartData = (data: IChartDataContext) => {
    setChartData((prevData) => [...prevData, data])
  }

  return (
    <ChartDataContext.Provider value={chartData}>
      <UpdateChartDataContext.Provider value={updateChartData}>
        {children}
      </UpdateChartDataContext.Provider>
    </ChartDataContext.Provider>
  )
}

export { ChartProvider, useChartContext, useChartContextUpdate }
// Path: src\utils\hooks\useChartData.tsx
