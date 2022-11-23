import Main from '@pages/Home'
export interface IRoutes {
  path: string
  index: string
  element: () => JSX.Element
}

export const routes: IRoutes[] = [{ path: '/', element: Main, index: 'main' }]
