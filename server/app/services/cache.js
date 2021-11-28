/**
 * Gestion du cache avec Redis
 */

const redis = require('redis');

const TIMEOUT = 60 * 30; // 30 minutes

class Cache {
    db;
    // liste des entrées dans Redis
    keys = [];
    connected = false;

    constructor(project) {
        this.prefix = `${project}:`;
        this.db = redis.createClient();
    }

    /**
     * Middleware qui va checker le cache en fonction de l'url de la requête
     * Si les data sont présentes en cache, elles sont renvoyées directement
     * Sinon, on crée une méthode response.json custom afin de procéder à la mise en cache sans modifier le code des contrôleurs
     * @param {Request} request 
     * @param {Response} response 
     * @param {function} next 
     */
    cache = async function(request, response, next) {
        // console.log(request.url);
        try {
            if (!this.connected) {
                await this.db.connect();
                this.connected = true;
            }
            const url = `${this.prefix}${request.url}`;
            if (this.keys.includes(url)) {
                // console.log('Getting from cache');
                const cachedString = await this.db.get(url);
                const cachedValue = JSON.parse(cachedString);
                response.json(cachedValue);
            } else {
                const responseJson = response.json.bind(response);
                // méthode custom pour la mise en cache des data
                response.json = async data => {
                    // console.log('Getting from postgres');
                    await this.db.set(url, JSON.stringify(data), {EX: TIMEOUT, NX: true});
                    this.keys.push(url);
                    responseJson(data);
                }
                next();
            }
        } catch(error) {
           throw error;
        }
    };

    /**
     * Suppression de toutes les entrées listées dans keys
     * Cette méthode est utilisée dans le middleware flush et dans l'environnement de test pour nettoyer la base Redis
     */
    directFlush = async function() {
        try {
            // console.log('flushing cache', this.keys);
            for (const key of this.keys)
                await this.db.del(key);
            let key;
            while(key=this.keys.shift())
                await this.db.del(key);
        } catch(error) {
            throw error;
        }
    };

    flush = async function(request, response, next) {
        try {
            if (!this.connected) {
                await this.db.connect();
                this.connected = true;
            }
            await this.directFlush();
            next();
        } catch(error) {
            throw error;
        }
    };

    async close() {
        if(this.connected) {
            try {
                await this.db.quit();
                this.connected = false;
            } catch (error) {
                throw error
            }
        }
    }
}



module.exports = Cache;