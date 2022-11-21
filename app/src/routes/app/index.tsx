import Header from '@components/Header'
import Home from '@pages/Home'
import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import config from '../../../src-tauri/config/config.json'

export default function AppRoutes() {
  const [name, setName] = useState('')

  useEffect(() => {
    setName(config['name'])
  }, [])

  return (
    <BrowserRouter basename={'/'}>
      <Header name={name ? name : '!'} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
