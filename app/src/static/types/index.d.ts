import { AppStoreChart, ChartSettings } from './interfaces'
import type { ENotificationAction } from './enums'
import type { JSXElement } from 'solid-js'

type Context = {
    [key: string]: JSXElement
}

type DebugMode = 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

/**
 * @description This is the type that is passed to the localForage instance to handle persistent data within the app.
 * @typedef {Object} PersistentSettings
 * @property {boolean} enableNotificationsSounds
 * @property {boolean} enableNotifications
 * @property {ENotificationAction} globalNotificationsType
 * @property {boolean} enableMDNS
 * @property {boolean} scanForCamerasOnStartup
 * @property {CameraSettings} cameraSettings
 * @property {AlgorithmSettings} algorithmSettings
 * @property {FilterParams} filterParams
 * @property {OSCSettings} oscSettings
 */
type PersistentSettings = {
    user?: string
    enableNotificationsSounds?: boolean
    enableNotifications?: boolean
    globalNotificationsType?: ENotificationAction
    enableMDNS?: boolean
    debugMode?: DebugMode
    charts?: ChartSettings[]
}
