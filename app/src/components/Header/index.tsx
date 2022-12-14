import logo from '/images/logo.png'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Settings from '@pages/Settings'
import { useState } from 'react'
import { Modal } from '@components/Modal'

export interface Iprops {
  name: string
}

export default function Header({ name }: Iprops): JSX.Element {
  const [showSettings, setShowSettings] = useState(false)
  return (
    <div className="flex-initial">
      <header className="container px-4 py-2 pt-[20px] flex items-center justify-between mx-auto">
        <div className="navbar">
          <div className="menu-bars">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="settings-button ml-4 p-1 hover:bg-gray-200 border rounded-full py-3 px-4 mr-5 focus:bg-gray-100 transition duration-200 ease-in focus:shadow-inner">
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>
        </div>
        <h1 className="ml-4 text-xl text-gray-500 fond-bold">
          <span className="text-gray-900">Welcome</span> {name}
        </h1>
        <h2 className="ml-4 text-xl text-gray-500 font-bold">
          <span className="text-gray-900">Data</span> Logger
        </h2>
        <img src={logo} alt="logo" className="ml-5 mr-0 w-15 h-12" />
      </header>
      <div className="nav-menu z-10">
        <Modal isVisible={showSettings} onClose={() => setShowSettings(false)} width="200">
          <Settings />
        </Modal>
      </div>
    </div>
  )
}
