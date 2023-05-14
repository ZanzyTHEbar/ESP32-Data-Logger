import { invoke } from '@tauri-apps/api/tauri'
import { createContext, useContext, createMemo, type Component, Accessor } from 'solid-js'
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
        ['ping', { url: ':81/control/command/ping', type: RESTType.GET }],
        ['save', { url: ':81/control/command/save', type: RESTType.GET }],
        ['resetConfig', { url: ':81/control/command/resetConfig', type: RESTType.GET }],
        ['rebootDevice', { url: ':81/control/command/rebootDevice', type: RESTType.GET }],
        ['restartCamera', { url: ':81/control/command/restartCamera', type: RESTType.GET }],
        ['getStoredConfig', { url: ':81/control/command/getStoredConfig', type: RESTType.GET }],
        ['setTxPower', { url: ':81/control/command/setTxPower', type: RESTType.POST }],
        ['setDevice', { url: ':81/control/command/setDevice', type: RESTType.POST }],
        ['wifi', { url: ':81/control/command/wifi', type: RESTType.POST }],
        ['wifiStrength', { url: ':81/control/command/wifiStrength', type: RESTType.POST }],
        ['ota', { url: ':81/update', type: RESTType.POST }],
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
    const useRequestHook = async (endpointName: string, deviceName: string, args: string) => {
        let endpoint: string = getEndpoints().get(endpointName)?.url ?? ''

        if (args) {
            endpoint += args
        }
        setRESTStatus(RESTStatus.LOADING)

        try {
            const response = await invoke('do_rest_request', {
                endpoint: endpoint,
                deviceName: deviceName,
                method: getEndpoints().get(endpointName)?.type,
            })
            if (typeof response === 'string') {
                setRESTStatus(RESTStatus.ACTIVE)
                const parsedResponse = JSON.parse(response)
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
