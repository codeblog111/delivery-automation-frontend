import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'

const Deliveries = Loadable(lazy(() => import('./Deliveries')))

const deliveriesRoutes = [
    {
        path: '/deliveries',
        element: <Deliveries />,
    },
]

export default deliveriesRoutes
