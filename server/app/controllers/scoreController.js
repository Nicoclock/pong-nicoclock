const dataMapper = require('../dataMapper')();

module.exports = {
    scores: async function(request, response) {
        await dataMapper.scores();
    },

    scoresFor: async function(request, response) {

    },

    addScore: async function(request, response) {

    }
}