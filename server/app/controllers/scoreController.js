const dataMapper = require('../dataMapper');

module.exports = {
    /**
     * Permet de changer le pool de connexion à la BDD
     * @param {DBHandler} db - Instance du pool de connexion pour les tests 
     */
     setDb: function(db) {
        dataMapper.setDb(db);
    },
    /**
     * Renvoie la liste de tous les scores présents en BDD
     * @param {Request} request
     * @param {Response} response 
     * @returns undefined en environnement de prod, l'argument passeé à la méthode json en environnement de test
     */
     scores: async function(request, response) {
        const {sortBy, sortDir} = request.query;
        try {
            return response.json(await dataMapper.scores(sortBy, sortDir));
        } catch(error) {
            return response.status(500).json(error.message);
        }
    },

    /**
     * Renvoie la liste de tous les scores présents en BDD pour un joueur donné
     * @param {Request} request
     * @param {Response} response 
     * @returns undefined en environnement de prod, l'argument passeé à la méthode json en environnement de test
     */
     scoresFor: async function(request, response) {
        const {playerId} = request.params;
        const {sortBy, sortDir} = request.query;
        try {
            return response.json(await dataMapper.scoresFor(+playerId, sortBy, sortDir));
        } catch(error) {
            return response.status(500).json(error.message);
        }

    },

    /**
     * Ajoute les scores d'une partie en BDD
     * @param {Request} request
     * @param {Response} response 
     * @returns undefined en environnement de prod, l'argument passeé à la méthode json en environnement de test
     */
     addScore: async function(request, response) {
         console.log(request.body);
        try {
            const rows = await dataMapper.addScore(request.body);
            if (rows && rows[0])
                return response.status(201).json(rows[0]);
            throw new Error('Une erreur est survenu, le sore n\'a pas pu être ajouté');
        } catch(error) {
            return response.status(500).json(error.message);
        }
    }
}