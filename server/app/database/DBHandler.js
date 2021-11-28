const {Pool} = require('pg');

class DBHandler {
    pool;
    client;

    openPool(config={}) {
        //l'object config optionnel permet d'écraser les valeurs par défaut des variables de connexion
        this.pool = new Pool({
            user: process.env.PGUSER, 
            password: process.env.PGPASSWORD, 
            host: process.env.PGHOST, 
            port: 5432, 
            database: process.env.PGDATABASE,
            ...config      
        });
        return this;
    };

    /**
     * Méthode pour exécuter des requêtes SQL sur le serveur de BDD
     * @param {string} sql - texte SQL de la requête
     * @param {array} data - tableau de data pour se protéger des injections SQL
     * @returns un tableau d'enregistrement | le nb de recs impatés par la requête si rows n'est pas défini
     */
    async execute(sql, data) {
        try {
            this.client = await this.pool.connect();
            const result = await this.client.query(sql, data);
            await this.client.release(true);
            return result.rows && result.rows.length ? result.rows : result.rowCount;
        } catch (error) {
            // en cas d'erreur, on s'assure de libérer les ressources
            if (this.client)
                await this.client.release(true);
            console.log(error);
            throw error;
        }
    };

    /**
     * Fermeture du pool de connexion
     */
    async closePool() {
        await this.pool.end();
    }

}

module.exports = DBHandler;