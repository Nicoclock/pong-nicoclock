const {Router} = require('express');
const Cache = require('./services/cache');
const {scoreSchema, scoresForSchema} = require('./schemas');
const {validateBody, validateParams} = require('./services/validator');
const controllers = require('./controllers');
const {playerController, scoreController} = controllers;

/**
 * Fonction permettant de configurer les connexions pour les tests
 * @param {DBHandler} testDb 
 * @param {Cache} testRedis 
 * @returns le router configuré
 */
const createRouter = (testDb, testRedis) => {
    const router = Router();
    let redis;
    let cache;
    let flush;    

    if (process.env.NODE_ENV === 'test') {
        for (const name in controllers)
            controllers[name].setDb(testDb);
        redis = testRedis;
    } else
        redis = new Cache('pong');

    cache = redis.cache.bind(redis);
    flush = redis.flush.bind(redis);
    
    
    /**
     * Scores of a game
     * @typedef {object} Score
     * @property {number} game_id 
     * @property {string} date - Date of the end of the game 
     * @property {string} joueur1 - Name of player 1
     * @property {number} score1 - Score of player 1
     * @property {string} joueur2 - Name of player 2 
     * @property {number} score2 - Score of player 2 
     */
    
    /**
     * Scores of a game for a specific player
     * @typedef {object} PlayerScore
     * @property {number} game_id 
     * @property {string} date - Date of the end of the game 
     * @property {string} joueur - Name of the specific player
     * @property {number} score1 - Score of the specific player
     * @property {string} adversaire - Name of the opponent
     * @property {number} score2 - Score of the opponent
     */
    
    /**
     * New score of a game
     * @typedef {object} NewScorePost
     * @property {number} joueur1 - Id of player 1
     * @property {number} score1 - Score of player 1
     * @property {number} joueur2 - Id of player 2 
     * @property {number} score2 - Score of player 2 
     */
    
    /**
     * Object received after adding scores
     * @typedef {object} NewScoreResult
     * @property {number} game_id - Id of the newly created game
     */

    /**
     * Player
     * @typedef {object} Player
     * @property {number} id
     * @property {string} name
     */
    
    
    /**
     * GET /api/scores
     * @summary List of all scores
     * @tags Scores
     * @param {string} sortBy.query.optional - The field name to be used for sorting
     * @param {string} sortDir.query.optional - The direction to be used for sorting
     * @return {array<Score>} 200 - An array of scores
     * @return {string} 500 - Server or SQL error message
     */
    router.get('/scores', cache, scoreController.scores);
    
    /**
     * GET /api/scores/{playerId}
     * @summary List of all scores for a specific user
     * @tags Scores
     * @param {number} playerId.path.required - The field name to be used for sorting
     * @param {string} sortBy.query.optional - The field name to be used for sorting
     * @param {string} sortDir.query.optional - The direction to be used for sorting
     * @return {array<PlayerScore>} 200 - An array of scores for a specific player
     * @return {string} 400 - Invalid query message
     * @return {string} 500 - Server or SQL error message
     */
    router.get('/scores/:playerId', cache, validateParams(scoresForSchema), scoreController.scoresFor);
    
    /**
     * POST /api/scores
     * @summary Add a new game score in database
     * @tags Scores
     * @param {NewScorePost} request.body.required - application/json
     * @return {NewScoreResult} 200 - Object containing the newly created game id
     * @return {string} 400 - Invalid query message
     * @return {string} 500 - Server or SQL error message
     */
    router.post('/scores', flush, validateBody(scoreSchema), scoreController.addScore);
    
    /**
     * GET /api/players
     * @summary List of all scores
     * @tags Players
     * @return {array<Player>} 200 - An array of all registered players
     * @return {string} 500 - Server or SQL error message
     */
    router.get('/players', cache, playerController.players)

    return router;
    
}

// on exporte une fonction afin de pouvoir configurer les connexion à Postgres et à Redis lors des tests
module.exports = createRouter;