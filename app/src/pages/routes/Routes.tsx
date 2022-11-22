import Header from '@components/Header'
//import config from '@tauri/config/config.json'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from '.'

export default function AppRoutes() {
  const getUserName = () => {
    const userName = localStorage.getItem('settings')
    if (typeof userName === 'string') {
      const parsedItem = JSON.parse(userName) // ok
      return parsedItem
    }
    return ''
  }
  return (
    <BrowserRouter>
      <Header name={getUserName()['name'] ? `${getUserName()['name']}` : '!'} />
      <Routes>
        {routes.map(({ index, path, element }) => (
          <Route key={index} path={path} element={element()} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
