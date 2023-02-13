import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'

const DeliveryReturnedAnalytics = Loadable(
    lazy(() => import('./DeliveryReturnedAnalytics'))
)

const DeliveryReturnedAnalyticsRoute = [
    {
        path: '/delivery-returned-analytics',
        element: <DeliveryReturnedAnalytics />,
    },
]

export default DeliveryReturnedAnalyticsRoute
