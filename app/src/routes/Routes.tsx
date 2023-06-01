import { useRoutes } from '@solidjs/router'
import _ from 'lodash'
import { createEffect, onMount } from 'solid-js'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import { routes } from '.'
import type { PersistentSettings } from '@static/types'
import Header from '@components/Header'
import { usePersistentStore } from '@src/store/tauriStore'
import { useAppContext } from '@store/context/app'
import { useAppChartContext } from '@store/context/chart'
//import { useAppMDNSContext } from '@store/context/mdns'
import { useAppUIContext } from '@store/context/ui'

export default function AppRoutes() {
    const Path = useRoutes(routes)
    const { get, set } = usePersistentStore()
    //const { useMDNSScanner } = useAppMDNSContext()
    const { connectedUserName, setConnectedUser } = useAppUIContext()
    const { setAddChart, getCharts } = useAppChartContext()
    const { /* setEnableMDNS, setDebugMode, */ getEnableMDNS, getDebugMode } = useAppContext()

    onMount(() => {
        get('settings').then((settings) => {
            if (settings) {
                debug('[App Mount]: Loading Settings')
                const activeUserName =
                    typeof settings.user === 'string' ? settings.user : 'stranger'
                setConnectedUser(activeUserName)

                //* Load charts from persistent store
                if (settings.charts) {
                    settings.charts.forEach((chart) => {
                        setAddChart(chart)
                    })
                }
            }
        })
    })

    const handleSaveSettings = async () => {
        // check if the settings have changed
        const settings: PersistentSettings = {
            charts: getCharts().settings,
            debugMode: getDebugMode(),
            enableMDNS: getEnableMDNS(),
            user: connectedUserName(),
            //enableNotifications: getEnableNotifications(),
            //enableNotificationsSounds: getEnableNotificationsSounds(),
            //globalNotificationsType: getGlobalNotificationsType(),
        }
        get('settings').then((storedSettings) => {
            if (!_.isEqual(storedSettings, settings)) {
                console.log(`[Routes]: Settings have changed - ${JSON.stringify(settings)}`)
                set('settings', settings)
            }
        })
    }

    createEffect(() => {
        const { resume, pause } = useInterval(30000, {
            controls: true,
            callback: handleSaveSettings,
        })

        useEventListener(window, 'blur', () => {
            pause()
            // save the app settings to the persistent store
            const settings: PersistentSettings = {
                charts: getCharts().settings,
                debugMode: getDebugMode(),
                enableMDNS: getEnableMDNS(),
                user: connectedUserName(),
                //enableNotifications: getEnableNotifications(),
                //enableNotificationsSounds: getEnableNotificationsSounds(),
                //globalNotificationsType: getGlobalNotificationsType(),
            }
            debug(`[Routes]: Saving Settings - ${JSON.stringify(settings)}`)
            set('settings', settings)
            resume()
        })
    })

    return (
        <main class="pb-[5rem] w-[100%] px-8 max-w-[1920px]">
            <div class="header-wrapper">
                <Header name={connectedUserName() ? `${connectedUserName()}` : 'stranger'} />
            </div>
            <div class="pt-[70px]">
                <Path />
            </div>
        </main>
    )
}
