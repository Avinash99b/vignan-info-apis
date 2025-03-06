import express from "express";

const router = express.Router()

router.all('/',(req,res)=>{
    res.status(404).send(`Not Found`);
    console.log(`Not found  ${req.originalUrl}}`)
})

export default router;