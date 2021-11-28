/**
 * Ce module est expérimental
 * 
 * Il permet de 
 * - créer un schéma de test 
 * - déployer les migrations sqitch
 * - de seeder les tables depuis un script sql
 * 
 * TODO : 
 * - mieux gérer les erreurs (https://github.com/Nicoclock/pong-nicoclock/issues/1)
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
        // connexion avec le superuser pour créer/supprimer les objects en BDD
        this.rootHandler = new DBHandler();
    }

    async init() {
        try {
            await this.rootHandler.openPool();

            const query = `
            -- création de l'utilisateur de test
            CREATE USER ${this.schema} WITH SUPERUSER PASSWORD '${this.schema}';
            -- création du schéma de test
            CREATE SCHEMA ${this.schema};
            -- création du schéma sqitch associé pour la gestion des migrations
            CREATE SCHEMA sqitch_${this.schema};
            `;
            await this.rootHandler.execute(query);
            // déploiement des migrations existantes
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
            // reset du sché de test
            await this.sqitch.revert();

            const query = `
            -- suppression des tables du schéma sqitch
            DROP TABLE IF EXISTS 
                sqitch_${this.schema}.releases, 
                sqitch_${this.schema}.projects, 
                sqitch_${this.schema}.changes, 
                sqitch_${this.schema}.tags, 
                sqitch_${this.schema}.dependencies, 
                sqitch_${this.schema}.events;
            -- suppression du schéma sqitch
            DROP SCHEMA sqitch_${this.schema};
            -- suppression du schéma de test
            DROP SCHEMA ${this.schema};
            -- suppression de l'utilisateur de test
            DROP USER ${this.schema};
            `;
            await this.rootHandler.execute(query);
            await this.rootHandler.closePool();
        } catch(error) {
            throw error;
        }
    }
}

module.exports = DBTestSetup;