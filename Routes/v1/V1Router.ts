import express from "express";
import LabsRoute from "./labs/LabsRoute";
import BlocksRoute from "./blocks/BlocksRoute";
import ProblemsRoute from "./problems/ProblemsRoute";
import UsersRoute from "./users/UsersRoute";

const router = express.Router()

router.use('/labs',LabsRoute)

router.use('/blocks',BlocksRoute)

router.use('/problems',ProblemsRoute)

router.use('/users',UsersRoute)

export default router;