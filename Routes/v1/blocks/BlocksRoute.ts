import express from "express";
import Database from "../../../Database";
import {Lab} from "../DbEntites";
import Sanitizer from "../../../Sanitizer";

const router = express.Router()

router.get('/', async (req, res) => {
    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from blocks")

    res.send(queryResult.rows)
})

router.get('/:blockId', async (req, res) => {
    const {blockId} = req.params

    if (!Sanitizer.isValidNumber(Number(blockId))) {
        return req.forwardWithError("Invalid Block Id")
    }

    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from blocks where id=$1", [blockId])

    if (queryResult.rowCount === 0) {
        return req.forwardWithError("Block Not Found", 404)
    }
    res.send(queryResult.rows[0])
})
export default router;