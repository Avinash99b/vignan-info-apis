import express from "express";

const router = express.Router()

router.all('/',(req,res)=>{
    res.status(401).send("Unauthorized");
})

export default router;