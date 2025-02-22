import Database from "../Database";
import AdminUser, {AdminUserRow} from "../DbEntities/AdminUser";
import AdminLevel from "../Objects/AdminLevel";


class AdminManager {
    static pool = Database.getPool();
    static async fetchAdminUsers(): Promise<AdminUser[]> {
        const [rows] = await this.pool.execute<AdminUserRow[]>("SELECT * FROM admin_users");
        return rows;
    }

    static async addWorker(email: string, gameId: number): Promise<{
        status: boolean,
        message: string
    }> {
        try {
            await this.pool.execute("INSERT INTO admin_users (email,gameId) VALUES (?,?)", [email, String(gameId)]);
        } catch (e) {
            console.error(e);
            return {status: false, message: "Error adding worker"};
        }
        return {status: true, message: "Worker added"};
    }

    static async removeWorker(email: string): Promise<{
        status: boolean,
        message: string
    }> {
        try {
            await this.pool.execute("DELETE FROM admin_users WHERE email=?", [email]);
        } catch (e) {
            console.error(e);
            return {status: false, message: "Error removing worker"};
        }
        return {status: true, message: "Worker removed"};
    }

    static async fetchAdminLevel(email:string): Promise<number> {
        const [rows] = await this.pool.execute<AdminUserRow[]>("SELECT * FROM admin_users where email = ?",[email]);
        return parseInt(rows[0]?.level) || 999;
    }

    static async fetchAdminUser(email:string): Promise<AdminUser|null> {
        const [rows] = await this.pool.execute<AdminUserRow[]>("SELECT * FROM admin_users WHERE email = ?",[email]);
        return rows[0] || null;
    }

    static async fetchRankedAdminUsers(maxLevel:AdminLevel): Promise<AdminUser[]> {
        const [rows] = await this.pool.execute<AdminUserRow[]>("SELECT * FROM admin_users where level <= ?",[maxLevel]);
        return rows;
    }

    // static async updateShowSpecialTournaments(show: boolean): Promise<void> {
    //     await GlobalsManager.updateGlobal(allConnections, "openSpecialTournaments", show ? "true" : "false");
    //     EventHandler.emitAllEvent(allConnections.emitter, {
    //         name: WSEventNames.GLOBAL_UPDATED,
    //         type: WSMessageType.EVENT,
    //         data: {
    //             globalName: "openSpecialTournaments",
    //             value: show ? "true" : "false"
    //         }
    //     })
    // }
}

export default AdminManager;