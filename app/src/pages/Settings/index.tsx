import Input from '@components/Inputs'
import { Tooltip } from '@components/Tooltip'
import { SettingsPageData } from '@src/static/SettingsPageData'
import { useChartContext, useChartContextUpdate } from '@src/utils/hooks/chartData'
import React, { useState } from 'react'

interface Isettings {
  // eslint-disable-next-line autofix/no-unused-vars
  handleChange: (value: string, id: string) => void
  inputState: object
}

/* <div className="flex flex-wrap w-full">
      <form className="w-full">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          <div className="flex items-center">
            <label
              className="text-gray-500 font-bold mb-1 md:mb-0 whitespace-nowrap mr-2"
              for="inline-password">
              First Name
            </label>
          </div>
          <div className="flex items-center col-span-3">
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
              id="first-name"
              type="text"
              placeholder="First Name"
            />
          </div>
          <div className="flex items-center">
            <label
              className="block text-gray-500 font-bold mb-1 md:mb-0 whitespace-nowrap mr-2"
              for="last-name">
              Last Name
            </label>
          </div>
          <div className="flex items-center col-span-3">
            <input
              className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
              id="inline-password"
              type="text"
              placeholder="Last Name"
            />
          </div>
        </div>
      </form>
    </div> */

interface Ibuttongroup {
  handleSave: () => void
  handleDeleteAll: () => void
  handleReset: () => void
}

const SettingsPane = ({
  handleChange,
  inputState,
  handleSave,
  handleDeleteAll,
  handleReset,
}: Isettings & Ibuttongroup) => {
  return (
    <div className="flex flex-wrap w-full">
      <form className="w-full">
        <div className="grid grid-cols-3 gap-3 content-center justify-center">
          {SettingsPageData.map((item) => {
            return (
              <>
                <div className="col-span-1 flex items-center content-center justify-center">
                  <Tooltip tooltip={item.tooltip}>
                    <div className="pt-1 pr-1 ml-16 text-gray-700 dark:text-gray-600">
                      {item.icon}
                    </div>
                    <label className="" htmlFor={item.id}>
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-500">
                        {item.title}
                      </div>
                    </label>
                  </Tooltip>
                </div>
                <div className="flex items-center col-span-2">
                  <Input
                    key={item.id}
                    type="text"
                    id={item.id}
                    placeholder={item.placeholder}
                    value={inputState[item.id] ?? ''}
                    setValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(event.target.value, item.id)
                    }
                  />
                </div>
              </>
            )
          })}
        </div>
        <ButtonGroup
          handleSave={handleSave}
          handleDeleteAll={handleDeleteAll}
          handleReset={handleReset}
        />
      </form>
    </div>
  )
}

const ButtonGroup = ({ handleDeleteAll, handleSave, handleReset }: Ibuttongroup) => {
  return (
    <div className="pl-[3rem] pt-[4rem] pb-[1rem] md:mr-[2rem]">
      <button
        onClick={handleSave}
        className="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner">
        Add Chart
      </button>
      <button
        onClick={handleDeleteAll}
        className="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner">
        Clear All Charts
      </button>
      <button
        onClick={handleReset}
        className="xs:mr-[1.75rem] xs:mt-[1rem] ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner">
        Reset Form
      </button>
    </div>
  )
}

const CTA = () => {
  return (
    <div id="dropdown-cta" className="p-4 mt-6 bg-blue-50 rounded-lg dark:bg-blue-900" role="alert">
      <div className="flex items-center mb-3">
        <span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900">
          Info
        </span>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 inline-flex h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
          data-collapse-toggle="dropdown-cta"
          aria-label="Close">
          <span className="sr-only">Close</span>
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p className="mb-3 text-sm text-blue-900 dark:text-blue-400">
        Your URL is{' '}
        <u>
          <em
            style={{
              color: 'red',
            }}>
            required
          </em>
        </u>{' '}
        to be set in order to use the app. Please enter your URL in the settings. The URL must be a
        valid URL for a <b>GET</b> request.
      </p>
    </div>
  )
}

const Header = () => {
  return (
    <div className="flex items-center justify-center">
      <header className="mb-8 text-2xl font-bold text-[#059e8a]">Settings</header>
    </div>
  )
}

const Settings = () => {
  const settingsData = {
    ip: '',
    endpoint: '',
    title: '',
    app_title: '',
    y_axis_title: '',
    line_color: '',
    interval: 3000,
    object_id: '',
    chart_id: '',
    cName: 'graphContainer',
  }
  const [inputState, setInputState] = useState(settingsData)
  const chartContext = useChartContext()
  const chartContextUpdate = useChartContextUpdate()
  const handleChange = (value: string, id: string) => {
    setInputState({ ...inputState, [id]: value })
  }
  const handleSave = () => {
    //chartContext.push(inputState)
    const size = chartContext.length
    const id = (size + 1).toString()
    const chart = { ...inputState, chart_id: id }
    chartContextUpdate(chart)
  }
  const handleReset = () => {
    setInputState(settingsData)
  }
  const handleDeleteAll = () => {
    chartContext.splice(0, chartContext.length)
  }

  return (
    <div className="overflow-x-auto py-4 px-3 rounded-lg dark:bg-gray-300 z-10 h-[100%]">
      <Header />
      <SettingsPane
        handleChange={handleChange}
        handleDeleteAll={handleDeleteAll}
        handleSave={handleSave}
        handleReset={handleReset}
        inputState={inputState}
      />
      <CTA />
    </div>
  )
}

export default Settings
