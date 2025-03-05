import express from "express";
import Database from "../../../Database";
import {Lab, System} from "../DbEntites";
import Sanitizer from "../../../Sanitizer";

const router = express.Router()

router.get('/:systemId', async (req, res) => {
    const {systemId} = req.params

    if (!Sanitizer.isValidNumber(Number(systemId))) {
        return req.forwardWithError("Invalid Lab Id")
    }

    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from systems inner join labs l on l.id = systems.lab_id where systems.id=$1", [systemId])

    if (queryResult.rowCount === 0) {
        return req.forwardWithError("Not Found", 404)
    }
    res.send(queryResult.rows[0])
})

router.patch('/:systemId', async (req, res) => {
    const {systemId} = req.params

    if (!Sanitizer.isValidNumber(Number(systemId))) {
        return req.forwardWithError("Invalid Lab Id")
    }

    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from systems where id=$1", [systemId])

    if (queryResult.rowCount === 0) {
        return req.forwardWithError("System Not Found", 404)
    }

    const {
        working,
        download_speed,
        upload_speed,
        ping
    } = req.body


    const result = await pool.query<System>("update systems set working=$1,download_speed=$2,upload_speed=$3,ping=$4 where id=$5", [working, download_speed, upload_speed, ping, systemId])
    if (result.rowCount === 0) {
        return req.forwardWithError("System Not Found", 404);
    }

    req.forwardWithMessage("System Updated Successfully");
})

router.post('/', async (req, res) => {
    const {lab_id,
        working,
        keyboard_working,
        mouse_working,
    } = req.body

    if (!Sanitizer.isValidNumber(Number(lab_id))) {
        return req.forwardWithError("Invalid Lab Id")
    }

    if (working === undefined) {
        return req.forwardWithError("Working Status is Required")
    }

    if (working !== true && working !== false) {
        return req.forwardWithError("Invalid Working Status")
    }

    if(keyboard_working === undefined){
        return req.forwardWithError("Keyboard Working Status is Required")
    }

    if(keyboard_working !== true && keyboard_working !== false){
        return req.forwardWithError("Invalid Keyboard Working Status")
    }

    if(mouse_working === undefined){
        return req.forwardWithError("Mouse Working Status is Required")
    }

    if(mouse_working !== true && mouse_working !== false){
        return req.forwardWithError("Invalid Mouse Working Status")
    }

    const pool = Database.getPool();

    const labQueryResult = await pool.query<Lab>("Select * from labs where id=$1", [lab_id])
    if (labQueryResult.rowCount === 0) {
        return req.forwardWithError("Lab Not Found", 404)
    }

    const queryResult = await pool.query<System>("insert into systems(lab_id,working,keyboard_working,mouse_working) values($1,$2,$3,$4) returning *", [lab_id, working,keyboard_working,mouse_working])
    if (queryResult.rowCount === 0) {
        return req.forwardWithError("System Creation Failed")
    }

    req.forwardWithMessage("System Created Successfully")

})
export default router;