/**
 * Validation des paramètres lors d'une requête pour les scores d'un joueur
 */

const Joi = require('joi');

module.exports = Joi.object({
    playerId: Joi.string().pattern(/\d+/).required(),
});