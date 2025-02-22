import client from "pg"
class Database{
    private static pool = new client.Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'vig_info',
        password: 'root',
        port: 5432
    })

    static{
        this.pool.connect().then(()=>{
            console.log("Connected to database")
        }).catch((err)=>{
            console.log(err)
        })
    }

    static getPool(){
        return this.pool;
    }
}
export default Database;