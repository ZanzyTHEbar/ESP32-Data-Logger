import { Dialog } from '@kobalte/core'
import { createSignal, type Component, type JSXElement, createEffect } from 'solid-js'
import { onClickOutside } from 'solidjs-use'
import './styles.css'

interface IModalProps {
    children: JSXElement
    icon: JSXElement
    isVisible: boolean
    width?: string
    onClose: () => void
}

export const Modal: Component<IModalProps> = (props) => {
    const [ref, setRef] = createSignal<HTMLDivElement>()

    createEffect(() => {
        onClickOutside(ref, props.onClose)
    })

    return (
        <Dialog.Root>
            <Dialog.Trigger>{props.icon}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay class="dialog__overlay" />
                <div class="dialog__positioner">
                    <Dialog.Content class="dialog__content">
                        <div class="dialog__header">
                            <Dialog.Title class="dialog__title">About Kobalte</Dialog.Title>
                            <Dialog.CloseButton>
                                <button
                                    type="button"
                                    class="ml-auto place-self-end text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-400 p-1 hover:bg-gray-200 inline-flex h-6 w-6 dark:bg-gray-300 dark:text-gray-600 dark:hover:bg-gray-400"
                                    aria-label="Close"
                                    onClick={() => props.onClose()}>
                                    <span class="sr-only">Close</span>
                                    <svg
                                        aria-hidden="true"
                                        class="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </Dialog.CloseButton>
                        </div>
                        <Dialog.Description class="dialog__description">
                            Kobalte is a UI toolkit for building accessible web apps and design
                            systems with SolidJS. It provides a set of low-level UI components and
                            primitives which can be the foundation for your design system
                            implementation.
                        </Dialog.Description>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

/* <Dialog.Root open={props.isVisible}>
            <Dialog.Trigger>{props.trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay class="fixed inset-0 bg-gray-900 bg-opacity-50" />
                <div class="fixed inset-0 z-10 overflow-y-auto pt-8 mt-7 bg-black bg-opacity-25 backdrop-blur-xl flex justify-center items-center content-center self-center">
                    <div class="min-h-screen px-4 flex items-center justify-center">
                        <Dialog.Content
                            class={`md:w-[${props.width}px] h-[100%] xl:mt-[65px] lg:mt-[65px] sm:mt-[55px] xs:mt-[55px] md:mt-[45px] 2xl:mt-[95px] flex flex-col pb-32`}>
                            <div class="px-1 flex items-center justify-center w-[99.50%] h-[25px]">
                                <Dialog.CloseButton>
                                    <button
                                        type="button"
                                        class="ml-auto place-self-end text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-400 p-1 hover:bg-gray-200 inline-flex h-6 w-6 dark:bg-gray-300 dark:text-gray-600 dark:hover:bg-gray-400"
                                        aria-label="Close"
                                        onClick={() => props.onClose()}>
                                        <span class="sr-only">Close</span>
                                        <svg
                                            aria-hidden="true"
                                            class="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                fill-rule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dialog.CloseButton>
                            </div>
                            <Dialog.Description>
                                <div
                                    ref={setRef}
                                    class="bg-none p-2 rounded h-[100%] 2xl:h-[100%] md:h-[110%]">
                                    {props.children}
                                </div>
                            </Dialog.Description>
                        </Dialog.Content>
                    </div>
                </div>
            </Dialog.Portal>
    </Dialog.Root> */
