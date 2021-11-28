require('dotenv').config();
const scoreController = require('./scoreController');

const DBHandler = require('../database/DBHandler');
const DBTestSetup = require('../database/DBTestSetup');

describe('DataMapper', () => {
    let env;
    let db;

    const responseMock = {
        statusCode: 200,
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: (data) => data
    }

    beforeAll(async () => {
        //création d'un user et d'un schéma sur lequel on déploie les migrations
        //ce schéma est dédié aux tests, le schéma de prod restera intact
        try {
            const schema = 'test4';
            env = new DBTestSetup(schema);
            await env.init();
            await env.seed('/data/seed.sql');
            db = new DBHandler();
            await db.openPool({user: schema, password: schema});
            scoreController.setDb(db);
        } catch(error) {
            throw error;
        }
    });

    describe('scores', () => {
        test('scores par date desc', async () => {
            const requestMock = {
                query: {}
            };
            try {
                const rows = await scoreController.scores(requestMock, responseMock);
                expect(rows.length).toBe(10);
                expect(rows[0].date.getTime()).toBeGreaterThan(rows[9].date.getTime());
            } catch (error) {
                throw error;
            }
        });
    
        test('scores par score1 asc', async () => {
            const requestMock = {
                query: {
                    sortBy: 'score1',
                    sortDir: 'ASC'
                }
            };
            try {
                const rows = await scoreController.scores(requestMock, responseMock);
                expect(rows.length).toBe(10);
                expect(rows[0].score1).toBeLessThan(rows[9].score1);
            } catch (error) {
                throw error;
            }
        });
    
        test('scores par score2 desc', async () => {
            const requestMock = {
                query: {
                    sortBy: 'score2',
                }
            };
            try {
                const rows = await scoreController.scores(requestMock, responseMock);
                expect(rows.length).toBe(10);
                expect(rows[0].score2).toBeGreaterThan(rows[9].score2);
            } catch (error) {
                throw error;
            }
        });
    });

    describe('scoresFor', () => {
        test('Sans playerId', async () => {
            const requestMock = {
                params: {},
                query: {}
            }
            try {
                const rows = await scoreController.scoresFor(requestMock, responseMock);
                expect(rows).toMatch('invalid input syntax');
            } catch(error) {
                throw error;
            }
        });        

        test('Avec un playerId invalide', async () => {
            const requestMock = {
                params: {
                    playerId: 25
                },
                query: {}
            }
            try {
                const rows = await scoreController.scoresFor(requestMock, responseMock);
                expect(rows.length).toBe(0);
            } catch(error) {
                throw error;
            }
        });        

        test('Avec un playerId valide', async () => {
            const requestMock = {
                params: {
                    playerId: 8
                },
                query: {}
            }
            try {
                const rows = await scoreController.scoresFor(requestMock, responseMock);
                expect(rows.length).toBe(3);
            } catch(error) {
                throw error;
            }
        });        

        test('Avec un playerId valide par adversaire DESC', async () => {
            const requestMock = {
                params: {
                    playerId: 8
                },
                query: {
                    sortBy: 'adversaire',
                    sortDir: 'DESC'
                }
            }
            try {
                const rows = await scoreController.scoresFor(requestMock, responseMock);
                expect(rows.length).toBe(3);
                expect(rows[0].adversaire.charCodeAt(0)).toBeGreaterThanOrEqual(rows[2].adversaire.charCodeAt(0))
            } catch(error) {
                throw error;
            }
        });        
    });

    describe('addScore', () => {
        test('Sans data', async () => {
            const requestMock = {
                body: {},
            }
            try {
                const rows = await scoreController.addScore(requestMock, responseMock);
                expect(rows).toMatch('Failing row contains');
            } catch(error) {
                throw error;
            }
        });        

        test('Avec data', async () => {
            const requestMock = {
                body: {
                    joueur1: 3,
                    score1: 11,
                    joueur2: 7,
                    score2: 5
                },
                query: {}
            }
            try {
                const rows = await scoreController.addScore(requestMock, responseMock);
                expect(typeof rows).toBe('object');
                expect(rows).toHaveProperty('game_id');
                expect(rows.game_id).toBe(12);
                const recs =  await scoreController.scores(requestMock, responseMock);
                expect(recs.length).toBe(11);
            } catch(error) {
                throw error;
            }
        });        
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

