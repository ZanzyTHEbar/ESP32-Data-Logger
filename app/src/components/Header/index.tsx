import { useNavigate, useLocation } from '@solidjs/router'
import { FaSolidGear } from 'solid-icons/fa'
import type { Component } from 'solid-js'
import logo from '@src/assets/images/logo.png'

const Header: Component<{ name: string }> = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <div class="flex-initial">
            <header class="container px-4 py-2 pt-[20px] flex items-center justify-between mx-auto">
                <div class="navbar">
                    <div class="menu-bars">
                        <button
                            onClick={() => {
                                if (location.pathname === '/') navigate('/settings')
                                else navigate('/')
                            }}
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
        </div>
    )
}

export default Header
