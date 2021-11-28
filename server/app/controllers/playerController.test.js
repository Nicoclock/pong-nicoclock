require('dotenv').config();
const playerController = require('./playerController');

const DBHandler = require('../database/DBHandler');
const DBTestSetup = require('../database/DBTestSetup');

describe('DataMapper', () => {
    let env;
    let db;

    const responseMock = {
        json: (data) => data
    }

    beforeAll(async () => {
        //création d'un user et d'un schéma sur lequel on déploie les migrations
        //ce schéma est dédié aux tests, le schéma de prod restera intact
        try {
            const schema = 'test3';
            env = new DBTestSetup(schema);
            await env.init();
            await env.seed('/data/seed.sql');
            db = new DBHandler();
            await db.openPool({user: schema, password: schema});
            playerController.setDb(db);
        } catch(error) {
            throw error;
        }
    });

    test('players', async () => {
        try {
            const rows = await playerController.players({}, responseMock);
            expect(rows.length).toBe(10);
        } catch (error) {
            throw error;
        }
    });


    afterAll(async () => {
        try {
            await db.closePool();
            await env.destroy();
        } catch (error) {
            throw error;
        }
    });
});

