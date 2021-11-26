require('dotenv').config();
const dataMapper = require('./dataMapper');

const DBHandler = require('./database/DBHandler');
const DBTestSetup = require('./database/DBTestSetup');

describe('DataMapper', () => {
    let env;
    let db;

    beforeAll(async () => {
        //création d'un user et d'un schéma sur lequel on déploie les migrations
        //ce schéma est dédié aux tests, le schéma de prod restera intact
        try {
            const schema = 'test2';
            env = new DBTestSetup(schema);
            await env.init();
            await env.seed('/data/seed.sql');
            db = new DBHandler();
            await db.openPool({user: schema, password: schema});
            dataMapper.setDb(db);
        } catch(error) {
            throw error;
        }
    });

    test('scores', async () => {
        try {
            const rows = await dataMapper.scores();
            expect(rows.length).toBe(10)
            expect(rows[0].date.getTime()).toBeGreaterThan(rows[9].date.getTime())
        } catch (error) {
            throw error;
        }
    });

    describe('scoresFor', () => {
        test('scoresFor avec playerId valide', async () => {
            try {
                const rows = await dataMapper.scoresFor(8, 'date', 'ASC');
                expect(rows.length).toBe(3)
                expect(rows[0].date.getTime()).toBeLessThan(rows[2].date.getTime())
            } catch (error) {
                throw error;
            }
        });

        test('scoresFor avec playerId invalide', async () => {
            try {
                const rows = await dataMapper.scoresFor(25);
                expect(rows.length).toBe(0)
            } catch (error) {
                throw error;
            }
        });
    });

    test('addScore', async () => {
        try {
            const rows = await dataMapper.addScore({
                joueur1: 5,
                score1: 11,
                joueur2: 8,
                score2: 5
            });
            expect(rows.length).toBe(1);
            expect(rows[0].game_id).toBe(11);
            const recs = await dataMapper.scores();
            expect(recs.length).toBe(11)
        } catch (error) {
            throw error;
        }
    });

    test('players', async () => {
        try {
            const rows = await dataMapper.players();
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

