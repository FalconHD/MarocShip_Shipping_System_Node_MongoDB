import { app, startServer, connection } from "./config";
import { errorHandler, notFound } from "./middlewares";
import { AuthRoutes, BossRoutes, DriverRoutes, ManagerRoutes, ShipRoutes, SuperVisorRoutes } from "./routes";


//TODO server init and DB connection 
connection(() => {
    //server init
    startServer(app)

    //routes
    app.use('/Auth', AuthRoutes)
    app.use('/boss', BossRoutes)
    app.use('/ship', ShipRoutes)
    app.use('/manager', ManagerRoutes)
    app.use('/supervisor', SuperVisorRoutes)
    app.use('/driver', DriverRoutes)

    //middlewares
    app.use(notFound)
    app.use(errorHandler)

})
