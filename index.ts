import express from "express"
import NotFoundRoute from "./Routes/DefaultRoutes/NotFoundRoute";
import V1Router from "./Routes/v1/V1Router";
import "dotenv/config"

const app = express()

app.use(express.json())


app.use((req,res,next)=>{
    req.forwardWithError = (error: string, errorCode: number=400)=>{
        res.status(errorCode).send(error)
    }
    req.forwardWithMessage = (message:string)=>{
        res.send(message)
    }
    next()
})

app.use(V1Router)

app.use('/:path(*)',NotFoundRoute);

const server_port = process.env.SERVER_PORT || 3000

app.listen(server_port,()=>{
    console.log("Server Listening at port 3000")
})