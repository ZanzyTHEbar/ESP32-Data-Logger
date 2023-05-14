import { createSignal, type Component, type JSXElement, createEffect } from 'solid-js'
import { onClickOutside } from 'solidjs-use'
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
    DialogOverlay,
} from 'terracotta'

interface IModalProps {
    children: JSXElement
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
        <Transition appear show={props.isVisible}>
            <Dialog
                ref={setRef}
                isOpen
                class="fixed inset-0 z-10 overflow-y-auto fixed pt-8 mt-7 bg-black bg-opacity-25 backdrop-blur-xl flex justify-center items-center content-center self-center"
                onClose={props.onClose}>
                <div class="min-h-screen px-4 flex items-center justify-center">
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <DialogOverlay class="fixed inset-0 bg-gray-900 bg-opacity-50" />
                    </TransitionChild>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span class="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <DialogPanel
                            class={`md:w-[${props.width}px] h-[100%] xl:mt-[65px] lg:mt-[65px] sm:mt-[55px] xs:mt-[55px] md:mt-[45px] 2xl:mt-[95px] flex flex-col pb-32`}>
                            <div class="px-1 flex items-center justify-center w-[99.50%] h-[25px]">
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
                            </div>
                            <DialogTitle
                                as="h3"
                                class="text-lg font-medium leading-6 text-gray-900">
                                Payment successful
                            </DialogTitle>
                            <div class="bg-none p-2 rounded h-[100%] 2xl:h-[100%] md:h-[110%]">
                                {props.children}
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
