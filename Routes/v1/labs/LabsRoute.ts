import express from "express";
import Database from "../../../Database";
import {Lab} from "../DbEntites";
import Sanitizer from "../../../Sanitizer";

const router = express.Router()

router.get('/', async (req, res) => {
    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from labs")

    res.send(queryResult.rows)
})

router.get('/:labId', async (req, res) => {
    const {labId} = req.params

    if (!Sanitizer.isValidNumber(Number(labId))) {
        return req.forwardWithError("Invalid Lab Id")
    }

    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from labs where id=$1", [labId])

    if(queryResult.rowCount === 0){
        return req.forwardWithError("Lab Not Found",404)
    }
    res.send(queryResult.rows[0])
})

router.get('/:labId/systems', async (req, res) => {
    const {labId} = req.params

    if (!Sanitizer.isValidNumber(Number(labId))) {
        return req.forwardWithError("Invalid Lab Id")
    }

    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from systems where lab_id=$1", [labId])

    if(queryResult.rowCount === 0){
        return req.forwardWithError("No Systems Found",404)
    }
    res.send(queryResult.rows[0])
})
export default router;