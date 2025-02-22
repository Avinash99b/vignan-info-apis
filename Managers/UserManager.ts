import Database from "../Database";
import Auth from "./Auth";
import Logger from "./Logger";
import {Pool} from "pg";
import {User} from "../Routes/v1/DbEntites";

class UserManager {
    static pool = Database.getPool();
    static logger = Logger.getLogger();

    static async fetchUser(regNo: string, Pool?: Pool): Promise<User | null> {

        const rows = await (Pool ? Pool : this.pool).query<User>('SELECT * FROM users WHERE id = $1', [regNo]);
        if (rows.rowCount === 0) {
            return null;
        }
        return rows.rows[0];
    }
}

export default UserManager;