import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'

const Maps2 = Loadable(lazy(() => import('./map.tsx')))
const Maps = Loadable(lazy(() => import('./RenderMap.js')))

const mapRoutes = [
    {
        path: '/map',
        element: <Maps />,
    },
    {
        path: '/',
        element: <Maps2 />,
    },
]

export default mapRoutes
