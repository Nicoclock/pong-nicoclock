const {Pool} = require('pg');

class DBHandler {
    pool;
    client;

    openPool(config={}) {
        this.pool = new Pool({
            user: process.env.DBUSER, 
            password: process.env.DBPASSWORD, 
            host: process.env.DBHOST, 
            port: 5432, 
            database: process.env.PGDATABASE,
            ...config      
        });
    };

    async execute(sql, data) {
        try {
            this.client = await this.pool.connect();
            const result = await this.client.query(sql, data);
            await this.client.release(true);
            return result.rows && result.rows.length ? result.rows : result.rowCount;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async closePool() {
        await this.pool.end();
    }

}

module.exports = DBHandler;