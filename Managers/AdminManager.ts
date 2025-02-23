import Database from "../Database";


class AdminManager {
    static pool = Database.getPool();
   
}

export default AdminManager;