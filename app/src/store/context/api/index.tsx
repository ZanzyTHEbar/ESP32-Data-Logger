import { invoke } from '@tauri-apps/api/tauri'
import { createContext, useContext, createMemo, type Component, type Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { error } from 'tauri-plugin-log-api'
import type { Context } from '@static/types'
import { AppStoreAPI, IEndpoint } from '@src/static/types/interfaces'
import { RESTStatus, RESTType } from '@static/types/enums'

interface AppAPIContext {
    /********************************* rest *************************************/
    getRESTStatus?: Accessor<RESTStatus>
    getRESTDevice?: Accessor<string>
    getRESTResponse?: Accessor<object>
    setRESTStatus?: (status: RESTStatus) => void
    setRESTDevice?: (device: string) => void
    setRESTResponse?: (response: object) => void
    /********************************* endpoints *************************************/
    getEndpoints?: Accessor<Map<string, IEndpoint>>
    getEndpoint?: (key: string) => IEndpoint | undefined
    /********************************* hooks *************************************/
    useRequestHook: (endpointName: string, deviceName: string, args: string) => Promise<void>
}

const AppAPIContext = createContext<AppAPIContext>()
export const AppAPIProvider: Component<Context> = (props) => {
    const endpointsMap: Map<string, IEndpoint> = new Map<string, IEndpoint>([
        ['ping', { url: '/builtin/command/ping', type: RESTType.GET }],
        ['save', { url: '/builtin/command/save', type: RESTType.GET }],
        ['resetConfig', { url: '/builtin/command/resetConfig', type: RESTType.GET }],
        ['rebootDevice', { url: '/builtin/command/rebootDevice', type: RESTType.GET }],
        ['json', { url: '/builtin/command/json', type: RESTType.GET }],
        ['getStoredConfig', { url: '/builtin/command/getStoredConfig', type: RESTType.GET }],
        ['setTxPower', { url: '/builtin/command/setTxPower', type: RESTType.POST }],
        ['setDevice', { url: '/builtin/command/setDevice', type: RESTType.POST }],
        ['wifi', { url: '/builtin/command/wifi', type: RESTType.POST }],
        ['wifiStrength', { url: '/builtin/command/wifiStrength', type: RESTType.POST }],
        ['ota', { url: 'update', type: RESTType.POST }],
    ])

    const defaultState: AppStoreAPI = {
        restAPI: {
            status: RESTStatus.COMPLETE,
            device: '',
            response: {},
        },
    }

    const [state, setState] = createStore<AppStoreAPI>(defaultState)
    const apiState = createMemo(() => state)

    /********************************* rest *************************************/
    //#region rest
    const setRESTStatus = (status: RESTStatus) => {
        setState(
            produce((s) => {
                s.restAPI.status = status
            }),
        )
    }
    const setRESTDevice = (device: string) => {
        setState(
            produce((s) => {
                s.restAPI.device = device
            }),
        )
    }
    const setRESTResponse = (response: object) => {
        setState(
            produce((s) => {
                s.restAPI.response = response
            }),
        )
    }
    const getRESTStatus = createMemo(() => apiState().restAPI.status)
    const getRESTDevice = createMemo(() => apiState().restAPI.device)
    const getRESTResponse = createMemo(() => apiState().restAPI.response)
    const getEndpoints = createMemo(() => endpointsMap)
    const getEndpoint = (key: string) => endpointsMap.get(key)
    //#endregion

    //#region hooks
    const useRequestHook = async (
        endpointName: string,
        deviceName: string,
        method?: string,
        args?: string,
    ) => {
        setRESTStatus(RESTStatus.LOADING)

        try {
            let endpoint: string

            // get the key that matches the endpoint name
            const keys = [...getEndpoints().keys()].filter((key) => key === endpointName)
            const key = keys[0]

            if (keys.length === 0) {
                error(
                    `[REST Request]: Endpoint not found in builtin map, using passed in value ${endpointName}`,
                )
                endpoint = endpointName
                if (args) {
                    endpoint += args
                }
            } else {
                endpoint = getEndpoints().get(key)?.url ?? ''
            }

            if (args) {
                endpoint += args
            }

            console.log(`[REST Request]: ${deviceName}${endpoint} ${method}`)

            const response = await invoke('do_rest_request', {
                endpoint,
                deviceName,
                method,
            })
            if (typeof response === 'string') {
                setRESTStatus(RESTStatus.ACTIVE)
                const parsedResponse = JSON.parse(response)
                //console.log(parsedResponse)
                setRESTResponse(parsedResponse)
            }
            setRESTStatus(RESTStatus.COMPLETE)
        } catch (err) {
            setRESTStatus(RESTStatus.FAILED)
            error(`[REST Request]: ${err}`)
        }
    }
    //#endregion

    //#region API Provider
    return (
        <AppAPIContext.Provider
            value={{
                getRESTStatus,
                getRESTDevice,
                getRESTResponse,
                setRESTStatus,
                setRESTDevice,
                setRESTResponse,
                getEndpoints,
                getEndpoint,
                useRequestHook,
            }}>
            {props.children}
        </AppAPIContext.Provider>
    )
    //#endregion
}

export const useAppAPIContext = () => {
    const context = useContext(AppAPIContext)
    if (context === undefined) {
        throw new Error('useAppAPIContext must be used within an AppAPIProvider')
    }
    return context
}
