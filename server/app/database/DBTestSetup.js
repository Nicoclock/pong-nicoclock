/**
 * Ce module est expérimental
 * 
 * Il permet de 
 * - créer un schéma de test 
 * - déployer les migrations sqitch
 * - de seeder les tables depuis un script sql
 * 
 * TODO : 
 * - mieux gérer les erreurs
 */


const SqitchHandler = require('./sqitchHandler');
const DBHandler = require('./DBHandler');

class DBTestSetup {

    schema;
    sqitch;
    rootHandler;

    constructor(schema) {
        this.schema = schema;
        this.sqitch = new SqitchHandler(this.schema);
        this.rootHandler = new DBHandler();
    }

    async init() {
        try {
            await this.rootHandler.openPool();
            await this.rootHandler.execute(`CREATE USER ${this.schema} WITH SUPERUSER PASSWORD '${this.schema}'`);
            await this.rootHandler.execute(`CREATE SCHEMA ${this.schema}`);
            await this.rootHandler.execute(`CREATE SCHEMA sqitch_${this.schema}`);
            await this.sqitch.deploy();
        } catch(error) {
            throw error;
        }
    }

    async seed(filePath) {
        return await this.sqitch.seed(filePath);
    };

    async destroy() {
        try {
            await this.sqitch.revert();
            await this.rootHandler.execute(`DROP TABLE IF EXISTS sqitch_${this.schema}.releases, sqitch_${this.schema}.projects, sqitch_${this.schema}.changes, sqitch_${this.schema}.tags, sqitch_${this.schema}.dependencies, sqitch_${this.schema}.events`);
            await this.rootHandler.execute(`DROP SCHEMA sqitch_${this.schema}`);
            await this.rootHandler.execute(`DROP SCHEMA ${this.schema}`);
            await this.rootHandler.execute(`DROP USER ${this.schema}`);
            await this.rootHandler.closePool();
        } catch(error) {
            throw error;
        }
    }
}

module.exports = DBTestSetup;