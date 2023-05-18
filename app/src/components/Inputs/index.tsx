import type { Component, JSXElement } from 'solid-js'

interface Props {
    onChange: (value: string, id: string) => void
    placeholder: string
    header: string
    type?: string
    id?: string
    icon?: JSXElement
    required?: boolean
}

const Input: Component<Props> = (props) => {
    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        props.onChange(target.value, target.id)
        // clear the input field
        //target.value = ''
    }

    return (
        <div class="flex grow rounded-xl flex-col pl-3 pr-3 pb-3 pt-3 bg-gray-100">
            <div class="flex justify-between pb-3">
                <div class="flex items-center content-center">
                    <span class="items-center pr-1 pb-1 justify-center content-center">
                        <div class="pt-1 pr-1 text-primary">{props.icon}</div>
                    </span>
                    <p class="font-[700] text-lg text-secondary">{props.header}</p>
                </div>
            </div>
            <div>
                <div class="flex justify-between pb-3">
                    <input
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleChange}
                        placeholder={props.placeholder}
                        type={props.type}
                        name={props.id}
                        id={props.id}
                        required={props.required}
                    />
                </div>
            </div>
        </div>
    )
}

export default Input
