import express from "express";
import Database from "../../../Database";
import {Lab} from "../DbEntites";
import Sanitizer from "../../../Sanitizer";
import {UserAuthMiddleWare} from "../../DefaultRoutes/AuthMiddleWare";

const router = express.Router()

router.get('/', async (req, res) => {
    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from problems")

    res.send(queryResult.rows)
})

router.get("/reports", async (req, res) => {
    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from reported_problems where reporter_id=$1", [req.user?.id])

    res.send(queryResult.rows)
})

router.get("/reports/:systemId", async (req, res) => {
    const {systemId} = req.params

    if (!Sanitizer.isValidNumber(Number(systemId))) {
        return req.forwardWithError("Invalid System Id")
    }

    const pool = Database.getPool();

    const queryResult = await pool.query<Lab>("Select * from reported_problems where system_id=$1", [systemId])

    res.send(queryResult.rows)
})


router.post('/report', UserAuthMiddleWare,async (req, res) => {
    let {system_id,problem} = req.body
    const pool = Database.getPool();

    if(!Sanitizer.isValidNumber(system_id)){
        return req.forwardWithError("Invalid System Id")
    }

    if(!problem){
        return req.forwardWithError("Please Add a problem")
    }
    problem = Sanitizer.sanitizeString(problem)

    const queryResult = await pool.query("Insert into reported_problems(system_id, problem, reporter_id) values ($1,$2,$3)",[system_id,problem,req.user?.id])
    if(queryResult.rowCount === 0){
        return req.forwardWithError("Unknown Error Occurred")
    }
    req.forwardWithMessage("Request sent successfully")
})

export default router;