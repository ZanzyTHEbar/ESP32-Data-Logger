import { lazy, onMount, Suspense } from 'solid-js'
import { useAppContextMain } from './store/context/main'
import { AppProvider } from '@store/context/app'

import AppRoutes from '@routes/Routes'
import { ChartProvider } from '@utils/hooks/chartData'

const AppRoutes = lazy(() => import('@routes/Routes'))
//const NewContextMenu = lazy(() => import('@components/NewMenu'))
//const ExampleMenu = lazy(() => import('@components/NewMenu/DevTools'))
//const ToastNotificationWindow = lazy(() => import('@components/Notifications'))

//! TODO: Add a way for the user to define Y axis min and max values

// TODO: Add a way for the user to change the theme
// TODO: Add API Key setting for fetch requests
// TODO: Add a way to set the API Key
// TODO: Setup support for linux and macos
// TODO: Implement a download chart data as CSV feature - needs capture time frame (30 second snapshots for example)
// TODO: Implement support for multiple series in a chart

//? Optional TODO's
// TODO: Add support for Websockets
// TODO: Add support for webserial
// TODO: Add support for webusb
// TODO: Add support for webhid
// TODO: Add support for bluetooth
// TODO: Add support for MQTT

function App() {
    return (
        <main class="App overflow-y-auto items-center">
            <ChartProvider>
                <AppRoutes />
                {/* <NewContextMenu ref={ref} name="test">
                    <ExampleMenu />
                </NewContextMenu>
                <ToastNotificationWindow /> */}
            </ChartProvider>
        </main>
    )
}

export default App
