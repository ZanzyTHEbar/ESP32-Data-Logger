/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { For, createSignal, onMount } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { createAsyncMemo } from 'solidjs-use'
import Input from '@components/Inputs'
import CustomTooltip from '@components/Tooltip'
import { SettingsPageData } from '@static/SettingsPageData'
import { ChartSettings } from '@static/types/interfaces'
import { useAppChartContext } from '@store/context/chart'
import { clearObject } from '@utils/utils'
import './styles.css'

interface ISettings {
    handleChange: (value: string, id: string) => void
    inputState: object
}

interface IButtonGroup {
    handleSave: () => void
    handleDeleteAll: () => void
    handleReset: () => void
    isEditing?: boolean
}

const SettingsPane = (props: ISettings & IButtonGroup) => {
    return (
        <div class="responsive-container justify-between items-center pr-3 pl-3 py-3 h-full min-h-[222px] pb-3 rounded-xl flex card">
            <div class="responsive-flex-container w-full h-full flex items-center flex-row">
                <div class="justify-between responsive-spacer-container rounded-b-xl min-[1749px]:rounded-xl h-full w-full p-3">
                    <div class="settings_grid">
                        <For each={SettingsPageData}>
                            {(item) => {
                                return (
                                    <div class="hover:border-[#817DF7] hover:cursor-pointer">
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
                                    </div>
                                )
                            }}
                        </For>
                    </div>
                    <ButtonGroup
                        handleSave={props.handleSave}
                        handleDeleteAll={props.handleDeleteAll}
                        handleReset={props.handleReset}
                        isEditing={props.isEditing}
                    />
                </div>
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
                {props.isEditing ? 'Save Changes' : 'Add Chart'}
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
                <u
                    style={{
                        color: '#E4FDE1',
                    }}>
                    {' '}
                    required{' '}
                </u>
                to use the app. Please enter your URL in the settings. The URL must be a valid URL
                for a <b>GET</b> request.
            </p>
        </div>
    )
}

const Header = () => {
    return (
        <div class="flex items-center justify-center">
            <header class="text-2xl font-bold text-secondary">Settings</header>
        </div>
    )
}

const Settings = () => {
    const {
        getCharts,
        setAddChart,
        setRemoveAllCharts,
        getSelectedChart,
        setSelectedChart,
        setEditChart,
    } = useAppChartContext()
    const [editing, setEditing] = createSignal(false)
    const [inputStore, setInputState] = createStore<ChartSettings>({
        ip: '',
        endpoint: '',
        title: '',
        //app_title: '',
        y_axis_title: '',
        object_id_label: '',
        line_color: '',
        interval: 3000,
        object_id: '',
        chart_id: '',
        cName: 'graphContainer',
    })
    const inputState = createAsyncMemo(() => inputStore)

    onMount(() => {
        //console.log('getSelectedChart()', getSelectedChart())
        if (getSelectedChart()) {
            const size = getSelectedChart()?.chart_id.length
            if (size! > 0) {
                console.log('getSelectedChart()', getSelectedChart())
                setEditing(true)
                setInputState(getSelectedChart()!)
                const inputs = document.querySelectorAll('input')
                inputs.forEach((input) => {
                    input.value = getSelectedChart()![input.id]
                })
            }
        }
    })

    const handleChange = (value: string, id: string) => {
        setInputState(
            produce((draft: ChartSettings) => {
                draft[id] = value
            }),
        )
        //console.log(inputState())
    }

    const handleSave = () => {
        if (editing()) {
            setEditChart(inputState())
            return
        }
        const size = getCharts().settings.length
        const id = (size + 1).toString()
        const chart = { ...inputState(), chart_id: id }
        setAddChart(chart)
        //handleReset()
    }

    const handleReset = () => {
        //* Reset the input state to the default values
        setInputState(
            produce((draft: ChartSettings) => {
                clearObject(draft)
            }),
        )
        setSelectedChart(inputState())
        //* Reset the input elements to the default values
        const inputs = document.querySelectorAll('input')
        inputs.forEach((input) => {
            input.value = ''
        })
    }

    return (
        <div class="flex flex-col justify-center items-center content-center grow overflow-x-auto py-4 px-3 rounded-lg z-10 h-full w-full">
            <Header />
            <SettingsPane
                handleChange={handleChange}
                handleDeleteAll={setRemoveAllCharts}
                handleSave={handleSave}
                handleReset={handleReset}
                inputState={inputState}
                isEditing={editing()}
            />
            <CTA />
        </div>
    )
}

export default Settings
