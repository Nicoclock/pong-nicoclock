const format = require('pg-format');
const DBHandler = require('./database/DBHandler');

let db;

module.exports = {
    /**
     * Permet de changer le pool de connexion à la BDD
     * @param {DBHandler} pool 
     */
    setDb: async function(pool) {
        if (db && db !== pool)
            await db.closePool();
        db = pool;
    },
    /**
     * Initialise la connexion pour l'environnement de prod
     */
    checkDb: async function() {
        if (!db)
            db = await (new DBHandler()).openPool();
    },
    scores: async function(sortBy='date', sortDir='DESC') {
        try {
            await this.checkDb();
            return await db.execute(
                format('SELECT * FROM scores ORDER BY %I %s', sortBy, sortDir ? sortDir : '')
            );
        } catch (error) {
            if (error.detail)
                throw new Error(error.detail);
            throw error;
        }
    },
    scoresFor: async function(playerId, sortBy='date', sortDir='DESC') {
        try {
            await this.checkDb();
            const rows = await db.execute(
                format('SELECT * FROM scores_for($1) ORDER BY %I %s', sortBy, sortDir ? sortDir : ''),
                [playerId]
            );
            //aucun enregistrement trouvé
            if (rows === 0)
                return [];
            
            return rows;
        } catch (error) {
            if (error.detail)
                throw new Error(error.detail);
            throw error;
        }
    },
    addScore: async function(json) {
        try {
            await this.checkDb();
            return await db.execute('SELECT add_score($1) AS game_id', [json]);
        } catch (error) {
            if (error.detail)
                throw new Error(error.detail);
            throw error;
        }
    },

    players: async function() {
        try {
            await this.checkDb();
            return await db.execute('SELECT * FROM player ORDER BY name');
        } catch (error) {
            if (error.detail)
                throw new Error(error.detail);
            throw error;
        }
    }

};
