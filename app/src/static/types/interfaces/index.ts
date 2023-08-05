import { ENotificationAction, ENotificationType, MdnsStatus } from '../enums'
import type { DebugMode } from '@static/types'
import type { RESTStatus, RESTType } from '@static/types/enums'
import type { WebviewWindow } from '@tauri-apps/api/window'
import type { ToasterStore } from 'solid-headless'
import type { JSXElement } from 'solid-js'

//* Component Interfaces
export interface Internal {
    errorMsg?: string
    error?: boolean
}

export interface Inputs {
    input: (props?: Internal) => JSXElement
}

export interface SkeletonHandlerProps {
    render?: boolean
    items?: SkeletonProps[]
    children?: JSXElement
}

export interface SkeletonProps {
    class: string
}

export interface CardProps {
    children?: JSXElement
    src?: string
    title?: string
    subTitle?: string
    imageAlt?: string
    buttonElement?: JSXElement
    background?: string
    backgroundColor?: string
}

export interface NotificationAction {
    callbackOS(): void
    callbackApp(): void
}

export interface Notifications {
    title: string
    message: string
    type: ENotificationType
}

export interface IWindow {
    label: string
    window: WebviewWindow
}

export interface IEndpoint {
    url: string
    type: RESTType
}

export interface IRest {
    status: RESTStatus
    device: string
    response: object
}

export interface IRestProps {
    endpointName: string
    deviceName: string
    port?: number
    args?: string
}

export interface MdnsResponse {
    ips: string[]
    names: string[]
}

export interface MenuOpen {
    x: number
    y: number
}

export interface NewMenu {
    children: JSXElement
    ref: HTMLElement | null
    name: string
}

export interface ModalMenu {
    children: JSXElement
    title?: string
    initialFocus?: string
}

//*  App Store Interfaces  */

export interface AppStore {
    debugMode: DebugMode
    enableMDNS: boolean
}

export interface AppStoreNotifications {
    notifications?: ToasterStore<Notifications>
    enableNotificationsSounds: boolean
    enableNotifications: boolean
    globalNotificationsType: ENotificationAction
}

export interface AppStoreAPI {
    restAPI: IRest
}

export interface AppStoreMdns {
    mdnsStatus: MdnsStatus
    mdnsData: MdnsResponse
    addresses: string[]
}

export interface UiStore {
    connectedUser: string
    showNotifications?: boolean
    menuOpen: MenuOpen | null
}

export interface ChartSettings {
    ip: string
    endpoint: string
    title: string
    y_axis_title: string
    object_id_label: string
    line_color: string
    interval: number
    object_id: string
    chart_id: string
    cName: string
}

export interface AppStoreChart {
    settings: ChartSettings[]
    selectedChart?: ChartSettings
    toggleDataSet: boolean
}
