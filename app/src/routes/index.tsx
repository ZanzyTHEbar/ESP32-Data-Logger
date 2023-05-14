import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'

const Home = lazy(() => import('@pages/Home'))
const Settings = lazy(() => import('@pages/Settings'))
const page404 = lazy(() => import('@pages/Page404'))

export const routes: RouteDefinition[] = [
    { path: '/', component: Home },
    { path: '/settings', component: Settings },
    { path: '**', component: page404 },
]
