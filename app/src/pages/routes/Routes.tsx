import Header from '@components/Header'
import config from '@tauri/config/config.json'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from '.'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Header name={config['name'] ? `${config['name']}` : 'Welcome!'} />
      <Routes>
        {routes.map(({ index, path, element }) => (
          <Route key={index} path={path} element={element()} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
