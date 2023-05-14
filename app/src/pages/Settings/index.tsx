import { useChartContext, useChartContextUpdate } from '@src/utils/hooks/chartData'
import { For } from 'solid-js'
import Input from '@components/Inputs'
import { Tooltip } from '@components/Tooltip'
import { SettingsPageData } from '@src/static/SettingsPageData'

interface Isettings {
    handleChange: (value: string, id: string) => void
    inputState: object
}

interface Ibuttongroup {
    handleSave: () => void
    handleDeleteAll: () => void
    handleReset: () => void
}

const SettingsPane = (props: Isettings & Ibuttongroup) => {
    return (
        <div class="flex flex-wrap w-full">
            <div class="w-full">
                <div class="grid auto-cols-auto gap-4 place-content-center">
                    <For each={SettingsPageData}>
                        {(item) => {
                            return (
                                <>
                                    <div class="col-auto flex items-center content-center">
                                        <Tooltip tooltip={item.tooltip}>
                                            <div class="pt-1 pr-1 text-gray-700 dark:text-gray-600">
                                                {item.icon}
                                            </div>
                                            <label class="" for={item.id}>
                                                <div class="text-sm font-medium text-gray-700 dark:text-gray-500">
                                                    {item.title}
                                                </div>
                                            </label>
                                        </Tooltip>
                                    </div>
                                    <div class="flex items-center col-auto">
                                        <Input
                                            data-key={item.id}
                                            type="text"
                                            id={item.id}
                                            placeholder={item.placeholder}
                                            value={props.inputState[item.id] ?? ''}
                                            setValue={(
                                                event: React.ChangeEvent<HTMLInputElement>,
                                            ) => props.handleChange(event.target.value, item.id)}
                                        />
                                    </div>
                                </>
                            )
                        }}
                    </For>
                </div>
                <ButtonGroup
                    handleSave={props.handleSave}
                    handleDeleteAll={props.handleDeleteAll}
                    handleReset={props.handleReset}
                />
            </div>
        </div>
    )
}

const ButtonGroup = (props: Ibuttongroup) => {
    return (
        <div class="pl-[3rem] pt-[4rem] pb-[1rem] md:mr-[2rem]">
            <button
                onClick={() => props.handleSave()}
                class="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner">
                Add Chart
            </button>
            <button
                onClick={() => props.handleDeleteAll()}
                class="ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner">
                Clear All Charts
            </button>
            <button
                onClick={() => props.handleReset()}
                class="xs:mr-[1.75rem] xs:mt-[1rem] ml-auto bg-blue-700 hover:bg-blue-800 focus:outline-none text-white font-medium text-sm rounded-lg py-2.5 px-5 text-rounded mr-5 shadow-md hover:shadow-xl focus:bg-blue-600 transition duration-100 ease-in focus:shadow-inner">
                Reset Form
            </button>
        </div>
    )
}

const CTA = () => {
    return (
        <div id="dropdown-cta" class="p-4 mt-6 bg-blue-50 rounded-lg dark:bg-blue-900" role="alert">
            <div class="flex items-center mb-3">
                <span class="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900">
                    Info
                </span>
                <button
                    type="button"
                    class="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 inline-flex h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                    data-collapse-toggle="dropdown-cta"
                    aria-label="Close">
                    <span class="sr-only">Close</span>
                    <svg
                        aria-hidden="true"
                        class="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            <p class="mb-3 text-sm text-blue-900 dark:text-blue-400">
                Your URL is{' '}
                <u>
                    <em
                        style={{
                            color: 'red',
                        }}>
                        required
                    </em>
                </u>{' '}
                to be set in order to use the app. Please enter your URL in the settings. The URL
                must be a valid URL for a <b>GET</b> request.
            </p>
        </div>
    )
}

const Header = () => {
    return (
        <div class="flex items-center justify-center">
            <header class="mb-8 text-2xl font-bold text-[#059e8a]">Settings</header>
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
        <div class="overflow-x-auto py-4 px-3 rounded-lg dark:bg-gray-300 z-10 h-[100%]">
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
