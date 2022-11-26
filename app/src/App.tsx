import AppRoutes from '@pages/routes/Routes'
import { ChartProvider } from '@utils/hooks/chartData'
import { Outlet } from 'react-router-dom'
//import { appWindow } from "@tauri-apps/api/window";
// TODO: Add API Key setting for fetch requests
// TODO: Add a way to set the API Key
// TODO: Update color scheme and polish UI
// TODO: Setup support for linux and macos
// TODO: Implement a way to delete a specific chart
// TODO: Implement optional persistent storage for charts and settings using localforage/localstorage

// TODO: Implement a download chart data as CSV feature - needs capture time frame (30 second snapshots for example)
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
