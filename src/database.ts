import mysql from 'promise-mysql'
import {key} from  './keys';

class database {

    cnn: any;

    async conectarBD() {
        
        this.cnn = await mysql.createPool({            
            connectionLimit: key.connectionLimit,
            host: key.host,
            user: key.user,            
            password: key.password,
            database: key.database
        });
    }

    getC() {
        return this.cnn;
    }

    private desconectarDB() {
        //this.cnn.disposer;
        this.cnn.end(() => {
            //console.log("error:");            
          });
    }

    async querySelect(sql: string, data?: any) {

        let result: any = null;
        if (!data) {
            result = await this.cnn.query(sql);
        } else {
            result = await this.cnn.query(sql, data);
        }
        //await this.cnn;
        //this.cnn = null;
        //this.desconectarDB();
        return result;
    }
}

const db = new database();
db.conectarBD();
export default db;