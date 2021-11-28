require('dotenv').config();
const format = require('pg-format');
const DBHandler = require('./DBHandler');
const DBTestSetup = require('./DBTestSetup');


describe('Base PostgreSQL', () => {
    let env;
    let db;

    beforeAll(async () => {
        //création d'un user et d'un schéma sur lequel on déploie les migrations
        //ce schéma est dédié aux tests, le schéma de prod restera intact
        try {
            const schema = 'test1';
            env = new DBTestSetup(schema);
            await env.init();
            await env.seed('/data/seed.sql');
            db = new DBHandler();
            await db.openPool({user: schema, password: schema});
        } catch(error) {
            throw error;
        }
    });

    describe('Tables', () => {
        test('Table game', async () => {
            try {
                const rows = await db.execute('SELECT * FROM game');
                expect(rows.length).toBe(10);
                expect(rows[0]).toHaveProperty('id');
                expect(typeof rows[0].id).toBe('number');
                expect(rows[0]).toHaveProperty('date');
                expect(typeof rows[0].date).toBe('object');
                expect(rows[0].date).toBeInstanceOf(Date);
            } catch(error) {
                throw error;
            }
        });
        test('Table player', async () => {
            try {
                const rows = await db.execute('SELECT * FROM player');
                expect(rows.length).toBe(10);
                expect(rows[0]).toHaveProperty('id');
                expect(typeof rows[0].id).toBe('number');
                expect(rows[0]).toHaveProperty('name');
                expect(typeof rows[0].name).toBe('string');
            } catch(error) {
                throw error;
            }
        });
        test('Table score', async () => {
            try {
                const rows = await db.execute('SELECT * FROM score');
                expect(rows.length).toBe(20);
                expect(rows[0]).toHaveProperty('id');
                expect(typeof rows[0].id).toBe('number');
                expect(rows[0]).toHaveProperty('game_id');
                expect(typeof rows[0].game_id).toBe('number');
                expect(rows[0]).toHaveProperty('player_id');
                expect(typeof rows[0].player_id).toBe('number');
                expect(rows[0]).toHaveProperty('points');
                expect(typeof rows[0].points).toBe('number');
            } catch(error) {
                throw error;
            }
        });
    });

    describe('view', () => {
        test('scores', async () => {
            try {
                const rows = await db.execute('SELECT * FROM scores');
                expect(rows.length).toBe(10);
                expect(rows[0]).toHaveProperty('game_id');
                expect(typeof rows[0].game_id).toBe('number');
                expect(rows[0]).toHaveProperty('date');
                expect(typeof rows[0].date).toBe('object');
                expect(rows[0].date).toBeInstanceOf(Date);
                expect(rows[0]).toHaveProperty('joueur1');
                expect(typeof rows[0].joueur1).toBe('string');
                expect(rows[0]).toHaveProperty('score1');
                expect(typeof rows[0].score1).toBe('number');
                expect(rows[0]).toHaveProperty('joueur2');
                expect(typeof rows[0].joueur2).toBe('string');
                expect(rows[0]).toHaveProperty('score2');
                expect(typeof rows[0].score2).toBe('number');
            } catch(error) {
                throw error;
            }
        });

        const sortBy = 'date';

        test('scores by date DESC', async () => {
            const sortDir = 'DESC';
            try {
                const rows = await db.execute(
                    format('SELECT * FROM scores ORDER BY %I %s', sortBy, sortDir ? sortDir : '')
                );
                expect(rows.length).toBe(10);
                expect(rows[0].date.getTime()).toBeGreaterThan(rows[9].date.getTime());
            } catch(error) {
                throw error;
            }
        });
        test('scores by date ASC', async () => {
            const sortDir = 'ASC';
            try {
                const rows = await db.execute(
                    format('SELECT * FROM scores ORDER BY %I %s', sortBy, sortDir ? sortDir : '')
                );
                expect(rows.length).toBe(10);
                expect(rows[0].date.getTime()).toBeLessThan(rows[9].date.getTime());
            } catch(error) {
                throw error;
            }
        });

        test('scores by date', async () => {
            const sortDir = '';
            try {
                const rows = await db.execute(
                    format('SELECT * FROM scores ORDER BY %I %s', sortBy, sortDir ? sortDir : '')
                );
                expect(rows.length).toBe(10);
                expect(rows[0].date.getTime()).toBeLessThan(rows[9].date.getTime());
            } catch(error) {
                throw error;
            }
        });
    });

    describe('functions', () => {
        test('scores_for avec id invalide', async () => {
            try {
                const playerId = 18;
                const rows = await db.execute('SELECT * FROM scores_for($1)', [playerId]);
                expect(rows).toBe(0);
            } catch(error) {
                throw error;
            }
        });

        test('scores_for', async () => {
            try {
                const playerId = 8;
                const rows = await db.execute('SELECT * FROM scores_for($1)', [playerId]);
                expect(rows.length).toBe(3);
                expect(rows[0]).toHaveProperty('game_id');
                expect(typeof rows[0].game_id).toBe('number');
                expect(rows[0]).toHaveProperty('date');
                expect(typeof rows[0].date).toBe('object');
                expect(rows[0].date).toBeInstanceOf(Date);
                expect(rows[0]).toHaveProperty('joueur');
                expect(typeof rows[0].joueur).toBe('string');
                expect(rows[0]).toHaveProperty('score1');
                expect(typeof rows[0].score1).toBe('number');
                expect(rows[0]).toHaveProperty('adversaire');
                expect(typeof rows[0].adversaire).toBe('string');
                expect(rows[0]).toHaveProperty('score2');
                expect(typeof rows[0].score2).toBe('number');
            } catch(error) {
                throw error;
            }
        });

        test('add_score', async () => {
            try {
                const rows = await db.execute('SELECT add_score($1) AS game_id', [{
                    joueur1: 5,
                    score1: 10,
                    joueur2: 7,
                    score2: 11
                }]);
                const recs = await db.execute('SELECT * FROM scores WHERE game_id=$1', [rows[0].game_id]);
                expect(recs[0]).toBeTruthy();
                expect(recs[0].joueur1).toBe('Gandalf');
                expect(recs[0].score1).toBe(10);
                expect(recs[0].joueur2).toBe('Legolas');
                expect(recs[0].score2).toBe(11);
            } catch(error) {
                throw error;
            }
        });
    });

    afterAll(async () => {
        await db.closePool();
        await env.destroy();
    });
});
