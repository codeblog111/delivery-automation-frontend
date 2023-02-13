import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'

const Invoices = Loadable(lazy(() => import('./Invoices')))

const invoicesRoutes = [
    {
        path: '/invoices',
        element: <Invoices />,
    },
]

export default invoicesRoutes
