import { Switch } from '@kobalte/core'
import { type Component, createSignal } from 'solid-js'
import { useAppContextMain } from '@src/store/context/main'
import './style.css'

const CustomTheme: Component = () => {
    const { theme, setTheme } = useAppContextMain()

    const isDark = theme() === 'dark'

    const toggleTheme = () => {
        setTheme(checked() ? 'dark' : 'light')
    }

    const handleChange = (isChecked: boolean) => {
        setChecked(isChecked)
        toggleTheme()
    }

    const [checked, setChecked] = createSignal(isDark)

    return (
        <Switch.Root checked={checked()} onChange={handleChange} class="inline-flex items-center">
            <Switch.Label class="mr-1 dark:text-gray-400 text-gray-900 text-sm select-none">
                {checked() ? 'Dark' : 'Light'}
            </Switch.Label>
            <Switch.Input class="switch__input" />
            <Switch.Control class="switch__control">
                <Switch.Thumb class="switch__thumb" />
            </Switch.Control>
        </Switch.Root>
    )
}

export default CustomTheme
