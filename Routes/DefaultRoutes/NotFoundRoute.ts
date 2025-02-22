import express from "express";

const router = express.Router()

router.all('/',(req,res)=>{
    res.status(404).send("Not Found");
})

export default router;