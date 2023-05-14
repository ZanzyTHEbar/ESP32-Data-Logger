import { invoke } from '@tauri-apps/api/tauri'
import { createContext, useContext, createMemo, type Component, Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { debug, error } from 'tauri-plugin-log-api'
import { useAppContext } from '../app'
import type { Context } from '@static/types'
import type { AppStoreMdns, MdnsResponse } from '@static/types/interfaces'
import { MdnsStatus } from '@static/types/enums'

interface AppMDNSContext {
    getMdnsStatus: Accessor<MdnsStatus>
    getMdnsData: Accessor<MdnsResponse>
    getMdnsAddresses: Accessor<string[]>
    setMdnsStatus: (status: MdnsStatus) => void
    setMdnsData: (data: MdnsResponse) => void
    setMdnsAddresses: (addresses: string[]) => void
    useMDNSScanner: (serviceType: string, scanTime: number) => Promise<never[] | undefined>
}

const AppMDNSContext = createContext<AppMDNSContext>()
export const AppMdnsProvider: Component<Context> = (props) => {
    const { getEnableMDNS } = useAppContext()

    const defaultState: AppStoreMdns = {
        mdnsStatus: MdnsStatus.DISABLED,
        mdnsData: {
            ips: [],
            names: [],
        },
        addresses: [],
    }

    const [state, setState] = createStore<AppStoreMdns>(defaultState)

    const setMdnsStatus = (status: MdnsStatus) => {
        setState(
            produce((s) => {
                s.mdnsStatus = status
            }),
        )
    }

    const setMdnsData = (data: MdnsResponse) => {
        setState(
            produce((s) => {
                s.mdnsData = data
            }),
        )
    }

    const setMdnsAddresses = (addresses: string[]) => {
        setState(
            produce((s) => {
                s.addresses = addresses
            }),
        )
    }

    const setAddMdnsAddress = (address: string) => {
        setState(
            produce((s) => {
                s.addresses.push(address)
            }),
        )
    }

    const useMDNSScanner = async (serviceType: string, scanTime: number) => {
        if (!getEnableMDNS()) return
        if (serviceType === '' || scanTime === 0) {
            return []
        }
        debug(`[MDNS Scanner]: scanning for ${serviceType} for ${scanTime} seconds`)
        setMdnsStatus(MdnsStatus.LOADING)

        try {
            const res = await invoke('run_mdns_query', {
                serviceType,
                scanTime,
            })

            debug(`[MDNS Scanner]: response - ${res}`)
            const response = res as MdnsResponse
            setMdnsStatus(MdnsStatus.ACTIVE)
            setMdnsData(response)
            // loop through the res and add the cameras to the store
            const size = Object.keys(response.names).length
            for (let i = 0; i < size; i++) {
                // grab the unknown key and use it to access the res.urls object
                const key = Object.keys(response.names)[i]
                debug('[MDNS Scanner]: adding device', response.names[key])
                const address = `http://${response.names[key]}.local`
                setAddMdnsAddress(address)
            }
        } catch (err) {
            error(`[MDNS Scanner]: error ${err}`)
            setMdnsStatus(MdnsStatus.FAILED)
        }
    }

    const mdnsState = createMemo(() => state)
    const getMdnsStatus = createMemo(() => mdnsState().mdnsStatus)
    const getMdnsData = createMemo(() => mdnsState().mdnsData)
    const getMdnsAddresses = createMemo(() => mdnsState().addresses)

    return (
        <AppMDNSContext.Provider
            value={{
                getMdnsStatus,
                getMdnsData,
                getMdnsAddresses,
                setMdnsStatus,
                setMdnsData,
                setMdnsAddresses,
                useMDNSScanner,
            }}>
            {props.children}
        </AppMDNSContext.Provider>
    )
}

export const useAppMDNSContext = () => {
    const context = useContext(AppMDNSContext)
    if (context === undefined) {
        throw new Error('useAppMDNSContext must be used within an AppMDNSProvider')
    }
    return context
}
