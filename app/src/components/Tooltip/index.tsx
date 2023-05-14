import { Tooltip } from '@kobalte/core'
import type { Component, JSXElement } from 'solid-js'
import './styles.css'

const CustomTooltip: Component<{ children: JSXElement; tooltip: string }> = (props) => {
    return (
        <Tooltip.Root placement="left-start">
            <Tooltip.Trigger>{props.children}</Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content class="tooltip__content">
                    <Tooltip.Arrow />
                    <p>{props.tooltip}</p>
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    )
}

export default CustomTooltip
