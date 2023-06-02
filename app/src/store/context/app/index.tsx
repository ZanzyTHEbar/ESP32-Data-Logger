import { createContext, useContext, createMemo, type Component, type Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { attachConsole } from 'tauri-plugin-log-api'
import { AppAPIProvider } from '../api'
import { AppChartProvider } from '../chart'
import { AppMdnsProvider } from '../mdns'
import { AppNotificationProvider } from '../notifications'
import { AppUIProvider } from '../ui'
import type { Context, DebugMode } from '@static/types'
import type { AppStore } from '@static/types/interfaces'
import type { UnlistenFn } from '@tauri-apps/api/event'

interface AppContext {
    getDetachConsole: Accessor<Promise<UnlistenFn>>
    getDebugMode: Accessor<DebugMode>
    getEnableMDNS: Accessor<boolean>
    setEnableMDNS: (flag: boolean | undefined) => void
    setDebugMode: (mode: DebugMode | undefined) => void
}

const AppContext = createContext<AppContext>()
export const AppProvider: Component<Context> = (props) => {
    const detachConsole = attachConsole()

    //#region Store
    const defaultState: AppStore = {
        debugMode: 'off',
        enableMDNS: true,
    }

    const [state, setState] = createStore<AppStore>(defaultState)

    const setDebugMode = (mode: DebugMode | undefined) => {
        setState(
            produce((s) => {
                s.debugMode = mode || 'info'
            }),
        )
    }

    const setEnableMDNS = (flag: boolean | undefined) => {
        setState(
            produce((s) => {
                s.enableMDNS = flag || false
            }),
        )
    }

    const appState = createMemo(() => state)
    const getDebugMode = createMemo(() => appState().debugMode)
    const getEnableMDNS = createMemo(() => appState().enableMDNS)
    const getDetachConsole = createMemo(() => detachConsole)
    //#endregion

    return (
        <AppContext.Provider
            value={{
                getDetachConsole,
                getEnableMDNS,
                getDebugMode,
                setEnableMDNS,
                setDebugMode,
            }}>
            <AppUIProvider>
                <AppNotificationProvider>
                    <AppAPIProvider>
                        <AppMdnsProvider>
                            <AppChartProvider>{props.children}</AppChartProvider>
                        </AppMdnsProvider>
                    </AppAPIProvider>
                </AppNotificationProvider>
            </AppUIProvider>
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useAppContext must be used within a AppProvider')
    }
    return context
}
