require('dotenv').config();
const request = require('supertest');
const DBHandler = require('./app/database/DBHandler');
const DBTestSetup = require('./app/database/DBTestSetup');
const Cache = require('./app/services/cache');

describe('Server', () => {
    let env;
	let http;
    let db;
	let redis;

    beforeAll(async () => {
        //création d'un user et d'un schéma sur lequel on déploie les migrations
        //ce schéma est dédié aux tests, le schéma de prod restera intact
        try {
            const schema = 'test5';
            env = new DBTestSetup(schema);
            await env.init();
            await env.seed('/data/seed.sql');
            db = new DBHandler();
            await db.openPool({user: schema, password: schema});
			redis = new Cache(`pong_${schema}`);
			http = require('./server')(db, redis);
        } catch(error) {
            throw error;
        }
    });

    test('GET /scores', async () => {
		try {
			const response = await request(http).get('/api/scores');
			expect(response.statusCode).toBe(200);
			expect(response.body.length).toBe(10);
        } catch(error) {
            throw error;
        }
    });

	describe('GET /scores/:playerId', () => {
		test('GET /scores/:playerId avec playerId invalide', async () => {
			try {
				const response = await request(http).get('/api/scores/test');
				expect(response.statusCode).toBe(400);
				expect(typeof response.body).toBe('string');
			} catch(error) {
				throw error;
			}
		});
	
		test('GET /scores/:playerId avec playerId inexistant', async () => {
			try {
				const response = await request(http).get('/api/scores/25');
				expect(response.statusCode).toBe(200);
				expect(response.body.length).toBe(0);
			} catch(error) {
				throw error;
			}
		});
	
		test('GET /scores/:playerId avec playerId valide', async () => {
			try {
				const response = await request(http).get('/api/scores/8');
				expect(response.statusCode).toBe(200);
				expect(response.body.length).toBe(3);
			} catch(error) {
				throw error;
			}
		});
	});

	describe('POST /scores', () => {
		test('POST /scores sans data', async () => {
			const response = await request(http).post('/api/scores').set('Content-Type', 'application/json').send({});
			expect(response.statusCode).toBe(400);
			expect(typeof response.body).toBe('string');
		});

		test('POST /scores avec data incomplètes', async () => {
			const data = {
				joueur1: 5
			}
			const response = await request(http).post('/api/scores').set('Content-Type', 'application/json').send(data);
			expect(response.statusCode).toBe(400);
			expect(typeof response.body).toBe('string');
		});

		test('POST /scores avec data valides', async () => {
			const data = {
                joueur1: 5,
                score1: 11,
                joueur2: 8,
                score2: 5
			}
			const response = await request(http).post('/api/scores').set('Content-Type', 'application/json').send(data);
			console.log(response.body);
			expect(response.statusCode).toBe(201);
			expect(typeof response.body).toBe('object');
			expect(response.body).toHaveProperty('game_id');
			expect(typeof response.body.game_id).toBe('number');
		});
	});

	test('GET /players', async () => {
		const response = await request(http).get('/api/players');
		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBe(10);
	});

    afterAll(async () => {
		try {
			await redis.directFlush();
			await redis.close();
			await db.closePool();
			await http.close();
			await env.destroy();
		} catch (error) {
			throw error;
		}
	});
});
