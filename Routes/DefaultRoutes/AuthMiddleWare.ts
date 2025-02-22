import {NextFunction, Request, Response} from "express";
import {JWTPayload} from "../v1/DbEntites";
import UserManager from "../../Managers/UserManager";
import Auth from "../../Managers/Auth";

function validateToken(token: string): { authenticated: boolean, payload?: JWTPayload } {
    if (!token) {
        return {authenticated: false};
    }

    const result = Auth.verifyToken(token as string)
    if (!result || !result.data) {
        return {authenticated: false};
    }
    return {authenticated: true, payload: result.data};
}

export async function UserAuthMiddleWare(req: Request, res: Response, next: NextFunction) {
    const result = validateToken(req.query.token as string);
    if (!result || !result.payload) {
        return req.forwardWithError("Invalid Token", 401)
    }

    req.user = await UserManager.fetchUser(result.payload.reg_no);
    if (req.user == null) {
        return req.forwardWithError("Cannot Get User", 500);
    }

    next()
}

export function ManagerAuthMiddleWare(managerLevel: number) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const result = validateToken(req.query.token as string);
        if (!result || !result.payload) {
            return req.forwardWithError("Invalid Token", 401)
        }

        const user = await UserManager.fetchUser(result.payload.reg_no);
        if (!user) {
            return req.forwardWithError("Unauthorized", 401)
        }

        if (user.level > managerLevel) {
            return req.forwardWithError("Unauthorized", 401)
        }

        req.user =  user;
        next()
    }
}