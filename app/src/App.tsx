import { lazy, onMount } from 'solid-js'
import { useAppContextMain } from './store/context/main'
import { AppProvider } from '@store/context/app'


const AppRoutes = lazy(() => import('@routes/Routes'))
//const NewContextMenu = lazy(() => import('@components/NewMenu'))
//const ExampleMenu = lazy(() => import('@components/NewMenu/DevTools'))
//const ToastNotificationWindow = lazy(() => import('@components/Notifications'))

//! TODO: Add a way for the user to define Y axis min and max values

// TODO: Add a way for the user to change the theme
// TODO: Add API Key setting for fetch requests
// TODO: Add a way to set the API Key
// TODO: Setup support for linux and macos
// TODO: Implement support for multiple series in a chart

//? Optional TODO's
// TODO: Add support for Websockets
// TODO: Add support for webserial
// TODO: Add support for webusb
// TODO: Add support for webhid
// TODO: Add support for bluetooth
// TODO: Add support for MQTT

function App() {
    const { handleTitlebar, handleAppBoot } = useAppContextMain()
    onMount(() => {
        handleTitlebar(true)
        handleAppBoot()
    })

    return (
        <main class="App overflow-y-auto items-center">
            <AppProvider>
                <AppRoutes />
                {/* <NewContextMenu ref={ref} name="test">
                    <ExampleMenu />
                </NewContextMenu>
                <ToastNotificationWindow /> */}
            </AppProvider>
        </main>
    )
}

export default App
