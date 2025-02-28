import express from "express";
import Database from "../../../Database";
import {Lab} from "../DbEntites";
import Sanitizer from "../../../Sanitizer";
import {QueryResult} from "pg";

const router = express.Router()

router.get('/', async (req, res) => {
    const pool = Database.getPool();
    let {blockId, floor} = req.query
    if (!Sanitizer.isValidNumber(Number(blockId))) {
        return req.forwardWithError("Invalid Block Id")
    }
    if(!floor){
        floor = "0"
    }
    if (!Sanitizer.isValidNumber(Number(floor))) {
        return req.forwardWithError("Invalid Floor No")
    }
    let queryResult: QueryResult;
    if (Number(floor) === 0) {
        queryResult = await pool.query<Lab>("Select * from labs where block_id = $1", [blockId])
    } else {
        queryResult = await pool.query<Lab>("Select * from labs where block_id = $1 and floor = $2", [blockId, floor])
    }
    res.send(queryResult.rows)
})

router.get('/:labId', async (req, res) => {
    const {labId} = req.params

    if (!Sanitizer.isValidNumber(Number(labId))) {
        return req.forwardWithError("Invalid Lab Id")
    }

    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from labs where id=$1", [labId])

    if (queryResult.rowCount === 0) {
        return req.forwardWithError("Lab Not Found", 404)
    }
    res.send(queryResult.rows[0])
})

router.get('/:labId/systems', async (req, res) => {
    const {labId} = req.params

    if (!Sanitizer.isValidNumber(Number(labId))) {
        return req.forwardWithError("Invalid Lab Id")
    }

    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from systems  where lab_id=$1", [labId])

    if (queryResult.rowCount === 0) {
        return req.forwardWithError("No Systems Found", 404)
    }
    res.send(queryResult.rows)
})

router.post('/',async (req,res)=>{
    let {name,des,block_id,incharge_id,floor}=req.body

    if(!name || name.length<3){
        return req.forwardWithError("Name is Required")
    }

    if(!des || des.length<3){
        return req.forwardWithError("Description is Required")
    }

    name = Sanitizer.sanitizeString(name)
    des = Sanitizer.sanitizeString(des)
    if(!Sanitizer.isValidNumber(block_id)){
        return req.forwardWithError("Invalid Block Id")
    }

    if(!incharge_id || incharge_id.length!==10){
        return req.forwardWithError("Incharge Id is Required")
    }

    incharge_id = Sanitizer.sanitizeString(incharge_id)

    if(!Sanitizer.isValidNumber(floor)){
        return req.forwardWithError("Invalid Floor No")
    }

    const pool = Database.getPool()

    const client = await pool.connect()

    try{
        const inchargeQuery = await client.query("Select * from users where id=$1",[incharge_id])
        if(inchargeQuery.rowCount===0){
            return req.forwardWithError("Incharge Not Found",404)
        }

        const blockQuery = await client.query("Select * from blocks where id=$1",[block_id])
        if(blockQuery.rowCount===0){
            return req.forwardWithError("Block Not Found",404)
        }

        const block = blockQuery.rows[0]

        if(block.floor_count<floor){
            return req.forwardWithError("Invalid Floor No")
        }

        const queryResult = await client.query<Lab>("Insert into labs(name,description,block_id,incharge_id,floor) values($1,$2,$3,$4,$5) returning *",[name,des,block_id,incharge_id,floor])
        if(queryResult.rowCount===0){
            return req.forwardWithError("Failed to Create Lab")
        }
        return req.forwardWithMessage("Lab Created Successfully")
    }catch (e){
        return req.forwardWithError("Failed to Create Lab")
    }finally {
        client.release()
    }
})
export default router;