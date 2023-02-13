import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable';

const Analytics = Loadable(lazy(() => import("./Analytics")));
const ImportantDeliveries = Loadable(lazy(() => import("./ImportantDeliveries")));

const dashboardRoutes = [
    {
        path: '/dashboard/default',
        element: <Analytics />,
    },
    {
        path: '/important',
        element: <ImportantDeliveries />,
    },
]

export default dashboardRoutes
