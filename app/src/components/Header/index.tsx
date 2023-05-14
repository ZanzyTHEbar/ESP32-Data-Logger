import { FaSolidGear } from 'solid-icons/fa'
import { createSignal } from 'solid-js'
import logo from '../../../public/images/logo.png'
import type { Component } from 'solid-js'
import { Modal } from '@components/Modal'
import Settings from '@pages/Settings'

const Header: Component<{ name: string }> = (props) => {
    const [showSettings, setShowSettings] = createSignal(false)
    return (
        <div class="flex-initial">
            <header class="container px-4 py-2 pt-[20px] flex items-center justify-between mx-auto">
                <div class="navbar">
                    <div class="menu-bars">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            class="settings-button ml-4 p-1 hover:bg-gray-200 border rounded-full py-3 px-4 mr-5 focus:bg-gray-100 transition duration-200 ease-in focus:shadow-inner">
                            <FaSolidGear />
                        </button>
                    </div>
                </div>
                <h1 class="ml-4 text-xl text-gray-500 fond-bold">
                    <span class="text-gray-900">Welcome</span> {props.name}
                </h1>
                <h2 class="ml-4 text-xl text-gray-500 font-bold">
                    <span class="text-gray-900">Data</span> Logger
                </h2>
                <img src={logo} alt="logo" class="ml-5 mr-0 w-15 h-12" />
            </header>
            <div class="nav-menu z-10">
                <Modal isVisible={showSettings} onClose={() => setShowSettings(false)} width="200">
                    <Settings />
                </Modal>
            </div>
        </div>
    )
}

export default Header
