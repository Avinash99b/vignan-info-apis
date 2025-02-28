import express from "express";
import Database from "../../../Database";
import {Lab, System} from "../DbEntites";
import Sanitizer from "../../../Sanitizer";
import {QueryResult} from "pg";

const router = express.Router()

router.post('/default', async (req, res) => {
    let {block_id} = req.query
    let {floors} = req.body

    if(!block_id){
        block_id = "0"
    }

    if (!Sanitizer.isValidNumber(Number(block_id))) {
        return req.forwardWithError("Invalid Block Id")
    }

    if(!floors){
        floors = ["0"]
    }

    if(!Array.isArray(floors)){
        floors = [floors]
    }
    const pool = Database.getPool();
    let queryResult:QueryResult

    let totalCount: number
    let workingCount: number

    if(Number(block_id)===0){
        queryResult = await pool.query("Select count(*) as total from systems",[])
        totalCount = queryResult.rows[0].total

        queryResult = await pool.query("Select count(*) as total from systems where working = true",[])
        workingCount = queryResult.rows[0].total
    }else{
        if(Number(floors)===0){
            queryResult =await pool.query("Select count(*) as total from systems inner join public.labs l on l.id = systems.lab_id where l.block_id =$1",[block_id])
            totalCount = queryResult.rows[0].total

            queryResult =await pool.query("Select count(*) as total from systems inner join public.labs l on l.id = systems.lab_id where l.block_id =$1 and working =true",[block_id])
            workingCount = queryResult.rows[0].total
        }else{
            queryResult =await pool.query("Select count(*) as total from systems inner join public.labs l on l.id = systems.lab_id where l.block_id =$1 and floor = ANY($2)",[block_id,floors])
            totalCount = queryResult.rows[0].total


            queryResult =await pool.query("Select count(*) as total from systems inner join public.labs l on l.id = systems.lab_id where l.block_id =$1 and floor = ANY($2) and working =true",[block_id,floors])
            workingCount = queryResult.rows[0].total
        }
    }

    res.send({
        totalCount,
        workingCount
    })
})

export default router;