interface IInputProps {
    type: string
    value: string
    id: string
    // eslint-disable-next-line autofix/no-unused-vars
    setValue: (e: React.ChangeEvent<HTMLInputElement>) => void
    name?: string
    placeholder?: string
}

export default function Input(props: IInputProps): JSX.Element {
    return (
        <div>
            <input
                title=""
                type={props.type}
                id={props.id}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={props.placeholder}
                onChange={props.setValue}
                value={props.value}
                required
            />
        </div>
    )
}
