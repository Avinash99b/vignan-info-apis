import express from "express";
import Database from "../../../Database";
import {Lab} from "../DbEntites";
import Sanitizer from "../../../Sanitizer";
import {QueryResult} from "pg";

const router = express.Router()

router.get('/', async (req, res) => {
    const pool = Database.getPool();
    let {blockId, floors} = req.query

    console.log(floors)

    if (!Sanitizer.isValidNumber(Number(blockId))) {
        return req.forwardWithError("Invalid Block Id")
    }
    if(!floors){
        floors = ["1"]
    }
    if(!Array.isArray(floors)){
        floors = [floors]
    }


    let queryResult: QueryResult;
    if (floors.length === 0) {
        queryResult = await pool.query<Lab>("Select * from labs where block_id = $1", [blockId])
    } else {
        queryResult = await pool.query<Lab>("Select * from labs where block_id = $1 and floor = Any($2)", [blockId, floors])
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
    let {name,des,block_id,incharge_mob_no,floor}=req.body

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

    if(!incharge_mob_no || incharge_mob_no.length!==10){
        return req.forwardWithError("Incharge Mobile No is Required")
    }

    incharge_mob_no = Sanitizer.sanitizeString(incharge_mob_no)

    if(!Sanitizer.isValidNumber(floor)){
        return req.forwardWithError("Invalid Floor No")
    }

    const pool = Database.getPool()

    const client = await pool.connect()

    try{

        const blockQuery = await client.query("Select * from blocks where id=$1",[block_id])
        if(blockQuery.rowCount===0){
            return req.forwardWithError("Block Not Found",404)
        }

        const block = blockQuery.rows[0]

        if(block.floor_count<floor){
            return req.forwardWithError("Invalid Floor No")
        }

        const queryResult = await client.query<Lab>("Insert into labs(name,description,block_id,incharge_no,floor) values($1,$2,$3,$4,$5)",[name,des,block_id,incharge_mob_no,floor])
        if(queryResult.rowCount===0){
            return req.forwardWithError("Failed to Create Lab")
        }
        return req.forwardWithMessage("Lab Created Successfully")
    }catch (e){
        console.error(e)
        return req.forwardWithError("Failed to Create Lab")
    }finally {
        client.release()
    }
})
export default router;