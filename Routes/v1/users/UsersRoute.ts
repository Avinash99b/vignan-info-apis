import express from "express";
import Sanitizer from "../../../Sanitizer";
import UserManager from "../../../Managers/UserManager";
import Auth from "../../../Managers/Auth";

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

export default router;