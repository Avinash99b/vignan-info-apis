import express from "express";
import LabsRoute from "./labs/LabsRoute";
import BlocksRoute from "./blocks/BlocksRoute";
import ProblemsRoute from "./problems/ProblemsRoute";
import UsersRoute from "./users/UsersRoute";
import SystemsRoute from "./systems/SystemsRoute";

const router = express.Router()

router.use('/labs',LabsRoute)

router.use('/blocks',BlocksRoute)

router.use('/problems',ProblemsRoute)

router.use('/systems',SystemsRoute)

router.use('/users',UsersRoute)

export default router;