import { exit } from '@tauri-apps/api/process'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import {
    createContext,
    useContext,
    createMemo,
    createSignal,
    onMount,
    createEffect,
    type Component,
    type Accessor,
    type Setter,
} from 'solid-js'
import { useEventListener } from 'solidjs-use'
import { attachConsole } from 'tauri-plugin-log-api'
import type { MainContext } from '@static/types'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { usePersistentStore } from '@src/store/tauriStore'
import { ExitCodes } from '@static/types/enums'

interface AppContextMain {
    getDetachConsole: Accessor<Promise<UnlistenFn>>
    handleAppBoot: () => void
    handleTitlebar: (main?: boolean) => void
    theme: Accessor<string>
    setTheme: Setter<string>
}

const AppContextMain = createContext<AppContextMain>()
export const AppContextMainProvider: Component<MainContext> = (props) => {
    const getInitialTheme = (): string => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedPrefs = window.localStorage.getItem('color-theme')
            if (typeof storedPrefs === 'string') {
                return storedPrefs
            }

            const userMedia = window.matchMedia('(prefers-color-scheme: dark)')
            if (userMedia.matches) {
                return 'dark'
            }
        }
        return 'dark'
    }

    const [theme, setTheme] = createSignal(getInitialTheme())

    const detachConsole = attachConsole()

    const getDetachConsole = createMemo(() => detachConsole)
    //#region Global Hooks
    const handleAppExit = async (main = false) => {
        await invoke('handle_save_window_state')
        console.log('[App Close]: saved window state')

        if (main) {
            const { save } = usePersistentStore()
            await save()
            await exit(ExitCodes.USER_EXIT)
        }
        await appWindow.close()
    }

    const handleAppBoot = () => {
        const { set, get } = usePersistentStore()

        useEventListener(document, 'DOMContentLoaded', () => {
            invoke('get_user')
                .then((config) => {
                    const userName = config as string
                    console.log('[App Boot]: Welcome ', userName)
                    get('settings').then((settings) => {
                        if (userName) {
                            set('settings', { user: userName, ...settings })
                        }
                    })
                })
                .catch((e) => console.error(e))
            // check if the window state is saved and restore it if it is
            invoke('handle_save_window_state').then(() => {
                console.log('[App Boot]: saved window state')
            })

            setTimeout(() => invoke('close_splashscreen'), 15000)
        })
    }

    const handleTitlebar = (main = false) => {
        const titlebar = document.getElementsByClassName('titlebar')
        if (titlebar) {
            useEventListener(document.getElementById('titlebar-minimize'), 'click', () => {
                appWindow.minimize()
            })
            useEventListener(document.getElementById('titlebar-maximize'), 'click', () => {
                appWindow.toggleMaximize()
            })
            useEventListener(document.getElementById('titlebar-close'), 'click', async () => {
                await handleAppExit(main)
            })
        }
    }

    const rawSetTheme = (theme: string) => {
        const root = window.document.documentElement
        const isDark = theme === 'dark'
        root.classList.remove(isDark ? 'light' : 'dark')
        root.classList.add(theme)
        localStorage.setItem('color-theme', theme)
    }

    onMount(() => {
        if (props.theme) {
            rawSetTheme(props.theme)
        }
    })

    createEffect(() => {
        rawSetTheme(theme())
    })

    //#endregion

    return (
        <AppContextMain.Provider
            value={{
                getDetachConsole,
                handleAppBoot,
                handleTitlebar,
                theme,
                setTheme,
            }}>
            {props.children}
        </AppContextMain.Provider>
    )
}

export const useAppContextMain = () => {
    const context = useContext(AppContextMain)
    if (context === undefined) {
        throw new Error('useAppContextMain must be used within a AppContextMainProvider')
    }
    return context
}
