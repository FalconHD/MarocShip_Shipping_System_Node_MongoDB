import { app, startServer, connection } from "./config";
import { errorHandler, notFound } from "./middlewares";
import { AuthRoutes, BossRoutes } from "./routes";


//TODO server init and DB connection 
connection(() => {
    //server init
    startServer(app)

    //routes
    app.use('/Auth', AuthRoutes)
    app.use('/boss', BossRoutes)
    
    //middlewares
    app.use(notFound)
    app.use(errorHandler)

})
