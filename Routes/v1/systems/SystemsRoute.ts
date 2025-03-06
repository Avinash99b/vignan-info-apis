import express from "express";
import Database from "../../../Database";
import {Lab, System} from "../DbEntites";
import Sanitizer from "../../../Sanitizer";
import Logger from "../../../Managers/Logger";
import {UserAuthMiddleWare} from "../../DefaultRoutes/AuthMiddleWare";

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

    let {
        working,
        download_speed,
        upload_speed,
        ping,
        mouse_working,
        keyboard_working,
        serial_no,
        storage,
        ram,
        processor
    } = req.body

    storage = storage ? Number(storage) : undefined
    ram = ram ? Number(ram) : undefined
    processor = processor ? String(processor) : undefined

    let query = "update systems set "
    let values = []
    let count = 0
    if (working !== undefined) {
        query += `working=$${++count},`
        values.push(working)
    }
    if (download_speed !== undefined) {
        query += `download_speed=$${++count},`
        values.push(download_speed)
    }

    if (upload_speed !== undefined) {
        query += `upload_speed=$${++count},`
        values.push(upload_speed)
    }

    if (ping !== undefined) {
        query += `ping=$${++count},`
        values.push(ping)
    }

    if (mouse_working !== undefined) {
        query += `mouse_working=$${++count},`
        values.push(mouse_working)
    }

    if (keyboard_working !== undefined) {
        query += `keyboard_working=$${++count},`
        values.push(keyboard_working)
    }

    if (serial_no !== undefined) {
        query += `serial_no=$${++count},`
        values.push(serial_no)
    }

    if (storage !== undefined) {
        query += `storage=$${++count},`
        values.push(storage)
    }

    if (ram !== undefined) {
        query += `ram=$${++count},`
        values.push(ram)
    }

    if (processor !== undefined) {
        query += `processor=$${++count},`
        values.push(processor)
    }

    query = query.slice(0, -1)
    query += ` where id=$${++count}`
    values.push(systemId)

    const result = await pool.query(query, values)

    if (result.rowCount === 0) {
        return req.forwardWithError("System Not Found", 404);
    }

    req.forwardWithMessage("System Updated Successfully");
})

router.post('/', UserAuthMiddleWare, async (req, res) => {
    const {
        lab_id,
        working,
        keyboard_working,
        mouse_working,
        multiplier
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

    if (keyboard_working === undefined) {
        return req.forwardWithError("Keyboard Working Status is Required")
    }

    if (keyboard_working !== true && keyboard_working !== false) {
        return req.forwardWithError("Invalid Keyboard Working Status")
    }

    if (mouse_working === undefined) {
        return req.forwardWithError("Mouse Working Status is Required")
    }

    if (mouse_working !== true && mouse_working !== false) {
        return req.forwardWithError("Invalid Mouse Working Status")
    }

    if (multiplier && !Sanitizer.isValidNumber(Number(multiplier))) {
        return req.forwardWithError("Invalid Multiplier")
    }

    const pool = Database.getPool();

    const labQueryResult = await pool.query<Lab>("Select * from labs where id=$1", [lab_id])
    if (labQueryResult.rowCount === 0) {
        return req.forwardWithError("Lab Not Found", 404)
    }

    const loggerId = req.user?.id;
    if (!loggerId) {
        return req.forwardWithError("Invalid User")
    }
    if (!multiplier || multiplier === 1|| multiplier === 0) {
        const queryResult = await pool.query<System>("insert into systems(lab_id,working,keyboard_working,mouse_working) values($1,$2,$3,$4) returning *", [lab_id, working, keyboard_working, mouse_working])
        if (queryResult.rowCount === 0) {
            return req.forwardWithError("System Creation Failed")
        }
        Logger.logAction(loggerId, `System ${queryResult.rows[0].id} Created`, `A system created for lab ${lab_id} with working status ${working} and keyboard working status ${keyboard_working} and mouse working status ${mouse_working}`)
    } else {
        const conn = await pool.connect()
        try {
            await conn.query("BEGIN")
            for (let i = 0; i < multiplier; i++) {
                const queryResult = await conn.query<System>("insert into systems(lab_id,working,keyboard_working,mouse_working) values($1,$2,$3,$4) returning *", [lab_id, working, keyboard_working, mouse_working])
                if (queryResult.rowCount === 0) {
                    await conn.query("ROLLBACK")
                    return req.forwardWithError(`System ${i} Creation Failed`)
                }
            }
            await conn.query("COMMIT")
            Logger.logAction(loggerId, `Systems Created Count:- ${multiplier}`, `Multiple systems created for lab ${lab_id} with working status ${working} and keyboard working status ${keyboard_working} and mouse working status ${mouse_working}`)
        } catch (e) {
            await conn.query("ROLLBACK")
            return req.forwardWithError("System Creation Failed")
        } finally {
            conn.release()
        }
    }
    req.forwardWithMessage("System Created Successfully")

})
export default router;