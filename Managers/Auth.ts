import {OAuth2Client} from 'google-auth-library';
import jwt from "jsonwebtoken";
import "dotenv/config";
import * as argon2 from "argon2";
import {JWTPayload} from "../Routes/v1/DbEntites";

const CLIENT_ID = '2100004836-2tf8fnl1ul9prl0nbqjugj715sh8gr53.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

const SECRET_KEY = process.env.SECRET_KEY || 'Googler'

class Auth {
    static async password_hash(password: string) {
        return argon2.hash(password);
    }

    static async password_verify(password: string, hash: string) {
        return argon2.verify(hash, password);
    }

    static generateToken(payload: JWTPayload, expiresIn = '2d') {
        return jwt.sign(payload, SECRET_KEY, {expiresIn:expiresIn as any});
    }

    static verifyToken(token: string): { data?: JWTPayload, error?: string } {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            return {data: decoded as JWTPayload};
        } catch (error: any) {
            return {error: error.message};
        }
    }

    static verifyUserToken(token: string, reg_no: string) {
        const result = this.verifyToken(token);
        if (result.data) {
            return result.data.reg_no === reg_no;
        }
        return false;
    }

    static async verifyTokenAndId(idToken: string, email: string) {
        try {
            const ticket = await client.verifyIdToken({
                idToken: idToken, audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            });

            const payload = ticket.getPayload();
            if (payload === undefined) {
                return false;
            }

            // Check if email matches
            return !!(payload.email === email && payload.email_verified);
        } catch (error) {
            console.error('Error verifying token:', error);
            return false;
        }
    }
}

export default Auth;