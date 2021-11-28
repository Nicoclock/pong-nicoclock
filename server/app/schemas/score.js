/**
 * Validation des data reçues en POST lors de l'ajout d'un score
 */

const Joi = require('joi');

module.exports = Joi.object({
    joueur1: Joi.number().integer().min(1).required(),
    score1: Joi.number().integer().min(0).max(11).required(),
    joueur2: Joi.number().integer().min(1).required(),
    score2: Joi.number().integer().min(0).max(11).required()
});