import AuthGuard from 'app/auth/AuthGuard'
import NotFound from 'app/views/sessions/NotFound'
import chartsRoute from 'app/views/charts/ChartsRoute'
import materialRoutes from 'app/views/material-kit/MaterialRoutes'
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes'
import sessionRoutes from 'app/views/sessions/SessionRoutes'
import MatxLayout from '../components/MatxLayout/MatxLayout'
import { Navigate } from 'react-router-dom'
import mapRoutes from 'app/views/Maps/MapRoutes'
import carsRoutes from 'app/views/Cars/CarsRoute'
import driversRoutes from 'app/views/Drivers/DriversRoute'
import deliveriesRoutes from 'app/views/Deliveries/DeliveriesRoute'
import invoicesRoutes from 'app/views/Invoices/InvoicesRoute'
import NewDeliveryAnalitycsRoute from 'app/views/NewDeliveryAnalitycs/NewDeliveryAnalitycsRoute'
import OrderDeliveredAnalyticsRoute from 'app/views/OrderDeliveredAnalytics/OrderDeliveredAnalitycsRoute'
import DeliveryReturnedAnalyticsRoute from 'app/views/DeliveryReturnedAnalytics/DeliveryReturnedAnalyticsRoute'



export const AllPages = () => {
    const all_routes = [
        {
            element: (
                <AuthGuard>
                    <MatxLayout />
                </AuthGuard>
            ),
            children: [...dashboardRoutes,...invoicesRoutes, ...chartsRoute, ...materialRoutes, ...mapRoutes,...carsRoutes, ...driversRoutes, ...deliveriesRoutes, ...NewDeliveryAnalitycsRoute, ...OrderDeliveredAnalyticsRoute, ...DeliveryReturnedAnalyticsRoute],
        },
        ...sessionRoutes,
        {
            path: '/',
            element: <Navigate to="dashboard/default" />,
        },
        {
            path: '*',
            element: <NotFound />,
        },
    ]

    return all_routes
}
