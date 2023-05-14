import Header from '@components/Header'
import { useRoutes } from '@solidjs/router'
import { usePersistentStore } from '@src/store/tauriStore'
import { useAppUIContext } from '@store/context/ui'
import { type Component, createEffect, onMount } from 'solid-js'
import { useEventListener } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import { routes } from '.'

//import config from '@tauri/config/config.json'
import { routes } from '.'

export default function AppRoutes() {
    const Path = useRoutes(routes)
    const { get, set } = usePersistentStore()
    const { connectedUserName, setConnectedUser } = useAppUIContext()

    get('settings').then((settings) => {
        if (settings) {
            debug('[App Mount]: Loading Settings')
            const activeUserName = typeof settings.user === 'string' ? settings.user : 'stranger'
            setConnectedUser(activeUserName)
        }
    })

    return (
        <main class="pb-[5rem] w-[100%] px-8 max-w-[1920px]">
            <div class="header-wrapper">
                <Header
                    name={connectedUserName()['name'] ? `${connectedUserName()['name']}` : '!'}
                />
            </div>
            <div class="pt-[70px]">
                <Path />
            </div>
        </main>
    )
}
