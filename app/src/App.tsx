import AppRoutes from '@pages/routes/Routes'
import { ChartProvider } from '@utils/hooks/chartData'
import { Outlet } from 'react-router-dom'
//import { appWindow } from "@tauri-apps/api/window";
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
    <ChartProvider>
      <main className="App">
        <AppRoutes />
        <Outlet />
      </main>
    </ChartProvider>
  )
}

export default App
