import React from 'react'
import { Redirect } from 'react-router-dom'
import carsRoutes from './views/Cars/CarsRoute'
import chartsRoute from './views/charts/ChartsRoute'
import dashboardRoutes from './views/dashboard/DashboardRoutes'
import deliveriesRoutes from './views/Deliveries/DeliveriesRoute'
import DeliveryReturnedAnalyticsRoute from './views/DeliveryReturnedAnalytics/DeliveryReturnedAnalyticsRoute'
import driversRoutes from './views/Drivers/DriversRoute'
import invoicesRoutes from './views/Invoices/InvoicesRoute'
import mapRoutes from './views/Maps/MapRoutes'
import materialRoutes from './views/material-kit/MaterialRoutes'
import NewDeliveryAnalitycsRoute from './views/NewDeliveryAnalitycs/NewDeliveryAnalitycsRoute'



const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/dashboard/default" />,
    },
]

const errorRoute = [
    {
        component: () => <Redirect to="/session/404" />,
    },
]

const routes = [
    ...dashboardRoutes,
    ...materialRoutes,
    ...chartsRoute,
    ...invoicesRoutes,
    ...carsRoutes,
    ...driversRoutes,
    ...NewDeliveryAnalitycsRoute,
    ...DeliveryReturnedAnalyticsRoute,
    ...deliveriesRoutes,
    ...mapRoutes,
    ...redirectRoute,
    ...errorRoute,
]

export default routes
