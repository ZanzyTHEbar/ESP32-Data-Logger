import { createContext, useContext, createMemo, type Component, Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { Context } from '@static/types'
import { UiStore } from '@src/static/types/interfaces'


interface AppUIContext {
    connectedUserName: Accessor<string>
    showNotifications: Accessor<boolean | undefined>
    setConnectedUser: (userName: string) => void
}

const AppUIContext = createContext<AppUIContext>()
export const AppUIProvider: Component<Context> = (props) => {
    const defaultState: UiStore = {
        connectedUser: '',
        showNotifications: true,
    }

    const [state, setState] = createStore<UiStore>(defaultState)

    const setConnectedUser = (userName: string) => {
        setState(
            produce((s) => {
                s.connectedUser = userName
            }),
        )
    }

    const uiState = createMemo(() => state)

    const connectedUserName = createMemo(() => uiState().connectedUser)
    const showNotifications = createMemo(() => uiState().showNotifications)

    return (
        <AppUIContext.Provider
            value={{
                connectedUserName,
                showNotifications,
                setConnectedUser,
            }}>
            {props.children}
        </AppUIContext.Provider>
    )
}

export const useAppUIContext = () => {
    const context = useContext(AppUIContext)
    if (context === undefined) {
        throw new Error('useAppUIContext must be used within an AppUIProvider')
    }
    return context
}
