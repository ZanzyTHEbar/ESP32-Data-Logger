import { Image, Popover } from '@kobalte/core'
import { createSignal, Show } from 'solid-js'
import './styles.css'

export interface ICustomPopover {
    icon?: string
    popoverContent?: string
    disablePopover?: boolean
    styles?: string
}

const CustomPopover = (props: ICustomPopover) => {
    const [open, setOpen] = createSignal(false)

    const handlePopOver = () => {
        if (props.disablePopover) {
            setOpen(false)
        }
        setOpen(!open())
    }

    return (
        <div
            onMouseEnter={handlePopOver}
            onMouseLeave={handlePopOver}
            class="group relative inline-flex">
            <Popover.Root isOpen={open()}>
                <Popover.Trigger class="rounded-[8px] pl-[1.5rem] pr-[1.5rem] ">
                    <Show when={props.icon}>
                        <Image.Root>
                            <Image.Img
                                src={props.icon}
                                alt="logo"
                                width="20px"
                                height="35px"
                                class="pt-1 pb-1"
                            />
                        </Image.Root>
                    </Show>
                </Popover.Trigger>
                <Show when={!props.disablePopover}>
                    <Popover.Portal>
                        <Popover.Content class="popover__content">
                            <Popover.Arrow class="" />
                            <Popover.Description class="popover__description">
                                {props.popoverContent || ''}
                            </Popover.Description>
                        </Popover.Content>
                    </Popover.Portal>
                </Show>
            </Popover.Root>
        </div>
    )
}

export default CustomPopover
