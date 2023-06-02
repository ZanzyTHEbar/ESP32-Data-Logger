import { createContext, useContext, createMemo, type Component, type Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { Context } from '@static/types'
import { MenuOpen, UiStore } from '@src/static/types/interfaces'

interface AppUIContext {
    connectedUserName: Accessor<string>
    showNotifications: Accessor<boolean | undefined>
    menuOpenStatus: Accessor<MenuOpen | null | undefined>
    setMenu: (menuOpen: MenuOpen | null) => void
    setConnectedUser: (userName: string) => void
}

const AppUIContext = createContext<AppUIContext>()
export const AppUIProvider: Component<Context> = (props) => {
    const defaultState: UiStore = {
        connectedUser: '',
        showNotifications: true,
        menuOpen: null,
    }

    const [state, setState] = createStore<UiStore>(defaultState)

    const setConnectedUser = (userName: string) => {
        setState(
            produce((s) => {
                s.connectedUser = userName
            }),
        )
    }

    const setMenu = (menuOpen: MenuOpen | null) => {
        setState(
            produce((s) => {
                s.menuOpen = menuOpen || null
            }),
        )
    }

    const uiState = createMemo(() => state)

    const connectedUserName = createMemo(() => uiState().connectedUser)
    const showNotifications = createMemo(() => uiState().showNotifications)
    const menuOpenStatus = createMemo(() => uiState().menuOpen)

    return (
        <AppUIContext.Provider
            value={{
                connectedUserName,
                showNotifications,
                menuOpenStatus,
                setMenu,
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
