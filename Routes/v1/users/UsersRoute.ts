import express from "express";
import Sanitizer from "../../../Sanitizer";
import UserManager from "../../../Managers/UserManager";
import Auth from "../../../Managers/Auth";
import Database from "../../../Database";

const router = express.Router();

router.post('/login', async (req, res) => {
    const {registerNo, password} = req.body;
    if (!Sanitizer.isValidRegNo(registerNo)) {
        return req.forwardWithError("Invalid Reg No", 400);
    }

    if (!password) {
        return req.forwardWithError("Password is Required", 400);
    }

    const user = await UserManager.fetchUser(registerNo);
    if (!user)
        return req.forwardWithError("User Not Found", 404);

    if (!Sanitizer.isValidPassword(password)) {
        return req.forwardWithError("Invalid Password", 400);
    }

    if (!await Auth.password_verify(password, user.password_hash)) {
        return req.forwardWithError("Invalid Password", 400);
    }


    const authToken = Auth.generateToken({
        reg_no: registerNo
    })

    res.send({authToken: authToken})
});


router.post('/register', async (req, res) => {
    const {id,mobileNo} = req.body;

    if(!Sanitizer.isValidRegNo(id)){
        return req.forwardWithError("Invalid Register No");
    }

    if (!Sanitizer.isValidMobileNo(mobileNo)) {
        return req.forwardWithError("Invalid Mobile No", 400);
    }

    const pool = Database.getPool();

    const userExistsQuery = await pool.query("Select * from users where id=$1 or mobile_no=$2", [id, mobileNo]);
    if (!userExistsQuery.rowCount||userExistsQuery.rowCount > 0) {
        return req.forwardWithError("User Already Exists", 400);
    }


})
export default router;