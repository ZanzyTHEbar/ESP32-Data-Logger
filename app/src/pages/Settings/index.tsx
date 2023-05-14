import { For, createSignal } from 'solid-js'
import Input from '@components/Inputs'
import CustomTooltip from '@components/Tooltip'
import { SettingsPageData } from '@src/static/SettingsPageData'
import { AppStoreChart } from '@src/static/types/interfaces'
import { useAppChartContext } from '@src/store/context/chart'

interface ISettings {
    handleChange: (value: string, id: string) => void
    inputState: object
}

interface IButtonGroup {
    handleSave: () => void
    handleDeleteAll: () => void
    handleReset: () => void
}

const SettingsPane = (props: ISettings & IButtonGroup) => {
    return (
        <div class="flex flex-wrap w-full">
            <div class="w-full">
                <div class="grid auto-cols-auto gap-4 place-content-center">
                    <For each={SettingsPageData}>
                        {(item) => {
                            return (
                                <CustomTooltip tooltip={item.tooltip}>
                                    <Input
                                        onChange={props.handleChange}
                                        header={item.title}
                                        data-key={item.id}
                                        type="text"
                                        id={item.id}
                                        icon={item.icon}
                                        placeholder={item.placeholder}
                                    />
                                </CustomTooltip>
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

const ButtonGroup = (props: IButtonGroup) => {
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
        <div id="dropdown-cta" class="p-4 mt-6 rounded-lg bg-blue-900" role="alert">
            <div class="flex items-center mb-3">
                <span class="text-sm font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-200 text-blue-900">
                    Info
                </span>
            </div>
            <p class="mb-3 text-sm text-blue-400">
                Your URL is 
                <u>
                    <em
                        style={{
                            color: 'red',
                        }}>
                        required
                    </em>
                </u> 
                to be set in order to use the app. Please enter your URL in the settings. The URL
                must be a valid URL for a <b>GET</b> request.
            </p>
        </div>
    )
}

const Header = () => {
    return (
        <div class="flex items-center justify-center">
            <header class="mb-8 text-2xl font-bold text-secondary">Settings</header>
        </div>
    )
}

const Settings = () => {
    const settingsData: AppStoreChart = {
        ip: '',
        endpoint: '',
        title: '',
        //app_title: '',
        y_axis_title: '',
        line_color: '',
        interval: 3000,
        object_id: '',
        chart_id: '',
        cName: 'graphContainer',
    }

    const { getCharts, setAddChart, setRemoveAllCharts } = useAppChartContext()

    const [inputState, setInputState] = createSignal<AppStoreChart>(settingsData)

    const handleChange = (value: string, id: string) => {
        setInputState((prevState: AppStoreChart) => ({
            ...prevState,
            [id]: value,
        }))
        console.log(inputState())
    }

    const handleSave = () => {
        const size = getCharts().length
        const id = (size + 1).toString()
        const chart = { ...inputState(), chart_id: id }
        setAddChart(chart)
    }

    const handleReset = () => {
        //* Reset the input state to the default values
        setInputState(settingsData)
        //* Reset the input elements to the default values
        const inputs = document.querySelectorAll('input')
        inputs.forEach((input) => {
            input.value = ''
        })
    }

    return (
        <div class="overflow-x-auto py-4 px-3 rounded-lg dark:bg-gray-300 z-10 h-[100%]">
            <Header />
            <SettingsPane
                handleChange={handleChange}
                handleDeleteAll={setRemoveAllCharts}
                handleSave={handleSave}
                handleReset={handleReset}
                inputState={inputState}
            />
            <CTA />
        </div>
    )
}

export default Settings
