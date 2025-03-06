import express from "express"
import NotFoundRoute from "./Routes/DefaultRoutes/NotFoundRoute";
import V1Router from "./Routes/v1/V1Router";
import "dotenv/config"
import path from "path"

const app = express()

app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req,res,next)=>{
    console.log(req.originalUrl)
    next()
})
app.use((req,res,next)=>{
    req.forwardWithError = (error: string, errorCode: number=400)=>{
        res.status(errorCode).send({message:error})
    }
    req.forwardWithMessage = (message:string)=>{
        res.send({message})
    }
    console.log("Request received",req.body)
    next()
})

app.use(V1Router)

app.use('/:path(*)',NotFoundRoute);

const server_port = process.env.SERVER_PORT || 3000

app.listen(server_port,()=>{
    console.log("Server Listening at port 3000")
})